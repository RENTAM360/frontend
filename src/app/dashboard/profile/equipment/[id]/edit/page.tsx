import EquipmentClient from "@/components/equipment-client";

export default async function EquipmentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

return <EquipmentClient equipmentId={id} />

}
