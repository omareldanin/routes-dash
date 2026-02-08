"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { createClient } from "../services/clients";

// ✅ Validation Schema (matches DTO + confirmPassword for frontend check)
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
    .required("رقم الهاتف مطلوب"),
  name: yup.string().required("الاسم مطلوب"),
  address: yup.string().required("العنوان مطلوب"),
  shippingValue: yup.number().optional(),
  activeShipping: yup.boolean().optional(),
});

export default function AddClinet() {
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
      shippingValue: 0,
      activeShipping: false,
    },
  });

  const { mutate: createNewVendor, isPending } = useMutation({
    mutationFn: (data: FormData) => createClient(data),
    onSuccess: () => {
      toast.success("تم اضافة العميل بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      reset(); // ✅ Clear form after success
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    console.log(data);

    formData.append("phone", data.phone);
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("shippingValue", data.shippingValue);
    formData.append("activeShipping", data.activeShipping);

    createNewVendor(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">إضافة عميل جديد</h1>

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

        <div>
          <div className="flex items-center justify-start gap-2 mb-3">
            <input
              type="checkbox"
              {...register("activeShipping")}
              className="w-6 h-6 rounded-md border-2 border-[#D9C8AA] text-[#000000] bg-[#F9FAFB] focus:ring-2 focus:ring-[#D9C8AA] focus:ring-offset-0 cursor-pointer"
            />

            <label className="mb-1 text-[#121E2C]">قيمه شحن ثابته</label>
          </div>
          <input
            {...register("shippingValue")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
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
