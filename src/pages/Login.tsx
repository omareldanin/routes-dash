import { useState } from "react";
import { User, Lock } from "lucide-react"; // icons
import { signInService, type SignInRequest } from "../services/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { DotSpinner } from "ldrs/react";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: ({ password, phone }: SignInRequest) => {
      return signInService({ password, phone });
    },
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["validateToken"],
      });
      setAuth(data);
      navigate("/home");
    },
    onError: (
      error: AxiosError<{
        message: string;
        status: string;
      }>
    ) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const performLogin = () => {
      login({
        password: password,
        phone: username,
      });
    };

    performLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        {/* Logo */}
        {/* <div className="flex justify-center mb-4">
          <div className="bg-[#D9C8AA] p-3 rounded-lg">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
        </div> */}

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#000] mb-4 mt-4">
          نظام إدارة التوصيل
        </h1>
        <p className="text-lg text-gray-500 mb-6">تسجيل الدخول </p>

        {/* Form */}
        <form
          className="space-y-4 text-right"
          dir="rtl"
          onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block mb-2 text-gray-700">رقم الهاتف</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ادخل رقم الهاتف"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pr-10  rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB] text-gray-900 placeholder-gray-400"
              />

              <User
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-gray-700">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                placeholder="ادخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB] text-gray-900 placeholder-gray-400"
              />
              <Lock
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#9341a7ff] text-white py-2 rounded-lg hover:bg-[#9341a7ff] transition">
            {isLoading ? (
              <DotSpinner size="18" speed="0.9" color="#fff" />
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
