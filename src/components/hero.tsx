import Image from "next/image";
import AppButton from "./app-button";

export default function HeroSection() {
    return (
      <section className="relative font-sans md:pt-24 w-full bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/tractor-bg.jpg"
            alt="Tractor Background"
            className="h-full w-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-[#3D3D3DF2]" /> {/* dark overlay */}
        </div>
  
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl leading-16 font-bold text-white mb-6">
            Not everything needs <br className="mb-6" /> to be owned.
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-6">
            Access what you need, when you need it without the cost of ownership. From heavy
            equipment to everyday tools, Rentam360 makes renting simple, affordable, and sustainable.
          </p>
  
          {/* App store buttons */}
          <AppButton />
  
          {/* Phone Mockup */}
          <Image
            src="/phone-mockup.svg"
            alt="App Screenshot"
            className="w-72 md:w-96 drop-shadow-xl"
            width={28}
            height={35}
          />
        </div>
      </section>
    );
  }
  