import { PopularEquipment } from "@/components/popular-equipment"
import { Vehicles } from "@/components/vehicles"

export default function DashboardPage() {
    return (
      <div className="space-y-6 mt-6 md:mt-10 font-sans">
      
        <PopularEquipment />
        <Vehicles />
  
        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h2 className="text-lg font-semibold">Active Rentals</h2>
              <p className="text-sm text-gray-500">Your current equipment rentals</p>
            </div>
            <p className="text-3xl font-bold">3</p>
          </div>
  
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h2 className="text-lg font-semibold">Saved Items</h2>
              <p className="text-sm text-gray-500">Equipment you&apos;ve saved for later</p>
            </div>
            <p className="text-3xl font-bold">12</p>
          </div>
  
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="pb-2">
              <h2 className="text-lg font-semibold">Messages</h2>
              <p className="text-sm text-gray-500">Unread messages from renters/leasers</p>
            </div>
            <p className="text-3xl font-bold">10</p>
          </div>
        </div> */}
  
        {/* <h2 className="mt-10 text-2xl font-bold">Recent Activity</h2>
        <div className="rounded-lg border bg-white">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <p className="font-medium">Drill Bit Set Rental</p>
              <p className="text-sm text-gray-500">Rented from ABC Equipment</p>
            </div>
            <span className="text-sm text-green-500 font-medium">Active</span>
          </div>
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <p className="font-medium">Mud Pump Inquiry</p>
              <p className="text-sm text-gray-500">Message from XYZ Drilling</p>
            </div>
            <span className="text-sm text-blue-500 font-medium">New Message</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Pipe Handler</p>
              <p className="text-sm text-gray-500">Added to saved items</p>
            </div>
            <span className="text-sm text-gray-500 font-medium">Yesterday</span>
          </div>
        </div> */}
      </div>
    )
  }
  