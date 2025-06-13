import UserProfileClient from "@/components/user-profile-client";

export default async function UserProfilePage(props: any) {
  return <UserProfileClient userId={props.params.id} />
}
