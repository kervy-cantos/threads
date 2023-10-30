import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileEnd } from "console";
import { profileTabs } from "@/app/constants";
import Image from "next/image";
import PostsTab from "@/components/shared/PostsTab";





const Page = async ({ params }: { params: { id: string } }) => {
	const user = await currentUser();
	if (!user) return null

	const userInfo = await fetchUser(params.id);
	if (!userInfo.onboarded) return redirect('/onboard')
	return (
		<section>
			<ProfileHeader
				accountId={userInfo.id}
				authUserId={user.id}
				name={userInfo.name}
				username={userInfo.username}
				imgUrl={userInfo.image}
				bio={userInfo.bio}
			/>
			<div className="mt-9">
				<Tabs defaultValue="threads" className="w-full">
					<TabsList className="tab">
						{profileTabs.map((tab: any) => (
							<TabsTrigger value={tab.label}>
								<Image
									src={tab.icon}
									alt={tab.label}
									height={24}
									width={24}
									className="object-contain"
								/>
								<p className="max-sm:hidden">{tab.label}</p>
								{tab.label == 'Threads' && (
									<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
										{userInfo?.posts?.length}
									</p>
								)}
							</TabsTrigger>
						))}

					</TabsList>
					{profileTabs.map((tab: any) => (
						<TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
							<PostsTab
								currentUserId={user.id}
								accountId={userInfo.id}
								accountType="User"
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>);
};

export default Page;
