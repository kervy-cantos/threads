import PostCard from "@/components/cards/PostCard"
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPostById } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";

const Page = async ({ params }: { params: { id: string } }) => {
    if (!params.id) return null;
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) redirect('/onboard')

    const post = await fetchPostById(params.id);

    return (
        <section className="relative">
            <div>
                <PostCard
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                />
            </div>
            <div>
                <div className="mt-7"><Comment currentUserImg={userInfo.image} postId={post.id} currentUserId={JSON.stringify(userInfo._id)} /></div>
                <div className="mt-10">
                    {post.children.map((comment: any) => (
                        <PostCard
                            key={comment._id}
                            id={comment._id}
                            currentUserId={comment?.id}
                            parentId={comment.parentId}
                            content={comment.text}
                            author={comment.author}
                            community={comment.community}
                            createdAt={comment.createdAt}
                            comments={comment.children}
                            isComment
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Page