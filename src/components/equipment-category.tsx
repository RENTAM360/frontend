"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useGetCategoriesQuery, useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { skipToken } from "@reduxjs/toolkit/query"
import { useAppSelector } from "@/lib/redux/hooks"

interface EquipmentCategoryProps {
  title: string
  limit?: number
}

export function EquipmentCategory({ title }: EquipmentCategoryProps) {
  const searchTerm = useAppSelector((state)=>state.search.term)
  const {
    data: categoryResponse,
  } = useGetCategoriesQuery()

  // console.log(categoryResponse)

  const categories = useMemo(() => categoryResponse?.data ?? [], [categoryResponse])
  // console.log(categories)

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

  const equipments = useMemo(() => {
    return selectedCategoryId === "all"
      ? allEquipments.data?.equipments ?? []
      : equipmentResponse?.equipments ?? []
  }, [selectedCategoryId, allEquipments.data, equipmentResponse])

  // console.log(equipments)

  const isLoading = selectedCategoryId === "all" ? allEquipments.isLoading : isLoadingEquipments

  const selectedCategoryName =
    selectedCategoryId === "all"
      ? "All Equipments"
      : categories.find((cat) => cat._id === selectedCategoryId)?.name ?? ""

  const containerRef = useRef<HTMLDivElement>(null)

  const filteredEquipments = useMemo(() => {
    if (!searchTerm) return equipments
    return equipments.filter((eq) =>
      eq.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [equipments, searchTerm])

  return (
    <div className="space-y-4 mb-8">
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
        ) : filteredEquipments.length === 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
              No equipment found {searchTerm ? `for "${searchTerm}"` : "in this category"}.
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto max-w-[1600px] justify-center 2xl:grid-cols-5 place-items-stretch scroll-smooth gap-2"
          >
            {filteredEquipments.map((equipment) => (
             
                <EquipmentCard
                  key={equipment.id}
                  id={equipment.id}
                  title={equipment.title}
                  category={equipment.category}
                  pricePerDay={equipment.pricePerDay}
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
