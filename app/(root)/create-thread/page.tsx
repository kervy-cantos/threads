import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Post from "@/components/forms/Post";




const Page = async () => {
    const user = await currentUser();
    if (!user) return null

    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded) return redirect('/onboard')
    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <Post userId={userInfo._id} />
        </>

    )
}

export default Page