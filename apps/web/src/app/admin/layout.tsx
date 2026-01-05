import { ReactNode } from 'react';

// Components
import { AdminNavBar } from '@repo/ui/components/NavBar/AdminNavBar';

const AdminLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <div className="grid grid-flow-row lg:grid-cols-12 lg:gap-8">
    <div className="row-auto lg:col-span-2">
      <AdminNavBar />
    </div>
    <div className="row-auto lg:col-span-10">{children}</div>
  </div>
);

export default AdminLayout;
