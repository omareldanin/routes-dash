import { useQuery } from "@tanstack/react-query";
import {
  getDeliveriesWithOrders,
  deleteMultiOrder,
  getExportOrders,
  getOrders,
  type GetOrdersParams,
  getOrdersForCLient,
} from "../services/order";

export const useOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });
};

export const useClientOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: ["client-orders", params],
    queryFn: () => getOrdersForCLient(params),
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    enabled: !!params.key,
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
