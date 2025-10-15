import { EquipmentCategory } from "@/components/equipment-category"
export default function DashboardPage() {
    return (
      <div className="font-sans">
        <EquipmentCategory title="Vehicles" limit={20}  />
      </div>
    )
  }
  