'use server';

import { connectToDatabase } from '../mongoose';
import Post from '../models/post.model';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';

interface createPostParams {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createPost({ text, author, communityId, path }: createPostParams) {
	connectToDatabase();

	try {
		const createdPost = await Post.create({
			text,
			author,
			community: null
		});

		await User.findByIdAndUpdate(author, {
			$push: { posts: createdPost._id }
		});

		revalidatePath(path);
	} catch (error) {
		throw new Error(`Error creating post: ${error}`);
	}
}

export async function fetchPosts(pageNumber: 1, pageSize: 30) {
	connectToDatabase();

	try {
		const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
			.sort({ createdAt: 'desc' })
			.skip((pageNumber - 1) * pageSize)
			.limit(pageSize)
			.populate({ path: 'author', model: 'User' })
			.populate({
				path: 'children',
				populate: {
					path: 'author',
					model: 'User',
					select: '_id name parentId image'
				}
			});

		const totalPostCount = await Post.countDocuments({
			parentId: { $in: [null, undefined] }
		});

		const posts = await postsQuery.exec();
		const isNext = totalPostCount > (pageNumber - 1) * pageSize + posts.length;

		return { posts, isNext };
	} catch (error) {
		throw new Error(`Error fetching posts: ${error}`);
	}
}

export async function fetchPostById(id: string) {
	connectToDatabase();

	try {
		const post = await Post.findById(id)
			.populate({ path: 'author', model: 'User', select: '_id id name image' })
			.populate({
				path: 'children',
				populate: [
					{
						path: 'author',
						model: 'User',
						select: '_id name parentId image'
					},
					{
						path: 'children',
						model: 'Post',
						populate: {
							path: 'author',
							model: 'User',
							select: '_id name parentId image'
						}
					}
				]
			})
			.exec();
		return post;
	} catch (error: any) {
		throw new Error(`Error fetching post: ${error}`);
	}
}

export async function addComment(postId: string, commentText: string, userId: string, path: string) {
	connectToDatabase();

	try {
		const originalPost = await fetchPostById(postId);

		if (!originalPost) {
			throw new Error('Post not found');
		}

		const commentPost = new Post({
			text: commentText,
			author: userId,
			parentId: postId
		});

		const savedComment = await commentPost.save();
		originalPost.children.push(savedComment._id);

		await originalPost.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Error adding comment: ${error}`);
	}
}
