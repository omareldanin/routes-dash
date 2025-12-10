import { useQuery } from "@tanstack/react-query";
import { getProducts, type ProductsResponse } from "../services/products";

export const useProducts = (
  page: number,
  size: number,
  name?: string,
  quantity?: number
) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", { page, size, name, quantity }],
    queryFn: () => getProducts({ page, size, name, quantity }),
    refetchOnWindowFocus: false,
  });
};
