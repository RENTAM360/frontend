import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="font-sans flex justify-between mb-8 mx-8 md:mx-16">
            <p className="font-medium">@ {new Date().getFullYear()} Rentam360.</p>
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
        </footer>
    )
}