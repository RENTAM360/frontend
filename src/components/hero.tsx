"use client"
import Image from "next/image";
import AppButton from "./app-button";
import { motion } from "motion/react";
import FadeInWhenVisible from "./ui/FadeInWhenVisible";

export default function HeroSection() {
    
    return (
      <section className="relative px-4 md:px-0 font-sans pt-12 md:pt-24 w-full bg-black">
        {/* Background Image */}
        <motion.div className="absolute inset-0 will-change-transform">
          <Image
            src="/tractor-bg.jpg"
            alt="Tractor Background"
            className="h-full w-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-[#3D3D3DF2]" /> 
        </motion.div>
  
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <FadeInWhenVisible>
            <h1 className="text-3xl md:text-5xl leading-12 md:leading-16 font-bold text-white mb-6">
              Not everything needs <br className="hidden md:block mb-6" /> to be owned.
            </h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-sm md:text-lg text-gray-300 max-w-2xl mb-6">
              Access what you need, when you need it without the cost of ownership. From heavy
              equipment to everyday tools, Rentam360 makes renting simple, affordable, and sustainable.
            </p>
          </FadeInWhenVisible>
  
          {/* App store buttons */}
          <FadeInWhenVisible delay={0.4}>
            <AppButton />
          </FadeInWhenVisible>
  
          {/* Phone Mockup */}
          <FadeInWhenVisible delay={0.6}>
            <Image
              src="/iPhone-mockup.png"
              alt="App Screenshot"
              className="w-72 md:w-96"
              width={286.99}
              height={580.81}
            />
          </FadeInWhenVisible>
          
        </div>
      </section>
    );
  }
  