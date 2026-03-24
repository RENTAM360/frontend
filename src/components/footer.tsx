import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="font-sans mb-8 mx-8 md:mx-16">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <p className="font-medium">@ {new Date().getFullYear()} Rentam360.</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Link href="/terms" className="hover:text-[#17b266] transition-colors">
                        Terms &amp; Conditions
                    </Link>
                    <Link href="/privacy" className="hover:text-[#17b266] transition-colors">
                        Privacy Policy
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <Link href="#">
                        <Image width={20} height={19.95} src="/fb.svg" alt="Facebook icon and link" />
                    </Link>
                    <Link href="#">
                        <Image width={18} height={18} src="/ig.svg" alt="Instagram icon and link" />
                    </Link>
                    <Link href="#">
                        <Image width={17} height={17} src="/x.svg" alt="X icon and link" />
                    </Link>
                </div>
            </div>
        </footer>
    )
}