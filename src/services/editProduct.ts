import { api } from "../api/api";

export const editProduct = async (id: number, data: FormData) => {
  const respone = await api.patch<FormData>("products/edit/" + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};
