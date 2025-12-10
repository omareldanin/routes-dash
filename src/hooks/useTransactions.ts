// hooks/useTransactions.ts
import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  type TransactionsResponse,
} from "../services/transactions";

export const useTransactions = (page: number = 1, size: number = 20) => {
  return useQuery<TransactionsResponse>({
    queryKey: ["transactions", page, size],
    queryFn: () => getTransactions(page, size),
    refetchOnWindowFocus: false,
  });
};
