import EquipmentProfileClient from "@/components/equipment-profile-client";

export default async function EquipmentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EquipmentProfileClient equipmentId={id} />

}
