import UserProfileClient from "@/components/user-profile-client";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <UserProfileClient userId={id} />
}
