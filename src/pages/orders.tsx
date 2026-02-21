"use client";

import { useEffect, useState } from "react";
import Pagination from "../components/Pagintation";
import Loading from "../components/loading";
import { useExportOrders, useOrders } from "../hooks/useOrders";
import {
  deleteMultiOrder,
  updateOrder,
  type GetOrdersParams,
} from "../services/order";
import { useUsers } from "../hooks/useUsers";
import Select from "react-select";
import { useClients } from "../hooks/useClients";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import Loader from "../components/Loader";
import { CircleDollarSign, PackageCheck, Truck, Wallet } from "lucide-react";
import DateFilter from "../components/DateFilter";
import DeleteDialog from "../components/DeleteDialog";
import { useAuth } from "../store/authStore";
import { useSearchParams } from "react-router-dom";
import EditOrderModal from "./EditOrderModal";

export interface OptionType {
  value: string;
  label: string;
  style: string;
}

// Order status options

export const orderStatusOptions: OptionType[] = [
  { value: "STARTED", label: "جديد", style: "bg-blue-100 text-blue-700" },
  {
    value: "ACCEPTED",
    label: "تم القبول",
    style: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "RECEIVED",
    label: "تم الاستلام",
    style: "bg-orange-100 text-orange-700",
  },
  {
    value: "DELIVERED",
    label: "تم التوصيل",
    style: "bg-green-100 text-green-700",
  },
  { value: "CANCELED", label: "ملغي", style: "bg-red-100 text-red-700" },
  { value: "POSTPOND", label: "معلق", style: "bg-gray-100 text-gray-700" },
];

