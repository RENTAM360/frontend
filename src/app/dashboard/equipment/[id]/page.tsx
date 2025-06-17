import EquipmentDetailsClient from "@/components/equipment-profile-client";

export default async function EquipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  <EquipmentDetailsClient equipmentId={id} />

}
