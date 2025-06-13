"use client"

import { useState, useRef, useMemo } from "react"
import { useGetCategoriesQuery, useGetEquipmentsQuery } from "@/lib/redux/api/equipmentApi"
import { EquipmentCard } from "@/components/equipment-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { skipToken } from "@reduxjs/toolkit/query"

interface EquipmentCategoryProps {
  title: string
  limit?: number
}

export function EquipmentCategory({ title, limit = 10 }: EquipmentCategoryProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const {
    data: categoryResponse,
    isLoading: isLoadingCategories,
    isError: isErrorCategories
  } = useGetCategoriesQuery()

  const categories = useMemo(() => categoryResponse?.data ?? [], [categoryResponse])

  const matchedCategoryId = useMemo(() => {
    return categories.find((cat) =>
      cat.name.toLowerCase() === title.toLowerCase()
    )?._id
  }, [categories, title])

  console.log(matchedCategoryId)

  const { data, isLoading, isError } = useGetEquipmentsQuery(
    matchedCategoryId ? { categoryId: matchedCategoryId, limit } : skipToken
  )

  // console.log(data)
  const equipments = data?.equipments || []
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current
    if (!container) return

    const scrollAmount = 320 // Approximate card width + gap
    const newPosition =
      direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })

    setScrollPosition(newPosition)
  }

  // Show loading state
  if (isLoading || isLoadingCategories) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[280px] animate-pulse">
              <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show error state
  if (isError || isErrorCategories) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="bg-red-50 p-4 rounded-lg text-red-700">Failed to load equipment. Please try again later.</div>
      </div>
    )
  }

  // Show empty state
  if (equipments.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
          No equipment available in this category.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} disabled={scrollPosition === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x"
        style={{ scrollBehavior: "smooth" }}
      >
        {equipments.map((equipment) => (
          <div key={equipment.id} className="snap-start">
            <EquipmentCard
              id={equipment.id}
              title={equipment.title}
              category={equipment.category}
              price={equipment.price}
              rating={equipment.rating}
              imageUrl={equipment.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
