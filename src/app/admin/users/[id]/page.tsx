import UserProfileClient from "@/components/user-profile-client";

export default function UserProfilePage(props: any) {
  return <UserProfileClient userId={props.params.id} />
}
