"use server";

import { connectToDatabase } from "../mongoose";
import Post from "../models/post.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPost({ text, author, communityId, path }: Params) {
  connectToDatabase();

  try {
    const createdPost = await Post.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error creating post: ${error}`);
  }
}

export async function fetchPosts(pageNumber: 1, pageSize: 20) {
  connectToDatabase();

  try {
    const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate({ path: "author", model: "User" })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "_id name parentId image",
        },
      });

    const totalPostCount = await Post.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();
    const isNext = totalPostCount > (pageNumber - 1) * pageSize + posts.length;

    return { posts, isNext };
  } catch (error) {
    throw new Error(`Error fetching posts: ${error}`);
  }
}
