"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

//const twentyFourHoursInMs = 1000 * 60 * 60 * 24
interface Props {
  children: ReactNode;
}

const options = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      //keepPreviousData: true,
      refetchOnReconnect: false,
      //retry: false,
      //staleTime: twentyFourHoursInMs,
    },
  },
};

//export const queryClient = useQueryClient()

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient(options));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
