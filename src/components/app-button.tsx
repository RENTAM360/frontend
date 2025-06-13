import Image from "next/image";

export default function AppButton() {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
            <div className="bg-white rounded-[10px] w-[160px] md:w-[180px] flex gap-3 items-center px-3 md:px-5 py-1">
                <Image
                src="/google-play-badge.svg"
                alt="Get it on Google Play"
                className="md:h-12"
                width={28}
                height={35}
                />
                <div className="flex items-start rounded-[10px] flex-col">
                    <span className="text-foreground text-[10px] font-bold">GET IT ON</span>
                    <span className="text-foreground text-sm md:text-base text-nowrap font-[600]">Google Play</span>
                </div>
            </div>
            <div className="bg-white rounded-[10px] w-[160px] md:w-[180px] flex gap-3 items-center px-3 md:px-5 py-1">
                <Image
                src="/app-store-badge.svg"
                alt="Download on the App Store"
                className="md:h-12"
                width={28}
                height={35}
                />
                <div className="flex items-start flex-col">
                    <span className="text-foreground text-[10px] font-bold">GET IT ON</span>
                    <span className="text-foreground text-sm md:text-base font-[600]">App Store</span>
                </div>
            </div>
          </div>
    )
}