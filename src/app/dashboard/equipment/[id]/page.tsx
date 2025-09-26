import EquipmentDetailsClient from "@/components/equipment-details-client";

export default async function EquipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EquipmentDetailsClient equipmentId={id} />

}
