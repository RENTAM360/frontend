import Image from "next/image";

export default function AboutSection() {
    return (
      <section className="relative font-sans md:py-30 w-full bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/tools-bg-svg.svg"
            alt="Tractor Background"
            className="h-full w-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-[#FAF8F5F7]" /> {/* creamy overlay */}
        </div>
  
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <p className="text-3xl text-[#0A0A0A] leading-10 max-w-2xl">
            With Rentam360, renting items is fast, easy, and affordable. 
            Skip the hassle of buying—explore how it works, browse available 
            items, and find nearby locations
          </p>
        </div>
      </section>
    );
  }
  