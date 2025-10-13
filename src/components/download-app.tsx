"use client"
import Image from "next/image";
// import { Button } from "./ui/button";

import { motion } from "motion/react";
import FadeInWhenVisible from "./ui/FadeInWhenVisible";
import AppButton from "./app-button";


export default function DownloadAppSection() {

    return (
      <section  className="relative font-sans w-full overflow-hidden">
        {/* Background Image */}
        {/* <div className="absolute inset-0">
          <Image
            src=""
            alt="Checkered background"
            className="h-full w-full object-cover"
            width={100}
            height={100}
          />
        </div> */}
  
        {/* Content */}
        <div className="relative z-10 overflow-hidden rounded-[22px] flex flex-col items-center justify-center pt-10 pb-8 md:pt-20 md:pb-16 px-8 m-8 md:px-16 md:m-16 bg-[#403E3D] h-full text-center">
            {/* Background Image */}
            <motion.div className="absolute inset-0">
                <Image
                    src="/bg-checkered.svg"
                    alt="Checkered background"
                    className="h-full w-full object-cover"
                    width={100}
                    height={100}
                />
            </motion.div>
            <FadeInWhenVisible>
              <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-6">
                Download Our App
              </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-[10px] md:text-[13.7px] text-[#FFFFFFCC] max-w-xl mb-8">
                At Rentam360, we make renting simple, fast, and secure. Whether you&apos;re looking to rent a car, heavy equipment, or everyday essentials, our platform connects you with trusted owners — anytime, anywhere.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.4}>
              <AppButton />
            </FadeInWhenVisible>
        </div>
      </section>
    );
  }
  