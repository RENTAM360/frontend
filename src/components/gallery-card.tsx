"use client"

import Image from "next/image";

export default function GalleryCard({
    name, 
    category, 
    price, 
    rating, 
    imgUrl
}: {
    name: string;
    category: string;
    price: string;
    rating: string;
    imgUrl: string;
  }) {
    return (
      <section className="relative h-[243px] md:h-[313px] rounded-[10px] font-sans bg-[#F5F5F5]">
        {/* Background Image */}
        <div className="absolute rounded-[10px] inset-0">
          <Image
            src={imgUrl}
            alt="Tractor Background"
            className="h-full w-full rounded-[10px] object-cover"
            width={100}
            height={100}
          />
        </div>
  
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full text-center px-4">
          <div className="w-[37px] h-[37px] font-semibold text-[12px] bg-white flex justify-center items-center rounded-full self-end text-black my-6">
            {rating}
          </div>
          <div className="bg-white flex justify-between rounded-[10px] p-2 gap-12 items-center text-gray-300 max-w-3xs mb-6">
            <div className="text-left">
                <p className="text-[14px] font-medium text-black">{name}</p>
                <p className="text-[12px] text-[#979797]">{category}</p>
            </div>
            <p className="bg-primary text-white p-1 text-[12px] rounded-[5px]">#{price}</p>
          </div>
        </div>
      </section>
    );
  }
  