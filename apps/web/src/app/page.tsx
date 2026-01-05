import { redirect } from 'next/navigation';

// Auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Constants
import { ROUTES } from '@repo/ui/constants/routes';

const Homepage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(ROUTES.ADMIN_BOARDS);
  } else {
    redirect(ROUTES.BOARDS);
  }
};

export default Homepage;
