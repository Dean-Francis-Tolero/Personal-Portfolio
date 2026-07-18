import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="fixed top-6 left-6 z-50 block h-16 w-16 overflow-hidden rounded-full transition-transform hover:scale-105"
    >
      <Image src="/icon.png" alt="" width={64} height={64} priority className="h-full w-full object-cover" />
    </Link>
  );
}
