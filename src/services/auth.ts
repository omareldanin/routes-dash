import { api } from "../api/api";

export interface SignInRequest {
  phone: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  token: string;
  refreshToken: string;
}

export const signInService = async (data: SignInRequest) => {
  const response = await api.post("auth/login", data, {
    method: "post",
  });
  return response.data;
};
