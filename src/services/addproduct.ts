import { api } from "../api/api";

export const createProduct = async (data: FormData) => {
  const respone = await api.post<FormData>("products/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};

export const createCategory = async (data: FormData) => {
  const respone = await api.post<FormData>("products/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};
