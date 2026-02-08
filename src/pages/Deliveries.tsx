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

export default function DeliveriesPage() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const { data, isLoading } = useUsers({
    page,
    size: 10,
    role: "DELIVERY",
    name: search,
  });

  const { mutate: deleteUserById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      toast.success("تم حذف المندوب بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  function formatTimeToAmPm(time: string | null | undefined): string {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12;
    return `${hour12}${
      minutes ? ":" + minutes.toString().padStart(2, "0") : ""
    }${period}`;
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة المناديب
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع المناديب المتوفرة في الشركه
          </p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/deliveries/add")}>
          + إضافة مندوب جديد
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl p-4">
        {/* Search */}
        <div className="flex justify-between items-center mb-10 gap-4">
          <input
            type="text"
            placeholder="بحث عن مندوب .."
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
                <tr className="bg-gradient-to-r from-[#1c46a2] to-[#9341a7ff] text-white shadow-sm">
                  <th className="p-2">الكود</th>
                  <th className="p-2">اسم المندوب</th>
                  <th className="p-2">رقم الهاتف</th>
                  <th className="p-2">مواعيد العمل</th>
                  <th className="p-2">تاريخ الانشاء</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data?.results.map((vendor) => {
                  const create = new Date(vendor.createdAt);
                  return (
                    <tr
                      key={vendor.id}
                      className="bg-white rounded-lg text-gray-700">
                      <td className="p-3">{vendor.id}</td>
                      <td className="p-3">{vendor.name}</td>
                      <td className="p-3">{vendor.phone}</td>
                      <td className="p-3">
                        {formatTimeToAmPm(vendor?.worksFroms)} –{" "}
                        {formatTimeToAmPm(vendor?.worksTo)}
                      </td>
                      <td className="p-3">{create.toLocaleString()}</td>
                      <td className="p-3 flex gap-2">
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
                            navigation(`/delivery/edit/${vendor.id}`);
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
                <p className="text-md text-gray-500 mt-5">لا يوجد مناديب</p>
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
        title="حذف مندوب"
        message="هل أنت متأكد أنك تريد حذف هذا المندوب"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteUserById();
        }}
      />
    </div>
  );
}
