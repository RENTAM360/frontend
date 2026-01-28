"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useGetCategoriesQuery, useGetEquipmentsQuery, useSearchEquipmentsQuery } from "@/lib/redux/api/equipmentApi"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { skipToken } from "@reduxjs/toolkit/query"
import { useAppSelector } from "@/lib/redux/hooks"

interface EquipmentCategoryProps {
  title: string
  limit?: number
}

export function EquipmentCategory({ limit }: EquipmentCategoryProps) {
  const searchTerm = useAppSelector((state)=>state.search.term)
  const isSearching = !!searchTerm

  const {
    data: categoryResponse,
  } = useGetCategoriesQuery()
  const [page, setPage] = useState(1)

  // Reset to first page whenever search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const categories = useMemo(() => categoryResponse?.data ?? [], [categoryResponse])

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [selectedCategoryId])

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId("all")
    }
  }, [categories, selectedCategoryId])

  // Base listing (with optional category filter)
  const {
    data: equipmentResponse,
    isLoading: isLoadingEquipments,
  } = useGetEquipmentsQuery(
    selectedCategoryId && selectedCategoryId !== "all"
      ? {
          categoryId: selectedCategoryId,
          page,
          limit,
        }
      : skipToken
  )

  const allEquipments = useGetEquipmentsQuery(
    selectedCategoryId === "all"
      ? {
          page,
          limit,
        }
      : skipToken
  )

  // Server-side search by name (uses `name` query param under the hood)
  const {
    data: searchResponse,
    isLoading: isLoadingSearch,
  } = useSearchEquipmentsQuery(isSearching ? searchTerm : skipToken)

  const equipments = useMemo(() => {
    if (isSearching) {
      return searchResponse?.equipments ?? []
    }

    return selectedCategoryId === "all"
      ? allEquipments.data?.equipments ?? []
      : equipmentResponse?.equipments ?? []
  }, [isSearching, searchResponse, selectedCategoryId, allEquipments.data, equipmentResponse])

  const totalCount = isSearching
    ? searchResponse?.totalCount ?? 0
    : selectedCategoryId === "all"
      ? allEquipments.data?.totalCount ?? 0
      : equipmentResponse?.totalCount ?? 0
  
  const totalPages = Math.ceil(totalCount / (limit || 1))
  const isLoading = isSearching
    ? isLoadingSearch
    : selectedCategoryId === "all"
      ? allEquipments.isLoading
      : isLoadingEquipments

  const selectedCategoryName =
    selectedCategoryId === "all"
      ? "All Equipments"
      : categories.find((cat) => cat._id === selectedCategoryId)?.name ?? ""

  const containerRef = useRef<HTMLDivElement>(null)
  const topContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (topContainerRef.current) {
      topContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [page])


  return (
    <div ref={topContainerRef} className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold md:mt-8">Browse Items by Category</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategoryId === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategoryId("all")}
        >
          All Items
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
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
              No item found {searchTerm ? `for "${searchTerm}"` : "in this category"}.
            </div>
          </div>
        ) : (
          <>
            <div 
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto max-w-[1600px] justify-center 2xl:grid-cols-5 place-items-stretch scroll-smooth gap-2"
          >
            {equipments.map((equipment) => {
              return (
                <EquipmentCard
                  key={equipment.id}
                  id={equipment.id}
                  title={equipment.title}
                  category={equipment.category}
                  pricePerDay={equipment.pricePerDay}
                  rating={equipment.rating}
                  imageUrl={equipment.imageUrl}
                />
    
            )})}
          </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
