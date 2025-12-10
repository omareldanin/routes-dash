"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { createUser } from "../services/users";

// ✅ Validation Schema (matches DTO + confirmPassword for frontend check)
const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
    .required("رقم الهاتف مطلوب"),
  password: yup.string().required("كلمة المرور مطلوبة"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة")
    .required("تأكيد كلمة المرور مطلوب"),
  name: yup.string().optional(),
  address: yup.string().optional(),
  companyId: yup.number().optional(),
  supscriptionStartDate: yup.date().optional(),
  supscriptionEndDate: yup.date().optional(),
  avatar: yup.mixed().optional(),
});

export default function AddVendor() {
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
      address: "",
      companyId: undefined,
      supscriptionStartDate: undefined,
      avatar: undefined,
    },
  });

  const { mutate: createNewVendor, isPending } = useMutation({
    mutationFn: (data: FormData) => createUser(data),
    onSuccess: () => {
      toast.success("تم اضافة الشركه بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["users", { role: "VENDOR" }],
      });
      reset(); // ✅ Clear form after success
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("role", "COMPANY_ADMIN"); // ثابت لدور الشركه

    if (data.name) formData.append("name", data.name);
    if (data.address) formData.append("address", data.address);
    if (data.companyId) formData.append("companyId", String(data.companyId));
    if (data.supscriptionStartDate) {
      // Convert "YYYY-MM-DD" → ISO string
      const isoDate = new Date(data.supscriptionStartDate).toISOString();
      formData.append("supscriptionStartDate", isoDate);
    }

    if (data.supscriptionEndDate) {
      // Convert "YYYY-MM-DD" → ISO string
      const isoDate = new Date(data.supscriptionEndDate).toISOString();
      formData.append("supscriptionEndDate", isoDate);
    }

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    createNewVendor(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-[#121E2C]">إضافة شركه جديد</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* الصورة */}
        <div>
          <label className="block mb-1 text-[#121E2C]">صورة الشركه</label>
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
          <label className="block mb-1 text-[#121E2C]">اسم الشركه</label>
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

        {/* كلمة المرور */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            كلمة المرور <span className="text-[red]">*</span>
          </label>
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
          <label className="block mb-1 text-[#121E2C]">
            تأكيد كلمة المرور <span className="text-[red]">*</span>
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message as string}
          </p>
        </div>

        {/* العنوان */}
        <div>
          <label className="block mb-1 text-[#121E2C]">العنوان</label>
          <input
            {...register("address")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.address?.message as string}
          </p>
        </div>

        {/* تاريخ الاشتراك */}
        <div>
          <label className="block mb-1 text-[#121E2C]">
            تاريخ بداية الاشتراك
          </label>
          <input
            type="date"
            {...register("supscriptionStartDate")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.supscriptionStartDate?.message as string}
          </p>
        </div>

        <div>
          <label className="block mb-1 text-[#121E2C]">
            تاريخ نهايه الاشتراك
          </label>
          <input
            type="date"
            {...register("supscriptionEndDate")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D9C8AA] bg-[#F9FAFB] text-gray-900"
          />
          <p className="text-red-500 text-sm">
            {errors.supscriptionEndDate?.message as string}
          </p>
        </div>
        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-[#121E2C] text-white font-medium rounded-lg hover:bg-[#2C2C2C] transition disabled:opacity-50">
          {isPending ? "جارٍ الإضافة..." : "حفظ الشركه"}
        </button>
      </form>
    </div>
  );
}
