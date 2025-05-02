import Image from "next/image";

export default function AppButton() {
    return (
        <div className="flex items-center gap-4 mb-10">
            <div className="bg-white rounded-[10px] w-[180px] flex gap-3 items-center md:px-5 md:py-1">
                <Image
                src="/google-play-badge.svg"
                alt="Get it on Google Play"
                className="h-12"
                width={28}
                height={35}
                />
                <div className="flex items-start rounded-[10px] flex-col">
                    <span className="text-foreground text-[10px] font-bold">GET IT ON</span>
                    <span className="text-foreground font-[600]">Google Play</span>
                </div>
            </div>
            <div className="bg-white rounded-[10px] w-[180px] flex gap-3 items-center md:px-5 md:py-1">
                <Image
                src="/app-store-badge.svg"
                alt="Download on the App Store"
                className="h-12"
                width={28}
                height={35}
                />
                <div className="flex items-start flex-col">
                    <span className="text-foreground text-[10px] font-bold">GET IT ON</span>
                    <span className="text-foreground font-[600]">App Store</span>
                </div>
            </div>
          </div>
    )
}