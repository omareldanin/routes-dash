"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { updateUser } from "../services/users";
import { useUser } from "../hooks/useUsers";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/loading";

// ✅ Validation Schema (matches DTO + confirmPassword for frontend check)
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
    .required("رقم الهاتف مطلوب"),
  password: yup.string().optional(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة")
    .optional(),
  name: yup.string().required("الاسم مطلوب"),
  avatar: yup.mixed().optional(),
  worksFrom: yup.string().required("وقت البداية مطلوب"),
  worksTo: yup.string().required("وقت النهاية مطلوب"),
});

export default function EditDelivery() {
  const { id } = useParams<{ id: string }>();
  const compnayId = Number(id);

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
      password: "",
      confirmPassword: "",
      avatar: undefined,
      worksFrom: "09:00",
      worksTo: "17:00",
    },
  });

  const { data: user, isLoading } = useUser(compnayId);

  useEffect(() => {
    if (user) {
      reset({
        name: user.user.name,
        phone: user.user.phone,
        worksFrom: user.user.delivery?.worksFroms,
        worksTo: user.user.delivery?.worksTo,
      });
    }
  }, [user]);

  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: (data: FormData) => updateUser(data, compnayId),
    onSuccess: () => {
      toast.success("تم تعديل المندوب بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["users", { role: "VENDOR" }],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("active", "true"); // ثابت لدور الشركه

    if (data.name) formData.append("name", data.name);

    formData.append("worksFroms", data.worksFrom);
    formData.append("worksTo", data.worksTo);

    if (data.password) {
      formData.append("password", data.password);
    }

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    updateCompany(formData);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">
        تعديل بيانات المندوب
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* الصورة */}
        <div>
          <label className="block mb-1 text-[#121E2C]">صورة المندوب</label>
          <input
            type="file"
            {...register("avatar")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.avatar?.message as string}
          </p>
        </div>

        {/* الاسم */}
        <div>
          <label className="block mb-1 text-[#121E2C]">اسم المندوب</label>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-[#121E2C]">
              يبدأ العمل من <span className="text-[red]">*</span>
            </label>
            <input
              type="time"
              {...register("worksFrom")}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
            />
            <p className="text-red-500 text-sm">
              {errors.worksFrom?.message as string}
            </p>
          </div>

          <div>
            <label className="block mb-1 text-[#121E2C]">
              إلى <span className="text-[red]">*</span>
            </label>
            <input
              type="time"
              {...register("worksTo")}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
            />
            <p className="text-red-500 text-sm">
              {errors.worksTo?.message as string}
            </p>
          </div>
        </div>
        {/* كلمة المرور */}
        <div>
          <label className="block mb-1 text-[#121E2C]">كلمة المرور</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.password?.message as string}
          </p>
        </div>

        {/* تأكيد كلمة المرور */}
        <div>
          <label className="block mb-1 text-[#121E2C]">تأكيد كلمة المرور</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message as string}
          </p>
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-[#121E2C] text-white font-medium rounded-lg hover:bg-[#2C2C2C] transition disabled:opacity-50">
          {isPending ? "جارٍ الإضافة..." : "حفظ المندوب"}
        </button>
      </form>
    </div>
  );
}
