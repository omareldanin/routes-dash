// services/transactionsService.ts
import { api } from "../api/api";

export type Transaction = {
  id: number;
  paidAmount: number;
  confirmed: boolean;
  createdAt: string;
  vendor: {
    id: number;
    name: string;
  };
  delivery: {
    id: number;
    name: string;
  } | null;
};

export type TransactionsResponse = {
  results: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const getTransactions = async (
  page: number = 1,
  size: number = 20
): Promise<TransactionsResponse> => {
  const res = await api.get(`transactions/getAll`, {
    params: { page, size },
  });
  return res.data;
};

export const confirmTransaction = async (id: number): Promise<void> => {
  const res = await api.patch(`transactions/${id}`, { confirmed: true });
  return res.data;
};
