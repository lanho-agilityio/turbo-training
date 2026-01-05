export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-10 flex flex-col gap-4">
    <h1 className="text-2xl font-bold">Error</h1>
    <p className="text-md md:text-lg text-wrap">{message}</p>
  </div>
);
