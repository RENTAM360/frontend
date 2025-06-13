"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { AddAdminModal } from "@/components/add-admin-modal"

// Mock admin data
const initialAdminData = [
  {
    id: 1,
    name: "ThankGod Ogbonna",
    password: "87367w69ry",
    email: "Thankimedia@gmail.com",
    role: "Users Profile, FAQ",
  },
  {
    id: 2,
    name: "ThankGod Ogbonna",
    password: "87367w69ry",
    email: "Thankimedia@gmail.com",
    role: "Users Profile, FAQ",
  },
  {
    id: 3,
    name: "ThankGod Ogbonna",
    password: "87367w69ry",
    email: "Thankimedia@gmail.com",
    role: "Users Profile, FAQ",
  },
]

export function AdminManagementSettings() {
  const [adminData, setAdminData] = useState(initialAdminData)
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleSelectAdmin = (adminId: number, checked: boolean) => {
    if (checked) {
      setSelectedAdmins([...selectedAdmins, adminId])
    } else {
      setSelectedAdmins(selectedAdmins.filter((id) => id !== adminId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAdmins(adminData.map((admin) => admin.id))
    } else {
      setSelectedAdmins([])
    }
  }

  const handleAddAdmin = () => {
    setIsAddModalOpen(true)
  }

  const handleSaveAdmin = (newAdmin) => {
    const newAdminWithId = {
      ...newAdmin,
      id: adminData.length + 1,
      role: newAdmin.role || "Users Profile, FAQ", // Default role if none selected
    }
    setAdminData([...adminData, newAdminWithId])
    setIsAddModalOpen(false)
  }

  const handleDeleteSelected = () => {
    if (selectedAdmins.length === 0) return

    setAdminData(adminData.filter((admin) => !selectedAdmins.includes(admin.id)))
    setSelectedAdmins([])
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center mx-6 justify-between mb-8">
        <h2 className="text-lg font-bold">Admin(s) Management</h2>
        <Button onClick={handleAddAdmin} className="bg-[#17b266] hover:bg-[#149655] text-white px-6 py-2 rounded-lg">
          Add admin
        </Button>
      </div>

      {/* Admin Table */}
      <div className="bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-12 p-6 border-b bg-[#FBFBFB] border-gray-100">
          <div className="col-span-1 flex items-center">
            <Checkbox
              checked={selectedAdmins.length === adminData.length && adminData.length > 0}
              onCheckedChange={handleSelectAll}
              className="border-gray-300"
            />
          </div>
          <div className="col-span-3 text-gray-500 text-sm font-medium">Admin users</div>
          <div className="col-span-2 text-gray-500 text-sm font-medium">Password</div>
          <div className="col-span-3 text-gray-500 text-sm font-medium">Email</div>
          <div className="col-span-3 text-gray-500 text-sm font-medium">Role</div>
        </div>

        {/* Table Rows */}
        {adminData.map((admin) => (
          <div key={admin.id} className="grid grid-cols-12 gap-12 p-6 border-b border-gray-50 hover:bg-gray-50">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={selectedAdmins.includes(admin.id)}
                onCheckedChange={(checked) => handleSelectAdmin(admin.id, checked as boolean)}
                className="border-gray-300"
              />
            </div>
            <div className="col-span-3 flex items-center text-xs whitespace-nowrap font-medium">{admin.name}</div>
            <div className="col-span-2 flex items-center text-xs whitespace-nowrap text-gray-600">{admin.password}</div>
            <div className="col-span-3 flex items-center text-xs whitespace-nowrap text-gray-600">{admin.email}</div>
            <div className="col-span-3 flex items-center text-xs whitespace-nowrap text-gray-600">{admin.role}</div>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="flex justify-center mt-8">
        <Button
          className="bg-[#17b266] hover:bg-[#149655] text-white px-6 py-2 rounded-lg flex items-center gap-2"
          disabled={selectedAdmins.length === 0}
          onClick={handleDeleteSelected}
        >
          <Trash2 className="w-4 h-4" />
          {selectedAdmins.length} selected
        </Button>
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveAdmin} />
    </div>
  )
}
