import { useQuery } from "@tanstack/react-query";
import {
  getDeliveriesWithOrders,
  deleteMultiOrder,
  getExportOrders,
  getOrders,
  type GetOrdersParams,
} from "../services/order";

export const useOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });
};
export const useExportOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["export-orders", params],
    queryFn: () => getExportOrders(params),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export const useDeliveriesOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["deliveriesOrders", params],
    queryFn: () => getDeliveriesWithOrders(params),
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });
};

export const useDeleteMultiOrder = (ids: number[] | undefined) => {
  return useQuery({
    queryKey: ["delete-multi-order", ids],
    queryFn: () => deleteMultiOrder(ids),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
