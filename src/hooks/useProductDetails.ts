import { useQuery } from "@tanstack/react-query";
import { getProduct, type ProductResponse } from "../services/productDetails";

export const useProduct = (id: number) => {
  return useQuery<ProductResponse>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
