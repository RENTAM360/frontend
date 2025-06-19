"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useGetCategoriesQuery, useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { skipToken } from "@reduxjs/toolkit/query"

interface EquipmentCategoryProps {
  title: string
  limit?: number
}

export function EquipmentCategory({ title }: EquipmentCategoryProps) {
  const {
    data: categoryResponse,
  } = useGetCategoriesQuery()

  console.log(categoryResponse)

  const categories = useMemo(() => categoryResponse?.data ?? [], [categoryResponse])

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

   useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId("all")
    }
  }, [categories, selectedCategoryId])

   const {
    data: equipmentResponse,
    isLoading: isLoadingEquipments,
  } = useGetEquipmentsQuery(
    selectedCategoryId && selectedCategoryId !== "all" ? { categoryId: selectedCategoryId } : skipToken
  )

  const allEquipments = useGetEquipmentsQuery(undefined, {
    skip: selectedCategoryId !== "all",
  })

  const equipments =
    selectedCategoryId === "all"
      ? allEquipments.data?.equipments ?? []
      : equipmentResponse?.equipments ?? []

  console.log(categories)

  const isLoading = selectedCategoryId === "all" ? allEquipments.isLoading : isLoadingEquipments

  const selectedCategoryName =
    selectedCategoryId === "all"
      ? "All Equipments"
      : categories.find((cat) => cat._id === selectedCategoryId)?.name ?? ""


  // const matchedCategoryId = useMemo(() => {
  //   return categories.find((cat) =>
  //     cat.name.toLowerCase() === title.toLowerCase()
  //   )?._id
  // }, [categories, title])

  // console.log(matchedCategoryId)

  // const { data, isLoading, isError } = useGetEquipmentsQuery(
  //   matchedCategoryId ? { categoryId: matchedCategoryId, limit } : skipToken
  // )

  // console.log(data)
  // const equipments = data?.equipments || []
  const containerRef = useRef<HTMLDivElement>(null)

  // Show loading state
  // if ( isLoadingCategories) {
  //   return (
  //     <div className="space-y-4">
  //       <h2 className="text-2xl font-bold">{title}</h2>
  //       <div className="flex gap-4 overflow-hidden">
  //         {[...Array(4)].map((_, i) => (
  //           <div key={i} className="min-w-[280px] animate-pulse">
  //             <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
  //             <div className="space-y-2">
  //               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  //               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  //               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }

  // Show error state
  // if (isErrorCategories) {
  //   return (
  //     <div className="space-y-4">
  //       <h2 className="text-2xl font-bold">{title}</h2>
  //       <div className="bg-red-50 p-4 rounded-lg text-red-700">Failed to load equipment. Please try again later.</div>
  //     </div>
  //   )
  // }

  // Show empty state
  // if (equipments.length === 0) {
  //   return (
  //     <div className="space-y-4">
  //       <h2 className="text-2xl font-bold">{title}</h2>
  //       <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
  //         No equipment available in this category.
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Browse Equipments by Category</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategoryId === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategoryId("all")}
        >
          All Equipments
        </Button>

        {categories.map((cat) => (
          <Button
            key={cat._id}
            variant={selectedCategoryId === cat._id ? "default" : "outline"}
            onClick={() => setSelectedCategoryId(cat._id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{selectedCategoryName}</h2>
      </div>
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-md space-y-2">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : equipments.length === 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
              No equipment available in this category.
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="grid grid-col-1 md:flex gap-4 overflow-x-auto md:-mr-8 hide-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {equipments.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                id={equipment.id}
                title={equipment.title}
                category={equipment.category}
                price={equipment.price}
                rating={equipment.rating}
                imageUrl={equipment.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
