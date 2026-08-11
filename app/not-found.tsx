import Link from "next/link";
import { LINK_UNDERLINE } from "../lib/styles";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto w-full px-10 pt-30 md:pt-52 pb-24">
        <p className="text-sm font-bold uppercase text-muted">404</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold">Page not found</h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
        </p>
        <Link
          href="/"
          className={`${LINK_UNDERLINE} mt-10 inline-block text-sm font-bold uppercase`}
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
