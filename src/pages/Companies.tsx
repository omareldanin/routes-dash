"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Pagination from "../components/Pagintation";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "../components/DeleteDialog";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { useUsers } from "../hooks/useUsers";
import { deleteUser } from "../services/users";
import Loading from "../components/loading";

export default function CompaniesPage() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const { data, isLoading } = useUsers({
    page,
    size: 10,
    role: "COMPANY_ADMIN",
    name: search,
  });

  const { mutate: deleteUserById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      toast.success("تم حذف الشركه بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة الشركات
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع الشركات المتوفرة في النظام
          </p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/company/add")}>
          + إضافة شركه جديد
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl p-4">
        {/* Search */}
        <div className="flex justify-between items-center mb-10 gap-4">
          <input
            type="text"
            placeholder="بحث عن شركه .."
            className="w-1/3 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB] text-gray-900 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600">
                  <th className="p-2">#</th>
                  <th className="p-2">اسم الشركه</th>
                  <th className="p-2">رقم الهاتف</th>
                  <th className="p-2">العنوان</th>
                  <th className="p-2">تاريخ الانشاء</th>
                  <th className="p-2">بدايه الاشتراك</th>
                  <th className="p-2">نهايه الاشتراك</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data?.results.map((vendor) => {
                  const create = new Date(vendor.createdAt);
                  const start = new Date(vendor?.supscriptionStartDate!!);
                  const end = new Date(vendor?.supscriptionEndDate!!);
                  return (
                    <tr
                      key={vendor.id}
                      className="bg-white rounded-lg text-gray-700">
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {vendor.id}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {vendor.name}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {vendor.phone}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {vendor?.address || "لا يوجد"}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {create.toLocaleString()}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {start.toLocaleString()}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {end.toLocaleString()}
                      </td>

                      <td className="p-3 flex gap-2  border-b-1 border-b-indigo-100">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setIsDialogOpen(true);
                            setId(vendor.id);
                          }}>
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            navigation(`/company/edit/${vendor.id}`);
                          }}>
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data?.count === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد شركات</p>
              </div>
            ) : null}
            <Pagination
              page={page}
              totalPages={data?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف شركه"
        message="هل أنت متأكد أنك تريد حذف هذه الشركه"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteUserById();
        }}
      />
    </div>
  );
}
