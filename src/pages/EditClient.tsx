"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { updateClient } from "../services/clients";
import { useParams } from "react-router-dom";
import { useClient } from "../hooks/useClients";
import { useEffect } from "react";
import Loading from "../components/loading";

// ✅ Validation Schema (matches DTO + confirmPassword for frontend check)
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
    .required("رقم الهاتف مطلوب"),
  name: yup.string().required("الاسم مطلوب"),
  address: yup.string().required("العنوان مطلوب"),
});

export default function EditClinet() {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const { data: client, isLoading } = useClient(clientId);

  useEffect(() => {
    if (client) {
      reset({
        name: client.name!!,
        phone: client?.phone,
        address: client?.address!!,
      });
    }
  }, [client]);

  const { mutate: editClient, isPending } = useMutation({
    mutationFn: (data: FormData) => updateClient(data, clientId),
    onSuccess: () => {
      toast.success("تم تعديل العميل بنجاح");

      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("name", data.name);
    formData.append("address", data.address);

    editClient(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">
        تعديل بيانات عميل
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* الاسم */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            اسم العميل
            <span className="text-[red]">*</span>
          </label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.name?.message as string}
          </p>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            رقم الهاتف <span className="text-[red]">*</span>
          </label>
          <input
            {...register("phone")}
            maxLength={11}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.phone?.message as string}
          </p>
        </div>

        {/* العنوان */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            العنوان <span className="text-[red]">*</span>
          </label>
          <input
            {...register("address")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.address?.message as string}
          </p>
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-[#121E2C] text-white font-medium rounded-lg hover:bg-[#2C2C2C] transition disabled:opacity-50">
          {isPending ? "جارٍ الإضافة..." : "حفظ العميل"}
        </button>
      </form>
    </div>
  );
}
