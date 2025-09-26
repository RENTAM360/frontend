"use client"

import { useRouter } from "next/navigation"
import { useGetEquipmentByIdQuery } from "@/lib/redux/api/equipmentApi"
import EditItemForm from "./edit-item-form"


interface EquipmentIdProps {
  equipmentId: string
}

export default function EquipmentClient({ equipmentId }: EquipmentIdProps) {
  const router = useRouter()

  console.log("🔍 Component rendered with equipmentId:", equipmentId)

  const { data: equipmentData, isLoading, error, isError } = useGetEquipmentByIdQuery(equipmentId)

  console.log("📊 Query state:", {
    data: equipmentData,
    isLoading,
    error,
    isError,
    equipmentId,
  })


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12B76A] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading equipment...</h2>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading equipment</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm text-left overflow-auto mb-4">
            {JSON.stringify(error, null, 2)}
          </pre>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 font-sans md:mx-[212px] pt-4 md:mt-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <EditItemForm initialData={equipmentData!} />
      </div>
    </div>
  )
}

