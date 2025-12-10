import { api } from "../api/api";

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  image: string;
  createdAt: string;
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
export interface ProductResponse {
  product: ProductDetail;
}

export const getProduct = async (
  id: number
): Promise<{ product: ProductDetail }> => {
  const response = await api.get<ProductResponse>("products/get" + `/${id}`);
  return response.data;
};
