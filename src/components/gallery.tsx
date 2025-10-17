"use client"

// import Image from "next/image";
import GalleryCard from "./gallery-card";
import FadeInWhenVisible from "./ui/FadeInWhenVisible";
import { motion } from "motion/react"

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
        name: "Tractor", 
        category: "Vehicles", 
        price: "135,000", 
        rating: "4.2",
        imgUrl: "/gallery-img1.svg"
    },
    {
        id: 2,
        name: "200 KVA Generator", 
        category: "Engineering", 
        price: "210,000", 
        rating: "4.5",
        imgUrl: "/gallery-img2.svg"
    },
    {
        id: 3,
        name: "Excavator", 
        category: "Vehicles", 
        price: "290,000", 
        rating: "4.5",
        imgUrl: "/gallery-img3.svg"
    },
    {
        id: 4,
        name: "Elepaq Generator", 
        category: "Engineering", 
        price: "30,000", 
        rating: "4.5",
        imgUrl: "/gallery-img4.svg"
    },
    {
        id: 5,
        name: "Toyota Camry 2023", 
        category: "Vehicles", 
        price: "95,000", 
        rating: "4.5",
        imgUrl: "/gallery-img5.svg"
    },
    {
        id: 6,
        name: "Yamaha Keyboard", 
        category: "Electronics", 
        price: "15,000", 
        rating: "4.5",
        imgUrl: "/gallery-img6.svg"
    }
]

export default function GallerySection() {
    return (
      <section className="relative px-4 md:px-16 font-sans py-10 md:py-20 w-full bg-[#F5F5F5]">

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <FadeInWhenVisible>
                <h1 className="text-2xl md:text-3xl font-bold text-[#292D32] mb-2">
                    Renting made easy
                </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible>
                <p className="text-sm md:text-base text-[#4E4E4E] max-w-sm">
                    Easily find the perfect Equipment that fits your style, budget and location
                </p>
            </FadeInWhenVisible>
        </div>

        {/* Background Image */}
        <motion.div 
            className="grid grid-cols-1 mt-12 gap-5 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
            hidden: {},
            visible: {
                transition: { staggerChildren: 0.15 },
            },
            }}
        >
            {
                cardDetails.map((cardDetail) =>(
                    <motion.div
                        key={cardDetail.id}
                        variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <GalleryCard 
                        key={cardDetail.id}
                        category={cardDetail.category} 
                        price={cardDetail.price}
                        rating={cardDetail.rating}
                        imgUrl={cardDetail.imgUrl}
                        name={cardDetail.name}
                        />
                    </motion.div>
                ))
            }
        </motion.div>
  
        {/* Content */}
        
      </section>
    );
  }
  