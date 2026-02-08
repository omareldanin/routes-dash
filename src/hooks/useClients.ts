import { useQuery } from "@tanstack/react-query";

import {
  getClient,
  getClientByKey,
  getClients,
  type Client,
  type ClientsResponse,
  type GetClientsParams,
} from "../services/clients";

export const useClients = (params: GetClientsParams) => {
  return useQuery<ClientsResponse>({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
    refetchOnWindowFocus: false,
  });
};

export const useClient = (id: number) => {
  return useQuery<Client>({
    queryKey: ["user", id],
    queryFn: () => getClient(id),
    refetchOnWindowFocus: false,
  });
};

export const useClientByKey = (key?: string) => {
  return useQuery<{
    id: number;
    address: string;
    key: string;
    name: string;
    company: {
      user: {
        name: string;
      };
      id: number;
    };
  }>({
    queryKey: ["client", key],
    queryFn: () => getClientByKey(key),
    refetchOnWindowFocus: false,
    enabled: !!key,
  });
};
