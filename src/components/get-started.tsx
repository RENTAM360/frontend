import Image from "next/image";
import { Button } from "./ui/button";

export default function GetStartedSection() {
    return (
      <section className="relative font-sans w-full">

        {/* Content */}
        <div className="relative z-10 overflow-hidden rounded-[22px] flex md:pt-20 md:px-16 md:m-16 bg-[#FAF8F5] h-full text-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/bg-checkered.svg"
              alt="Checkered background"
              className="h-full w-full object-cover"
              width={100}
              height={100}
            />
          </div>
  
          <div className="text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#383A47] mb-6">
                Items are meant to be used
            </h1>
            <p className="text-[13.7px] text-[#797B89] max-w-md mb-6">
                People own an infinite amount of items. The majority of these items are used only a few times a year. 
                By renting your own items, everyone has the opportunity to earn extra income. 
                Until now companies have mainly been providing rental items. 
                Companies rent a certain category of items, 
                but it also has a price that is usually more expensive than renting from an individual. 
            </p>

            <Button>Get started</Button>
          </div>
  
          {/* Mobile Mockup */}
          <div className="flex items-center justify-center flex-1">
            <Image
            src="/get-started-phone-mockup.svg"
            alt="Phone Mockup"
            className="w-52 md:w-60 drop-shadow-xl"
            width={28}
            height={35}
            />
          </div>
        </div>
      </section>
    );
  }
  