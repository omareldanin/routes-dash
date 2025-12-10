"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { useEffect } from "react";
import Loading from "../components/loading";
import { useGetProfile } from "../hooks/useUsers";
import { updateProfile } from "../services/users";

// ✅ Validation Schema (matches DTO + confirmPassword for frontend check)
const schema = yup.object().shape({
  max: yup.number().optional(),
  min: yup.number().optional(),
  deliveryPrecent: yup.number().optional(),
});

export default function Setting() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      max: 0,
      min: 0,
      deliveryPrecent: 0,
    },
  });

  const { data: user, isLoading } = useGetProfile();

  useEffect(() => {
    if (user) {
      reset({
        max: user.user.company?.max,
        min: user.user.company?.min,
        deliveryPrecent: user.user.company?.deliveryPrecent,
      });
    }
  }, [user]);

  const { mutate: update, isPending } = useMutation({
    mutationFn: (data: FormData) => updateProfile(data),
    onSuccess: () => {
      toast.success("تم تعديل البيانات بنجاح");

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("min", data.min);
    formData.append("max", data.max);
    formData.append("deliveryPrecent", data.deliveryPrecent);

    update(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">الاعدادات</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* الاسم */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            القيمه الصغري
            <span className="text-[red]">*</span>
          </label>
          <input
            {...register("min")}
            type="number"
            min={0}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#21114A] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.min?.message as string}
          </p>
        </div>

        <div>
          <label className="block mb-1 text-[#121E2C]">
            القيمه الكبري
            <span className="text-[red]">*</span>
          </label>
          <input
            {...register("max")}
            type="number"
            min={0}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#21114A] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.max?.message as string}
          </p>
        </div>
        <div>
          <label className="block mb-1 text-[#121E2C]">
            نسبه المندوب
            <span className="text-[red]">*</span>
          </label>
          <input
            {...register("deliveryPrecent")}
            type="number"
            min={0}
            max={100}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#21114A] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.deliveryPrecent?.message as string}
          </p>
        </div>
        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-[#121E2C] text-white font-medium rounded-lg hover:bg-[#2C2C2C] transition disabled:opacity-50">
          {isPending ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}
