import { EquipmentCard } from "./equipment-card"

const vehicles = [
  {
    id: "1",
    title: "Drill Bit Set",
    category: "Drilling Equipment",
    pricePerDay: 1500,
    rating: 4.5,
    imageUrl: "/toyota-red.svg",
  },
  {
    id: "2",
    title: "Mud Pump",
    category: "Pumping Equipment",
    pricePerDay: 2200,
    rating: 4.2,
    imageUrl: "/excavator.svg",
  },
  {
    id: "3",
    title: "Pipe Handler",
    category: "Handling Equipment",
    pricePerDay: 1800,
    rating: 4.7,
    imageUrl: "/generator.svg",
  },
  {
    id: "4",
    title: "Offshore Crane",
    category: "Lifting Equipment",
    pricePerDay: 3000,
    rating: 4.0,
    imageUrl: "/keyboard.svg",
  },
  {
    id: "5",
    title: "ROV (Remotely Operated Vehicle)",
    category: "Underwater Equipment",
    pricePerDay: 2800,
    rating: 4.8,
    imageUrl: "/toyota-black.svg",
  },
  {
    id: "6",
    title: "Top Drive System",
    category: "Drilling Equipment",
    pricePerDay: 3500,
    rating: 4.3,
    imageUrl: "/excavator.svg",
  },
]

export const Vehicles = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Vehicles</h2>
      <div className="md:flex grid grid-cols-1 gap-4 overflow-x-auto md:-mr-8 hide-scrollbar">
        {vehicles.map((vehicle) => (
          <EquipmentCard key={vehicle.id} {...vehicle} variant="default"/>
        ))}
      </div>
    </div>
  )
}
