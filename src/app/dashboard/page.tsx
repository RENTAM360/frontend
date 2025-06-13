import { EquipmentCategory } from "@/components/equipment-category"
import { PopularEquipment } from "@/components/popular-equipment"
import { Vehicles } from "@/components/vehicles"

export default function DashboardPage() {
    return (
      <div className="space-y-6 mt-6 md:mt-10 font-sans">
      
        <PopularEquipment />
        <Vehicles />
        <EquipmentCategory title="Vehicles" limit={10} />
      </div>
    )
  }
  