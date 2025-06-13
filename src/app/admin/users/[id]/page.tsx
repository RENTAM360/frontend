import UserProfileClient from "@/components/user-profile-client";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return <UserProfileClient userId={params.id} />
}
