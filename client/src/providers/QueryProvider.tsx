import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryProvider = (props: React.PropsWithChildren) => {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
