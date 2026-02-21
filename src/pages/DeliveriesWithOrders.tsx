"use client";

import { useState } from "react";
import Pagination from "../components/Pagintation";
import Loading from "../components/loading";
import { useDeliveriesOrders } from "../hooks/useOrders";
import { type GetOrdersParams } from "../services/order";
import { useUsers } from "../hooks/useUsers";
import admin from "../assets/user.png";
import PhoneNumberCell from "../components/PhoneNumberCell";
import OrderStatusBar from "../components/OrderStatusFlow";
import { useNavigate } from "react-router-dom";
import AddOrderMenu from "./AddOrderMenu";
import { Search } from "lucide-react";

export interface OptionType {
  value: string;
  label: string;
  style: string;
}

export default function DeliveriesOrdersPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [deliveryId, setDeliveryId] = useState<number | undefined>(undefined);
  const [isAddOrderOpen, setAddOrderOpen] = useState(false);

  const [filters] = useState<GetOrdersParams>({
    deliveryId: undefined,
    clientId: undefined,
    status: undefined,
  });

  const { data, isLoading } = useDeliveriesOrders({
    page,
    size: 10,
    ...filters,
  });

  const { data: deliveries } = useUsers({
    page: 1,
    size: 1000,
    role: "DELIVERY",
  });

  const searchDeliveries = (value: string) => {
    const term = value.trim();

    if (!term) return [];

    // If input contains ANY letters → search by name
    const hasLetters = /[a-zA-Z\u0600-\u06FF]/.test(term);

    if (hasLetters) {
      return deliveries?.results.filter((d) =>
        d.name.toLowerCase().includes(term.toLowerCase()),
      );
    }

    // If starts with 01 → search phone
    if (term.startsWith("01")) {
      return deliveries?.results.filter((d) => d.phone.startsWith(term));
    }

    // Otherwise → search by ID
    return deliveries?.results.filter((d) => d.id === Number(term));
  };

  const handleSearch = () => {
    const r = searchDeliveries(query);
    if (r) {
      setDeliveryId(r[0]?.id);
      setQuery(r[0].name);
      setAddOrderOpen(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#121E2C] mb-2 mt-0">
            متابعة الطيارين
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="ادخل الكود او الاسم او رقم الهاتف"
            className="w-60 px-2 py-2 border border-indigo-200 rounded-lg focus:border-indigo-400 focus:outline-none bg-white text-gray-900 placeholder-gray-400"
          />

          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <table className="w-full text-sm text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600">
                  <th className="p-2"></th>
                  <th className="p-2">الطيار</th>
                  <th className="p-2">حالة الطلب</th>
                  <th className="p-2">عدد الطلبات</th>
                  <th className="p-2">حساب الطيار</th>
                  <th className="p-2">حالة الطيار</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((delivery) => {
                  return (
                    <tr
                      key={delivery.id}
                      className="bg-white rounded-lg text-gray-700 border-4 border-indigo-500">
                      <td className="p-3 border-b-1 border-b-indigo-100">
                        <PhoneNumberCell phone={delivery.phone} />
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/current-deliveries/delivery/${delivery.id}`,
                            )
                          }>
                          <img
                            src={
                              delivery.avatar
                                ? "https://api.routes-co.com/" + delivery.avatar
                                : admin
                            }
                            alt={delivery.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div className="text-gray-700 flex items-center justify-center text-sm font-semibold">
                            {delivery.name}
                          </div>
                        </div>
                      </td>

                      <td className="p-3  border-b-1 border-b-indigo-100">
                        <OrderStatusBar order={delivery.delivery.orders[0]} />
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100">
                        {delivery.delivery?.orders?.length}
                      </td>
                      <td className="p-3  border-b-1 border-b-indigo-100 text-green-700">
                        {delivery.delivery?.orders
                          ? delivery.delivery?.orders.reduce(
                              (acc, order) =>
                                acc +
                                (order.shipping *
                                  order.company.deliveryPrecent) /
                                  100,
                              0,
                            )
                          : 0}
                      </td>
                      <td
                        className={`p-3  border-b-1 border-b-indigo-100 font-bold ${
                          delivery.delivery?.online
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                        {delivery.delivery?.online ? "متصل" : "غير متصل"}
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
      <AddOrderMenu
        isOpen={isAddOrderOpen}
        onClose={() => setAddOrderOpen(false)}
        deliveryId={deliveryId}
      />
    </div>
  );
}
