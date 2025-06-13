"use client"

// import { useState } from "react"
import { EquipmentCard } from "@/components/equipment-card"
import { useAppSelector } from "@/lib/redux/hooks"
import { selectSavedItems } from "@/lib/redux/slices/savedItemsSlice"

export default function SavedPage() {
//   const [savedItems, setSavedItems] = useState([
//     {
//       id: "1",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/vibrant-red-car.png",
//     },
//     {
//       id: "2",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/tool-kit.png",
//     },
//     {
//       id: "3",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/abstract-energy-flow.png",
//     },
//     {
//       id: "4",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/mechanical-keyboard.png",
//     },
//     {
//       id: "5",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/sleek-black-car.png",
//     },
//     {
//       id: "6",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/vibrant-red-car.png",
//     },
//     {
//       id: "7",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/mechanical-keyboard.png",
//     },
//     {
//       id: "8",
//       title: "Excavator",
//       category: "Construction tools",
//       price: 50000,
//       rating: 4.5,
//       imageUrl: "/mechanical-keyboard.png",
//     },
//   ])
 const savedItems = useAppSelector(selectSavedItems)

//   const handleRemoveFromSaved = (id: string) => {
//     setSavedItems(savedItems.filter((item) => item.id !== id))
//   }

  return (
    <div className="container font-sans mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {savedItems.map((item) => (
          <EquipmentCard
            key={item.id}
            id={item.id}
            title={item.title}
            category={item.category}
            price={item.price}
            rating={item.rating}
            imageUrl={item.imageUrl}
            variant="saved"
          />
        ))}
      </div>

      {savedItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven&apos;t saved any items yet.</p>
        </div>
      )}
    </div>
  )
}
