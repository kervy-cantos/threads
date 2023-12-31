'use server';

import { FilterQuery, SortOrder } from 'mongoose';
import { revalidatePath } from 'next/cache';

import User from '../models/user.model';

import { connectToDatabase } from '../mongoose';
import Post from '../models/post.model';

export async function fetchUser(userId: string) {
	try {
		connectToDatabase();

		return await User.findOne({ id: userId });
	} catch (error: any) {
		throw new Error(`Failed to fetch user: ${error.message}`);
	}
}

interface Params {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({ userId, bio, name, path, username, image }: Params): Promise<void> {
	try {
		connectToDatabase();

		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				bio,
				image,
				onboarded: true
			},
			{ upsert: true }
		);

		if (path === '/profile/edit') {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create/update user: ${error.message}`);
	}
}

export async function fetchUserPosts(userId: string) {
	try {
		connectToDatabase();

		const posts = await User.findOne({ id: userId }).populate({
			path: 'posts',
			model: Post,
			populate: {
				path: 'children',
				model: Post,
				populate: {
					path: 'author',
					model: User,
					select: 'name image id'
				}
			}
		});
		return posts;
	} catch (error: any) {
		throw new Error(`Failed to fetch posts: ${error.message}`);
	}
}
