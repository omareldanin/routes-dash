import { useQuery } from "@tanstack/react-query";

import {
  getClient,
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
