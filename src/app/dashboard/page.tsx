import { EquipmentCategory } from "@/components/equipment-category"
export default function DashboardPage() {
    return (
      <div className="space-y-6 mt-6 md:mt-10 font-sans">
        <EquipmentCategory title="Vehicles" limit={10} />
      </div>
    )
  }
  