export default function OrdersPage() {
  const { superAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [params] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<GetOrdersParams>({
    deliveryId: undefined,
    clientId: undefined,
    status: undefined,
    confirmed: "true",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const clientId = params.get("clientId");
    if (clientId) {
      setFilters((pre) => ({ ...pre, clientId: +clientId }));
    }
  }, [params]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const pageIds = data?.data?.map((o) => o.id) || [];

    // Check if all current page rows are selected
    const allSelected = pageIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      // UNSELECT ONLY this page
      setSelectedRows((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // SELECT ALL items on this page (append only missing ones)
      setSelectedRows((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const { refetch, isFetching } = useExportOrders(filters);

  const handleExport = async () => {
    const result = await refetch(); // 👈 triggers export request

    if (result.data) {
      const blob = result.data;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "orders.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const { data, isLoading } = useOrders({
    page,
    size: 10,
    ...filters,
  });

  const { data: deliveries } = useUsers({
    page: 1,
    size: 1000,
    role: "DELIVERY",
  });

  const { data: clients } = useClients({
    page: 1,
    size: 1000,
  });

  const deliveryOptions = deliveries?.results.map((d) => ({
    value: d.id,
    label: d?.name || `#${d.id}`,
  }));

  const clientOptions = clients?.data.map((d) => ({
    value: d.id,
    label: d?.name || `#${d.id}`,
  }));

  const { mutate: editOrder, isPending } = useMutation({
    mutationFn: (data: { data: any; id: number }) =>
      updateOrder(data.data, data.id),
    onSuccess: () => {
      toast.success("تم تعديل الطلب بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const { mutate: deleteOrder, isPending: loadingdelete } = useMutation({
    mutationFn: () => deleteMultiOrder(selectedRows),
    onSuccess: () => {
      toast.success("تم حذف الطلبات بنجاح");
      setIsDialogOpen(false);
      setSelectedRows([]);
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: data?.pagination.count ?? 0,
      icon: <PackageCheck size={28} />,
      color: "bg-[#C4AF8A]",
      textColor: "text-[#fff]",
    },

    {
      title: "إجمالي المدفوعات",
      value: data?.totalPaid?.total.toLocaleString() ?? 0,
      icon: <CircleDollarSign size={28} />,
      color: "bg-[#D9C8AA]",
      textColor: "text-[#403D39]",
    },
    {
      title: "حساب الشركة",
      value: data?.totalPaid.shipping?.toLocaleString() ?? 0,
      icon: <Wallet size={28} />,
      color: "bg-[#E2D3B5]",
      textColor: "text-[#403D39]",
    },
    {
      title: "حساب الطيارين",
      value: data?.totalPaid.deliveryFee ?? 0,
      icon: <Truck size={28} />,
      color: "bg-[#F4EBDC]",
      textColor: "text-[#403D39]",
    },
  ];

  return (
    <div className="relative">
      {isPending ? (
        <div className="absolute top-[0] left-[0] w-full h-full flex items-center justify-center z-55 ">
          <Loader size="md" />
        </div>
      ) : null}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            إدارة الطلبات
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isFetching}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            {isFetching ? "جاري التصدير..." : "تصدير إلى Excel"}
          </button>
          {!superAdmin ? (
            <button
              onClick={() => setIsDialogOpen(true)}
              disabled={selectedRows.length === 0 || loadingdelete}
              className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ${
                selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              حذف المحدد
            </button>
          ) : null}
        </div>
      </div>

      {/* Filters Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-3">
        {/* Status Filter */}
        <div className="text-[#121E2C] ">
          <Select
            value={deliveryOptions?.find((o) => o.value === filters.deliveryId)}
            options={[
              { value: -1, label: "بدون طيار" },
              ...(deliveryOptions || []),
            ]}
            isClearable
            className="basic-single"
            placeholder="اختر الطيار..."
            onChange={(opt) =>
              setFilters((f) => ({
                ...f,
                deliveryId: opt ? opt.value : undefined,
              }))
            }
          />
        </div>
        <div className="text-[#121E2C] ">
          <Select
            value={clientOptions?.find((o) => o.value === filters.clientId)}
            options={clientOptions}
            isClearable
            className="basic-single"
            placeholder="اختر العميل..."
            onChange={(opt) =>
              setFilters((f) => ({
                ...f,
                clientId: opt ? opt.value : undefined,
              }))
            }
          />
        </div>

        <div className="text-[#121E2C] ">
          <Select
            value={orderStatusOptions?.find((o) => o.value === filters.status)}
            options={orderStatusOptions}
            isClearable
            className="basic-single"
            placeholder="اختر الحاله..."
            onChange={(opt) =>
              setFilters((f) => ({
                ...f,
                status: opt ? opt.value : undefined,
              }))
            }
          />
        </div>
        <DateFilter
          onChange={(range) => {
            if (range) {
              setFilters((f) => ({
                ...f,
                from: range?.from ? range.from.toISOString() : undefined,
                to: range?.to ? range.to.toISOString() : undefined,
              }));
            } else {
              setFilters((f) => ({
                ...f,
                from: undefined,
                to: undefined,
              }));
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:scale-[1.02] duration-300 ${stat.color}`}>
            <div>
              <p className={`text-sm font-medium opacity-90 ${stat.textColor}`}>
                {stat.title}
              </p>
              <h2 className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                {stat.value}
              </h2>
            </div>
            <div
              className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner ${stat.textColor}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}

      <div className="bg-white shadow rounded-2xl p-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gradient-to-r from-[#1c46a2] to-[#9341a7ff] text-white shadow-sm">
                  <th className="p-2 flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-purple-700 cursor-pointer"
                      checked={
                        data?.data &&
                        data?.data.length > 0 &&
                        data?.data.every((o) => selectedRows.includes(o.id))
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th className="p-2">#</th>
                  <th className="p-2">العميل</th>
                  <th className="p-2">وقت الانشاء</th>
                  <th className="p-2">من</th>
                  <th className="p-2">الي</th>
                  <th className="p-2">الطيار</th>
                  <th className="p-2">حساب الشركه</th>
                  <th className="p-2">قيمه الاوردر</th>
                  <th className="p-2">الحاله</th>
                  <th className="p-2">تعديل</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((order) => {
                  const create = new Date(order.createdAt);

                  return (
                    <tr
                      key={order.id}
                      className="bg-white rounded-lg text-gray-700 border-4 border-indigo-500">
                      <td className="p-3 border-b-1 border-b-indigo-100 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-purple-700 cursor-pointer"
                          checked={selectedRows.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                        />
                      </td>
                      <td className="p-3 border-b-1 border-b-indigo-100">
                        {order.id}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {order.client?.name}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {create.toLocaleString()}
                      </td>
                      <td className="p-3 border-b-1 border-b-indigo-100 max-w-[220px]">
                        <div className="truncate" title={order.from}>
                          {order.from}
                        </div>
                      </td>

                      <td className="p-3 border-b-1 border-b-indigo-100 max-w-[220px]">
                        <div className="truncate" title={order.to}>
                          {order.to}
                        </div>
                      </td>

                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {order.processed ||
                        order.status === "CANCELED" ||
                        order.status === "DELIVERED" ||
                        superAdmin ? (
                          <span className="text-green-600 font-bold">
                            {order.delivery
                              ? order.delivery.user.name
                              : "غير محدد"}
                          </span>
                        ) : (
                          <Select
                            value={
                              order?.delivery
                                ? deliveryOptions?.find(
                                    (o) => o.value === order?.delivery.id,
                                  )
                                : undefined
                            }
                            options={deliveryOptions}
                            isClearable
                            className="basic-single"
                            placeholder="اختر الطيار..."
                            onChange={(opt) =>
                              editOrder({
                                data: { deliveryId: opt?.value },
                                id: order.id,
                              })
                            }
                          />
                        )}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {order.shipping}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {order.total}
                      </td>
                      <td className="p-3 border-b border-indigo-100">
                        <div className="flex items-center gap-2">
                          {order.processed ||
                          order.status === "CANCELED" ||
                          order.status === "DELIVERED" ||
                          superAdmin ? (
                            <div
                              className={`w-full px-2 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-1 focus:ring-[#21114A] text-center ${
                                orderStatusOptions.find(
                                  (opt) => opt.value === order.status,
                                )?.style
                              }`}>
                              {
                                orderStatusOptions.find(
                                  (opt) => opt.value === order.status,
                                )?.label
                              }
                            </div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => {
                                editOrder({
                                  data: { status: e.target.value },
                                  id: order.id,
                                });
                              }}
                              className={`w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#21114A] ${
                                orderStatusOptions.find(
                                  (opt) => opt.value === order.status,
                                )?.style
                              }`}>
                              {orderStatusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border-b border-indigo-100 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditOpen(true);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                          تعديل
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data?.pagination.count === 0 && !isLoading ? (
              <div className="flex justify-center">
                <p className="text-md text-gray-500 mt-5">لا يوجد طلبات</p>
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
      <EditOrderModal
        order={selectedOrder}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(data) =>
          editOrder({
            id: selectedOrder.id,
            data,
          })
        }
      />
      <DeleteDialog
        isOpen={isDialogOpen}
        title="حذف الطلبات"
        message="هل أنت متأكد أنك تريد حذف هذه الطلبات المحدده"
        isLoading={loadingdelete}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteOrder();
        }}
      />
    </div>
  );
}
