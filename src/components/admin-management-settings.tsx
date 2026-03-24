"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { AdminUser, useGetAdminsQuery } from "@/lib/redux/api/adminApi";

export function AdminManagementSettings({
  onOpenAddModal,
}: {
  onOpenAddModal: () => void;
}) {
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const { data } = useGetAdminsQuery({ page: 1, limit: 50 });

  const admins: AdminUser[] = data?.data.admins || [];

  const handleSelectAdmin = (adminId: string, checked: boolean) => {
    setSelectedAdmins((prev) =>
      checked ? [...prev, adminId] : prev.filter((id) => id !== adminId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedAdmins(checked ? admins.map((admin) => admin._id) : []);
  };

  // const handleAddAdmin = () => {
  //   setIsAddModalOpen(true)
  // }

  const handleDeleteSelected = () => {
    alert("Not implemented yet");
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center mx-6 justify-between mb-8">
        <h2 className="text-lg font-bold">Admin(s) Management</h2>
        <Button
          onClick={onOpenAddModal}
          className="bg-[#17b266] hover:bg-[#149655] text-white px-6 py-2 rounded-lg"
        >
          Add admin
        </Button>
      </div>

      {/* Admin Table */}
      <div className="bg-white overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-12 p-6 border-b bg-[#FBFBFB] border-gray-100">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={
                  selectedAdmins.length === admins.length && admins.length > 0
                }
                onCheckedChange={handleSelectAll}
                className="border-gray-300"
              />
            </div>
            <div className="col-span-3 text-gray-500 text-sm font-medium">
              Admin users
            </div>
            {/* <div className="col-span-2 text-gray-500 text-sm font-medium">Password</div> */}
            <div className="col-span-3 text-gray-500 text-sm font-medium">
              Email
            </div>
            <div className="col-span-3 text-gray-500 text-sm font-medium">
              Role
            </div>
          </div>

          {/* Table Rows */}
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="grid grid-cols-12 gap-12 p-6 border-b border-gray-50 hover:bg-gray-50"
            >
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={selectedAdmins.includes(admin._id)}
                  onCheckedChange={(checked) =>
                    handleSelectAdmin(admin._id, checked as boolean)
                  }
                  className="border-gray-300"
                />
              </div>
              <div className="col-span-3 flex items-center text-xs whitespace-nowrap font-medium">
                {admin.fullName}
              </div>
              {/* <div className="col-span-2 flex items-center text-xs whitespace-nowrap text-gray-600">{admin.password}</div> */}
              <div className="col-span-3 flex items-center text-xs whitespace-nowrap text-gray-600">
                {admin.email}
              </div>
              <div className="col-span-3 flex items-center text-xs whitespace-nowrap text-gray-600">
                {admin.roleName}
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
}
