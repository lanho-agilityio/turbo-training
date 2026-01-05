'use client';

// Components
import { ErrorContent } from '@repo/ui/components/ErrorContent';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent onClick={reset} />;
}
