"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * Configuration du client TanStack Query
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Temps avant que les données soient considérées comme obsolètes
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Temps de cache des données
        gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
        // Retry automatique en cas d'erreur
        retry: (failureCount, error: any) => {
          // Ne pas retry sur les erreurs 4xx
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        // Refetch automatique au focus de la fenêtre
        refetchOnWindowFocus: true,
        // Refetch automatique à la reconnexion
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry pour les mutations en cas d'erreur réseau
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Côté serveur : toujours créer un nouveau client
    return makeQueryClient();
  } else {
    // Côté navigateur : réutiliser le client existant ou en créer un nouveau
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  );
}

export { getQueryClient };
