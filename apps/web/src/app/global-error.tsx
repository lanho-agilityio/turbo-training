'use client';

import Link from 'next/link';

// Icons
import { IoWarningOutline } from 'react-icons/io5';
import { BsArrowCounterclockwise } from 'react-icons/bs';

// Components
import { Button } from '@repo/ui/components/Button';

// Constants
import { ROUTES } from '@repo/ui/constants/routes';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-zinc-50">
        <main className="container mx-auto min-h-screen flex items-center">
          <div className="w-full flex flex-col items-center gap-12">
            <IoWarningOutline className="w-40 h-40 text-red-400" />
            <h1 className="font-bold text-3xl">Something went wrong!</h1>
            <h2 className="text-md md:text-xl">
              {error.name}: {error.message}
            </h2>
            <div className="flex items-center justify-between gap-3">
              <Link
                className="text-blue-500 hover:text-blue-700 text-md md:text-xl"
                aria-label="Homepage"
                href={ROUTES.BOARDS}
              >
                ← Go to Homepage
              </Link>
              <Button
                variant="outline"
                customClass="border-none text-slate-600
               text-md md:text-xl hover:bg-transparent hover:text-slate-900"
                onClick={() => reset()}
                startIcon={<BsArrowCounterclockwise />}
              >
                Try again
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
