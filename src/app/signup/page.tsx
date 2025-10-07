import Image from "next/image";
import Link from "next/link";

export default function Registration() {
  return (
    <main className="flex justify-center font-sans h-screen items-center">
      <div>
        <h1 className="text-2xl text-center font-semibold mb-6">Select your account type</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Personal Account */}
          <Link href="/signup/personal">
            <div className="border-[1.51px] w-[383.4px]  p-4 rounded-[12.87px] border-[#F4F4F4] transition-transform duration-300 ease-out hover:-translate-y-2 cursor-pointer">
              <div className="bg-[#F0FAF4] p-5 flex flex-col justify-center items-center">
                <div className="w-[60.33px] rounded-full p-4 bg-[#12B76A] h-[60.33px]">
                  <Image src="/personal-actt.svg" width={60.33} height={60.33} alt="Personal account icon" />
                </div>
                <h2 className="text-[#12B76A] font-semibold my-2 text-xl">Personal Account</h2>
                <p className="text-[#949494] text-center">For Individuals Tenting For <br /> Personal Use</p>
              </div>
            </div>
          </Link>
          {/* Business Account */}
          <Link href="/signup/business">
            <div className="border-[1.51px] w-[383.4px] p-4 rounded-[12.87px] border-[#F4F4F4] transition-transform duration-300 ease-out hover:-translate-y-2 cursor-pointer">
              <div className="bg-[#F0FAF4] p-5 flex flex-col justify-center items-center">
                <div className="w-[60.33px] rounded-full p-4 bg-[#12B76A] h-[60.33px]">
                  <Image src="/business-actt.svg" width={60.33} height={60.33} alt="business account icon" />
                </div>
                <h2 className="text-[#12B76A] font-semibold my-2 text-xl">Business Account</h2>
                <p className="text-[#949494] text-center">Or Companies, Contractors, Site Managers, Developers, Or Inspectors</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}