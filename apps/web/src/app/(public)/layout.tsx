import { ReactNode } from 'react';
import type { Metadata } from 'next';

// Components
import { PublicNavBar } from '@repo/ui/components/NavBar/PublicNavBar';

export const metadata: Metadata = {
  title: 'Task Management',
  description: 'Application to manage task built by NextJS',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

const PublicLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="grid grid-flow-row lg:grid-cols-12 lg:gap-8">
    <div className="row-auto lg:col-span-2">
      <PublicNavBar />
    </div>
    <div className="row-auto lg:col-span-10">{children}</div>
  </div>
);

export default PublicLayout;
