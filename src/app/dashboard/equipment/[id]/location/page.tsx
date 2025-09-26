import EquipmentLocationClient from "@/components/equipment-location-client";

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <EquipmentLocationClient equipmentId={id} />

}
