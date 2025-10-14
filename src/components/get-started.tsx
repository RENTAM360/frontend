"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button"
import { motion } from "motion/react";
import FadeInWhenVisible from "./ui/FadeInWhenVisible";

const MotionButton = motion(Button)

export default function GetStartedSection() {

    return (
      <section className="relative font-sans w-full">

        {/* Content */}
        <div className="relative z-10 overflow-hidden rounded-[22px] flex flex-col md:flex-row pt-10 md:pt-20 px-4 m-4 md:px-16 md:m-16 bg-[#FAF8F5] h-full text-center">
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
  
          <div className="text-center mb-8 md:mb-0 md:text-left flex-1">
            <FadeInWhenVisible>
              <h1 className="text-2xl md:text-3xl font-bold text-[#383A47] mb-6">
                Items are meant to be used
              </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-[10px] md:text-[13.7px] text-[#797B89] max-w-md mb-6">
                People own an infinite amount of items. The majority of these items are used only a few times a year.
                By renting your own items, everyone has the opportunity to earn extra income.
                Until now companies have mainly been providing rental items.
                Companies rent a certain category of items, but it also has a price that is usually more expensive than renting from an individual.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.4}>
              <MotionButton
                className="bg-emerald-500 z-[12] hover:bg-emerald-600"
                whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
              </MotionButton>
            </FadeInWhenVisible>
          </div>
  
          {/* Mobile Mockup */}
          <FadeInWhenVisible delay={0.5}>
            <div className="flex items-center justify-center flex-1">
              <Image
                src="/rent-mockup.png"
                alt="Phone Mockup"
                className="w-52 md:w-60"
                width={239.08}
                height={483.86}
                priority
              />
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    );
  }
  