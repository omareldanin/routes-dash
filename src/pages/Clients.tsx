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
import Loading from "../components/loading";
import { useClients } from "../hooks/useClients";
import { deleteClient } from "../services/clients";

export default function ClientsPage() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [searchPhone, setPhone] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const navigation = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);

  const { data, isLoading } = useClients({
    page,
    size: 10,
    name: search,
    phone: searchPhone,
  });

  const { mutate: deleteUserById, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteClient(id),
    onSuccess: () => {
      toast.success("تم حذف العميل بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
      setIsDialogOpen(false);
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة العملاء
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            إدارة جميع العملاء المتوفرة في الشركه
          </p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigation("/client/add")}>
          + إضافة عميل جديد
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl p-4">
        {/* Search */}
        <div className="flex items-center mb-10 gap-4">
          <input
            type="text"
            placeholder="بحث بإسم العميل .."
            className="w-1/3 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB] text-gray-900 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="بحث برقم الهاتف .."
            className="w-1/3 px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#D9C8AA] focus:outline-none bg-[#F9FAFB] text-gray-900 placeholder-gray-400"
            value={searchPhone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600">
                  <th className="p-2">الكود</th>
                  <th className="p-2">اسم العميل</th>
                  <th className="p-2">رقم الهاتف</th>
                  <th className="p-2">العنوان</th>
                  <th className="p-2">عدد الاوردرات</th>
                  <th className="p-2">مجموع ما دفعه للشركه</th>
                  <th className="p-2">مجموع قيم الاوردرات</th>
                  <th className="p-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((client) => {
                  return (
                    <tr
                      key={client.id}
                      className="bg-white rounded-lg text-gray-700 border-4 border-indigo-500">
                      <td className="p-3 border-b-1 border-b-indigo-100 ">
                        {client.id}
                      </td>
                      <td
                        className="p-3  border-b-1 border-b-indigo-100 font-bold text-indigo-500 cursor-pointer"
                        onClick={() => {
                          navigation(`/orders?clientId=${client.id}`);
                        }}>
                        {client.name}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {client.phone}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {client.address}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {client.ordersCount}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {client.totalShipping}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {client.totalAmount}
                      </td>
                      <td className="p-3 flex gap-2  border-b-1 border-b-indigo-100">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setIsDialogOpen(true);
                            setId(client.id);
                          }}>
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            navigation(`/client/edit/${client.id}`);
                          }}>
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data?.pagination.count === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد عملاء</p>
              </div>
            ) : null}
            <Pagination
              page={page}
              totalPages={data?.pagination.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف العميل"
        message="هل أنت متأكد أنك تريد حذف هذا العميل؟"
        isLoading={deleteLoading}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteUserById();
        }}
      />
    </div>
  );
}
