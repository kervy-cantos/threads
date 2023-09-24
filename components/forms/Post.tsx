"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PostValidation } from "@/lib/validations/post";
import { createPost } from "@/lib/actions/post.actions";
// import { updateUser } from "@/lib/actions/user.actions";

interface Props {
    userId: string;
}




const Post = ({ userId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            post: '',
            accountId: userId
        },
    });

    const onSubmit = async (values: z.infer<typeof PostValidation>) => {
        await createPost({
            text: values.post,
            author: userId,
            communityId: null,
            path: pathname,
        })
        router.push('/')
    }

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='post'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={15}
                                    className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-primary-500'>
                    Post
                </Button>
            </form>
        </Form>
    )
}

export default Post;