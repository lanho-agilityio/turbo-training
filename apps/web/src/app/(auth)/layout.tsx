import { ReactNode } from 'react';

// Components
import { PublicNavBar } from '@repo/ui/components/NavBar/PublicNavBar';

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="grid grid-flow-row lg:grid-cols-12 gap-8">
    <div className="row-auto lg:col-span-2">
      <PublicNavBar />
    </div>
    <div className="row-auto lg:col-span-10">{children}</div>
  </div>
);

export default AuthLayout;
