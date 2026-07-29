"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LINK_UNDERLINE } from "../lib/styles";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto w-full px-10 pt-40 md:pt-52 pb-24">
        <p className="text-sm font-bold uppercase text-muted">Error</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold">Something went wrong</h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          An unexpected error occurred. Try again, or head back home.
        </p>
        <div className="mt-10 flex gap-6">
          <button
            onClick={() => reset()}
            className={`${LINK_UNDERLINE} text-sm font-bold uppercase`}
          >
            Try again
          </button>
          <Link href="/" className={`${LINK_UNDERLINE} text-sm font-bold uppercase`}>
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
