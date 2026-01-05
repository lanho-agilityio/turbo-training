import { Metadata } from 'next';

// Constants
import { OPEN_GRAPH_IMAGE } from '@repo/ui/constants/images';
import { METADATA_CONTENT } from '@repo/ui/constants/metadata';
import { ROUTES } from '@repo/ui/constants/routes';

// Components
import { SignInForm } from '@/ui/authentication/SignInForm';

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const { TITLE, DESC } = METADATA_CONTENT.SIGN_IN;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${BASE_URL}${ROUTES.SIGN_IN}`,
    images: [
      {
        url: OPEN_GRAPH_IMAGE,
        width: 1200,
        height: 630,
        alt: DESC,
      },
    ],
    type: 'website',
  },
};

const SignInPage = () => (
  <main className="w-full h-full bg-white dark:bg-zinc-800 rounded-lg">
    <div className="w-full lg:w-2/3 py-10 lg:py-20 px-10 mx-auto">
      <div className="pb-8 dark:text-white">
        <h1 className="font-bold text-4xl">Welcome back!</h1>
        <h2 className="mt-2 font-normal text-xs md:text-lg text-zinc-500 dark:text-gray-300">
          We can assign tasks, set deadlines, and track progress effortlessly.
        </h2>
      </div>
      <SignInForm />
    </div>
  </main>
);

export default SignInPage;
