"use client";

import { useState } from "react";
import Pagination from "../components/Pagintation";
import Loading from "../components/loading";
import { useOrders } from "../hooks/useOrders";
import { resetDeliveryCount, type GetOrdersParams } from "../services/order";
import OrderStatusBar from "../components/OrderStatusFlow";
import { useParams } from "react-router-dom";
import { CircleDollarSign, PackageCheck, Truck, Wallet } from "lucide-react";
import { useUser } from "../hooks/useUsers";
import admin from "../assets/user.png";
import PhoneNumberCell from "../components/PhoneNumberCell";
import DateFilter from "../components/DateFilter";
import DeleteDialog from "../components/DeleteDialog";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";

export interface OptionType {
  value: string;
  label: string;
  style: string;
}

export default function DeliveryPage() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<GetOrdersParams>({
    deliveryId: id ? Number(id) : undefined,
    clientId: undefined,
    status: undefined,
  });

  const { data, isLoading } = useOrders({
    page,
    size: 10,
    ...filters,
  });

  const { data: user, isLoading: loadingDelivery } = useUser(Number(id));

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
      title: "مكسب الطيار",
      value: data?.totalPaid.deliveryFee ?? 0,
      icon: <Truck size={28} />,
      color: "bg-[#F4EBDC]",
      textColor: "text-[#403D39]",
    },
  ];

  function formatTimeToAmPm(time: string | null | undefined): string {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12;
    return `${hour12}${
      minutes ? ":" + minutes.toString().padStart(2, "0") : ""
    }${period}`;
  }

  const { mutate: editOrder, isPending } = useMutation({
    mutationFn: () => resetDeliveryCount(filters),
    onSuccess: () => {
      toast.success("تم تقفيل الحساب بنجاح");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
      setIsDialogOpen(false);
    },
  });

  return (
    <div className=" relative">
      <div className="bg-white shadow rounded-2xl p-4 mb-4">
        {/* ---------- USER BOX (your existing code) ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <div className="text-right">
            <div className="flex items-center gap-3">
              <PhoneNumberCell phone={user?.user.phone!!} />
              <img
                src={
                  user?.user.avatar
                    ? "https://test.talabatk.top/" + user?.user.avatar
                    : admin
                }
                alt={user?.user.name}
                className="w-9 h-9 rounded-full object-cover"
              />

              <div className="text-gray-700 flex items-center justify-center text-md font-bold">
                {user?.user.name}
              </div>

              <div
                className={`w-3 h-3 rounded-full ${
                  user?.user.delivery?.online ? "bg-green-600" : "bg-red-600"
                }`}></div>
            </div>
          </div>

          <div className="flex justify-center items-center flex-col">
            <div className="p-3 bg-gray-700 w-fit rounded-lg text-white font-bold">
              {formatTimeToAmPm(user?.user.delivery?.worksFroms)} –{" "}
              {formatTimeToAmPm(user?.user.delivery?.worksTo)}
            </div>
          </div>
          <div>
            <button
              onClick={() => setIsDialogOpen(true)}
              disabled={data?.notPaid.count === 0}
              className={`bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-bold`}>
              تقفيل حساب
            </button>
          </div>
          <div>
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
        </div>

        {/* ---------- NOT PAID DATA CARDS ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* COUNT */}
          <div className="p-4 rounded-xl shadow bg-gray-50 border border-gray-200 flex flex-col text-center">
            <span className="text-gray-800 text-lg font-bold">عدد الطلبات</span>
            <span className="text-3xl font-bold mt-2 text-gray-500">
              {data?.notPaid.count.toLocaleString()}
            </span>
          </div>

          {/* TOTAL */}
          <div className="p-4 rounded-xl shadow bg-gray-50 border border-gray-200 flex flex-col text-center">
            <span className="text-gray-800 text-lg font-bold ">
              إجمالي قيمة الطلبات
            </span>
            <span className="text-3xl font-bold mt-2 text-gray-500">
              {data?.notPaid.total.toLocaleString()}
            </span>
          </div>

          {/* SHIPPING */}
          <div className="p-4 rounded-xl shadow bg-gray-50 border border-gray-200 flex flex-col text-center">
            <span className="text-gray-800 text-lg font-bold">حساب الشركة</span>
            <span className="text-3xl font-bold mt-2 text-gray-500">
              {data?.notPaid.shipping.toLocaleString()}
            </span>
          </div>

          {/* DELIVERY FEE */}
          <div className="p-4 rounded-xl shadow bg-gray-50 border border-gray-200 flex flex-col text-center">
            <span className="text-gray-800 text-lg font-bold">حساب الطيار</span>
            <span className="text-3xl font-bold mt-2 text-gray-500">
              {data?.notPaid.deliveryFee.toLocaleString()}
            </span>
          </div>
        </div>
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
      <div className="bg-white shadow rounded-2xl p-2 pb-4">
        {isLoading || loadingDelivery ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600">
                  <th className="p-2">#</th>
                  <th className="p-2">التاريخ</th>
                  <th className="p-2">حالة الطلب</th>
                  <th className="p-2">حساب الشركة</th>
                  <th className="p-2">حساب الطيار</th>
                  <th className="p-2">قيمة الطلب</th>
                  <th className="p-2">العنوان (من - إلي)</th>
                  <th className="p-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="bg-white rounded-lg text-gray-700 border-4 border-indigo-500 ">
                      <td className="p-2  border-b-1 border-b-indigo-100 font-bold text-indigo-700">
                        {order.id}
                      </td>
                      <td className="p-2  border-b-1 border-b-indigo-100">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>

                      <td className="p-2  border-b-1 border-b-indigo-100">
                        <OrderStatusBar order={order} />
                      </td>
                      <td className="p-2  border-b-1 border-b-indigo-100 text-red-600 font-bold">
                        {order.shipping.toLocaleString()}
                      </td>
                      <td className="p-2  border-b-1 border-b-indigo-100 text-green-600 font-bold">
                        {order.deliveryFee.toLocaleString()}
                      </td>
                      <td className="p-2  border-b-1 border-b-indigo-100">
                        {order.total.toLocaleString()}
                      </td>
                      <td className="p-2  border-b-1 border-b-indigo-100 text-indigo-700">
                        {`${order.from} - ${order.to}`}
                      </td>
                      <td className="p-2  border-b-1 border-b-indigo-100 text-red-700">
                        {order.notes}
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
      <DeleteDialog
        isOpen={isDialogOpen}
        title="تقفيل حساب المندوب"
        message="هل أنت متأكد أنك تريد تقفيل حساب هذا المندوب؟"
        isLoading={isPending}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={() => {
          editOrder();
        }}
      />
    </div>
  );
}
