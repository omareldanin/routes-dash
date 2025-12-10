import { api } from "../api/api";

export type OrderStatus =
  | "STARTED"
  | "ACCEPTED"
  | "RECEIVED"
  | "DELIVERED"
  | "POSTPOND"
  | "CANCELED";

export interface Order {
  status: OrderStatus;
  from: string;
  to: string;
  id: number;
  notes: string;
  total: number;
  shipping: number;
  deliveryFee: number;
  processed: boolean;
  timeline: TimeLine[];
  delivery: {
    id: number;
    user: {
      name: string;
    };
  };
  client: {
    id: number;
    name: string;
    phone: string;
  };
  createdAt: Date;
}

export interface TimeLine {
  status: string;
  id: number;
  createdAt: Date;
}

export interface OrdersResponse {
  totalPaid: {
    total: number;
    shipping: number;
    deliveryFee: number;
  };
  notPaid: {
    count: number;
    total: number;
    shipping: number;
    deliveryFee: number;
  };
  pagination: {
    count: number;
    page: number;
    totalPages: number;
  };
  data: Order[];
}

export interface DeliveryWithOrders {
  pagination: {
    count: number;
    page: number;
    totalPages: number;
  };
  data: {
    id: number;
    delivery: {
      orders: {
        id: number;
        total: number;
        shipping: number;
        deliveryFee: number;
        notes: string;
        from: string;
        to: string;
        status: string;
        createdAt: Date;
        company: {
          deliveryPrecent: number;
        };
        timeline: {
          id: number;
          status: string;
          createdAt: Date;
        }[];
      }[];
      online: boolean;
    };
    phone: string;
    name: string;
    avatar: string;
  }[];
}
export interface GetOrdersParams {
  page?: number;
  size?: number;
  status?: string;
  deliveryId?: number;
  clientId?: number;
  companyId?: number;
  from?: string;
  to?: string;
  search?: string;
}

export const getOrders = async (
  params: GetOrdersParams
): Promise<OrdersResponse> => {
  const response = await api.get("/orders", { params });
  return response.data;
};

export const getExportOrders = async (
  params: GetOrdersParams
): Promise<Blob> => {
  const response = await api.get("/orders/export", {
    params,
    responseType: "blob",
  });

  return response.data;
};

export const getDeliveriesWithOrders = async (
  params: GetOrdersParams
): Promise<DeliveryWithOrders> => {
  const response = await api.get("/orders/deliveries-with-last-orders", {
    params,
  });
  return response.data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await api.get("/orders/" + id);
  return response.data;
};

export const deleteOrder = async (id: number | undefined) => {
  const respone = await api.delete("orders/" + id);
  return respone.data;
};

export const deleteMultiOrder = async (ids: number[] | undefined) => {
  const respone = await api.delete("orders/multi", { data: { ids: ids } });
  return respone.data;
};

export const updateOrder = async (data: any, id: number) => {
  const respone = await api.patch("orders/" + id, data);
  return respone.data;
};

export const resetDeliveryCount = async (params: GetOrdersParams) => {
  const respone = await api.post("/orders/reset-delivery-count", params);
  return respone.data;
};

export const createOrder = async (data: any) => {
  const respone = await api.post("orders/", data);
  return respone.data;
};
