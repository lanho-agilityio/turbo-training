// Utils
import { cn } from '@repo/ui/utils/styles';

// Icons
import { CgSpinner } from 'react-icons/cg';

export default function Loading() {
  return (
    <div className="flex justify-center mt-96 lg:mr-40 xl:mr-60">
      <CgSpinner className={cn('animate-spin w-20 h-20')} />
    </div>
  );
}
