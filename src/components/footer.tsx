import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="font-sans flex justify-between mb-8 md:mx-16">
            <p className="font-medium">@ {new Date().getFullYear()} Rentam360.</p>
            <div className="flex gap-2">
                <Link href="#">
                    <Image width={17} height={17} src="/fb.svg" alt="Facebook icon and link" />
                </Link>
                <Link href="#">
                    <Image width={17} height={17} src="/ig.svg" alt="Instagram icon and link" />
                </Link>
                <Link href="#">
                    <Image width={17} height={17} src="/x.svg" alt="X icon and link" />
                </Link>
            </div>
        </footer>
    )
}