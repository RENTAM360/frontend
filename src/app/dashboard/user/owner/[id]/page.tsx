import OwnerProfileClient from "@/components/owners-page-client";

export default async function OwnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <OwnerProfileClient userId={id} />

}
