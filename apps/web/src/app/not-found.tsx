import Link from 'next/link';

// Auths
import { getServerSession } from 'next-auth';

// Constants
import { ROUTES } from '@repo/ui/constants/routes';

// Icons
import { PiWarningOctagon } from 'react-icons/pi';
import { authOptions } from '@/auth';

export default async function NotFound() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-col items-center gap-12 mt-24">
      <PiWarningOctagon className="w-40 h-40 md:h-80 md:w-80 text-amber-400" />

      <h1 className="font-bold text-3xl">Not Found</h1>
      <h2 className="text-md md:text-xl">
        Could not find the requested resource.
      </h2>

      <Link
        className="text-blue-500 hover:text-blue-700 text-md md:text-xl"
        aria-label="Homepage"
        href={session ? ROUTES.ADMIN_BOARDS : ROUTES.BOARDS}
      >
        ← Go to Homepage
      </Link>
    </div>
  );
}
