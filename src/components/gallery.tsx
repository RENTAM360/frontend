"use client"

import Image from "next/image";
import GalleryCard from "./gallery-card";

type CardDetail = {
    id: number;
    name: string;
    category: string;
    price: string;
    rating: string;
    imgUrl: string;
  };

const cardDetails: CardDetail[] = [
    {
        id: 1,
        name: "Excavator", 
        category: "Construction tools", 
        price: "50,000", 
        rating: "4.5",
        imgUrl: "/gallery-img1.svg"
    },
    {
        id: 2,
        name: "Excavator", 
        category: "Construction tools", 
        price: "50,000", 
        rating: "4.5",
        imgUrl: "/gallery-img2.svg"
    },
    {
        id: 3,
        name: "Excavator", 
        category: "Construction tools", 
        price: "50,000", 
        rating: "4.5",
        imgUrl: "/gallery-img3.svg"
    },
    {
        id: 4,
        name: "Excavator", 
        category: "Construction tools", 
        price: "50,000", 
        rating: "4.5",
        imgUrl: "/gallery-img4.svg"
    },
    {
        id: 5,
        name: "Excavator", 
        category: "Construction tools", 
        price: "50,000", 
        rating: "4.5",
        imgUrl: "/gallery-img5.svg"
    },
    {
        id: 6,
        name: "Excavator", 
        category: "Construction tools", 
        price: "50,000", 
        rating: "4.5",
        imgUrl: "/gallery-img6.svg"
    }
]

export default function GallerySection() {
    return (
      <section className="relative md:px-16 font-sans md:py-20 w-full bg-[#F5F5F5]">

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-3xl font-bold text-[#292D32] mb-2">
                Renting made easy
            </h1>
          <p className="text-base text-[#4E4E4E] max-w-sm">
            Easily find the perfect Equipment that fits your style, budget and location
          </p>
        </div>

        {/* Background Image */}
        <div className="grid grid-cols-1 mt-12 gap-5 md:grid-cols-3">
            {
                cardDetails.map((cardDetail) =>(
                    <GalleryCard 
                    key={cardDetail.id}
                    category={cardDetail.category} 
                    price={cardDetail.price}
                    rating={cardDetail.rating}
                    imgUrl={cardDetail.imgUrl}
                    name={cardDetail.name}
                    />
                ))
            }
        </div>
  
        {/* Content */}
        
      </section>
    );
  }
  