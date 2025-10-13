"use client"

// import { useState } from "react"
import { EquipmentCard } from "@/components/equipment-card"
import { AnimatedLogo } from "@/components/loading-logo"
import { useGetBookmarkedEquipmentsQuery } from "@/lib/redux/api/equipmentApi"


export default function SavedPage() {
  const { data, isLoading } = useGetBookmarkedEquipmentsQuery({ page: 1, limit: 20 })

  if (isLoading) return <AnimatedLogo />

  const savedItems = data?.data?.bookmarks ?? []

  console.log(savedItems)

  return (
    <div className="container font-sans mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved items</h1>

      {savedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven&apos;t saved any items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto max-w-[1600px] justify-center 2xl:grid-cols-5 place-items-stretch scroll-smooth gap-2">
          {savedItems.map((item) => (
            <EquipmentCard
              key={item._id}
              id={item._id}
              title={item.name}
              category={item.category?.[0].name ?? "Uncategorized"}
              pricePerDay={item.pricePerDay ?? 0}
              rating={item.rating ?? 0}
              imageUrl={item.media?.[0] ?? "/placeholder.svg"}
              variant="saved"
            />
          ))}
        </div>
      )}
    </div>
  )
}
