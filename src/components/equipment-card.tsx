"use client"

import Image from "next/image"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addSavedItem, removeSavedItem, selectIsSaved } from "@/lib/redux/slices/savedItemsSlice"
import { useToast } from "@/components/ui/use-toast"

interface EquipmentCardProps {
  id: string
  title: string
  category: string
  price: number
  rating: number
  imageUrl: string
  variant?: "default" | "profile" | "saved"
}

export function EquipmentCard({
  id,
  title,
  category,
  price,
  rating,
  imageUrl,
  variant = "default",
}: EquipmentCardProps) {

  const dispatch = useAppDispatch()
  const isSaved = useAppSelector((state) => selectIsSaved(state, id))
  const { toast } = useToast()
    
  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (variant === "saved" || isSaved) {
      dispatch(removeSavedItem(id))
      toast({
        title: "Item removed",
        description: "The item has been removed from your saved items.",
      })
    } else {
       dispatch(
        addSavedItem({
        id,
        title,
        category,
        price,
        rating,
        imageUrl,
       }),
      )
      toast({
        title: "Item saved",
        description: `${title} has been added to your saved items.`,
        variant: "success"
      })
    }
  }

  return (
    <section>
        <Link href={`/dashboard/equipment/${id}`} className="relative p-2 rounded-[15.37px] bg-white flex flex-col w-full md:w-[280px] flex-shrink-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[15.37px]">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
            
            </div>
            <div className="mt-2">
                
                    <div className="flex justify-between">
                        <h3 className="text-base font-bold">{title}</h3>
                        {/* Only show save button if not on profile page */}
                        {variant !== "profile" && (
                          <button
                            onClick={handleToggleSave}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-green-500 hover:bg-white"
                            aria-label={isSaved ? "Remove from saved" : "Save equipment"}
                          >
                            {variant === "saved" || isSaved ? (
                              // Minus icon for saved items page
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M14.5 11.4H9.5C9.09 11.4 8.75 11.06 8.75 10.65C8.75 10.24 9.09 9.90002 9.5 9.90002H14.5C14.91 9.90002 15.25 10.24 15.25 10.65C15.25 11.06 14.91 11.4 14.5 11.4Z"
                                  fill="#12B76A"
                                />
                                <path
                                  d="M19.0703 22.75C18.5603 22.75 18.0003 22.6 17.4603 22.29L12.5803 19.58C12.2903 19.42 11.7203 19.42 11.4303 19.58L6.55031 22.29C5.56031 22.84 4.55031 22.9 3.78031 22.44C3.01031 21.99 2.57031 21.08 2.57031 19.95V5.86C2.57031 3.32 4.64031 1.25 7.18031 1.25H16.8303C19.3703 1.25 21.4403 3.32 21.4403 5.86V19.95C21.4403 21.08 21.0003 21.99 20.2303 22.44C19.8803 22.65 19.4803 22.75 19.0703 22.75ZM12.0003 17.96C12.4703 17.96 12.9303 18.06 13.3003 18.27L18.1803 20.98C18.6903 21.27 19.1603 21.33 19.4603 21.15C19.7603 20.97 19.9303 20.54 19.9303 19.95V5.86C19.9303 4.15 18.5303 2.75 16.8203 2.75H7.18031C5.47031 2.75 4.07031 4.15 4.07031 5.86V19.95C4.07031 20.54 4.24031 20.98 4.54031 21.15C4.84031 21.32 5.31031 21.27 5.82031 20.98L10.7003 18.27C11.0703 18.06 11.5303 17.96 12.0003 17.96Z"
                                  fill="#12B76A"
                                />
                              </svg>
                            ) : (
                              // Plus icon for default view
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M14.5 11.4H9.5C9.09 11.4 8.75 11.06 8.75 10.65C8.75 10.24 9.09 9.90002 9.5 9.90002H14.5C14.91 9.90002 15.25 10.24 15.25 10.65C15.25 11.06 14.91 11.4 14.5 11.4Z"
                                  fill="#12B76A"
                                />
                                <path
                                  d="M12 13.96C11.59 13.96 11.25 13.62 11.25 13.21V8.20996C11.25 7.79996 11.59 7.45996 12 7.45996C12.41 7.45996 12.75 7.79996 12.75 8.20996V13.21C12.75 13.62 12.41 13.96 12 13.96Z"
                                  fill="#12B76A"
                                />
                                <path
                                  d="M19.0703 22.75C18.5603 22.75 18.0003 22.6 17.4603 22.29L12.5803 19.58C12.2903 19.42 11.7203 19.42 11.4303 19.58L6.55031 22.29C5.56031 22.84 4.55031 22.9 3.78031 22.44C3.01031 21.99 2.57031 21.08 2.57031 19.95V5.86C2.57031 3.32 4.64031 1.25 7.18031 1.25H16.8303C19.3703 1.25 21.4403 3.32 21.4403 5.86V19.95C21.4403 21.08 21.0003 21.99 20.2303 22.44C19.8803 22.65 19.4803 22.75 19.0703 22.75ZM12.0003 17.96C12.4703 17.96 12.9303 18.06 13.3003 18.27L18.1803 20.98C18.6903 21.27 19.1603 21.33 19.4603 21.15C19.7603 20.97 19.9303 20.54 19.9303 19.95V5.86C19.9303 4.15 18.5303 2.75 16.8203 2.75H7.18031C5.47031 2.75 4.07031 4.15 4.07031 5.86V19.95C4.07031 20.54 4.24031 20.98 4.54031 21.15C4.84031 21.32 5.31031 21.27 5.82031 20.98L10.7003 18.27C11.0703 18.06 11.5303 17.96 12.0003 17.96Z"
                                  fill="#12B76A"
                                />
                              </svg>
                            )}
                          </button>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm">{category}</p>
                
                <div className="mt-1 flex items-center justify-between">
                <p className="font-[500]">₦{price.toLocaleString()}</p>
                <div className="flex items-center">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="gold"
                    stroke="gold"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="ml-1 text-[#676767]">{rating}</span>
                </div>
                </div>
            </div>
        </Link>
    </section>
  )
}
