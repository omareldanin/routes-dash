import { api } from "../api/api";

export interface Client {
  id: number;
  phone: string;
  name: string | null;
  ordersCount?: number;
  totalShipping?: number;
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  companyId: number | null;
  address: string | null;
}

export interface ClientsResponse {
  pagination: {
    count: number;
    page: number;
    totalPages: number;
  };
  data: Client[];
}

export interface ClientResponse {
  client: Client;
}

export interface GetClientsParams {
  page?: number;
  size?: number;
  name?: string;
  phone?: string;
}

export const getClients = async (
  params: GetClientsParams
): Promise<ClientsResponse> => {
  const response = await api.get("/clients", { params });
  return response.data;
};

export const getClient = async (id: number): Promise<Client> => {
  const response = await api.get("/clients/" + id);
  return response.data;
};

export const deleteClient = async (id: number | undefined) => {
  const respone = await api.delete("clients/" + id);
  return respone.data;
};

export const updateClient = async (data: FormData, id: number) => {
  const respone = await api.patch<FormData>("clients/" + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};

export const createClient = async (data: FormData) => {
  const respone = await api.post<FormData>("clients/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};
