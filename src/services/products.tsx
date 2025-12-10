import { api } from "../api/api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  image: string;
  createdAt: string;
  status: string;
  available: boolean;
  createdBy: {
    id: number;
    name: string;
  };
  categories: {
    id: number;
    name: string;
    price: string;
    quantity: number;
  }[];
}

export interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export const getProducts = async (params: {
  page: number;
  size: number;
  name?: string;
  quantity?: number;
}): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("products/getAll", {
    params,
  });
  return response.data;
};

export const deleteProduct = async (id: number | undefined) => {
  const respone = await api.delete("products/delete/" + id);
  return respone.data;
};
