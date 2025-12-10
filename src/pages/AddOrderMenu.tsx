"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { useClients } from "../hooks/useClients";
import type { Client } from "../services/clients";
import { createOrder } from "../services/order";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import Loader from "../components/Loader";
import { useGetProfile } from "../hooks/useUsers";

interface AddOrderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId?: number;
}

export default function AddOrderMenu({
  isOpen,
  onClose,
  deliveryId,
}: AddOrderMenuProps) {
  const [query, setQuery] = useState("");
  const [orderData, setOrderData] = useState<
    | {
        count: number;
        clientId: number | undefined;
        deliveryId: number | undefined;
        from: string | undefined;
        to: string | undefined;
        notes: string | undefined;
        shipping: string | undefined;
        total: string | undefined;
      }
    | undefined
  >({
    count: 1,
    clientId: undefined,
    deliveryId: undefined,
    from: undefined,
    to: undefined,
    notes: undefined,
    shipping: undefined,
    total: undefined,
  });
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(
    undefined
  );
  const [companyConfirm, setCompanyConfirm] = useState(false);

  const { data: clients } = useClients({
    page: 1,
    size: 1000,
  });

  const { data: user } = useGetProfile();

  const { mutate: addOrder, isPending } = useMutation({
    mutationFn: (data: any) => createOrder(data),
    onSuccess: () => {
      toast.success("تم اضافة الطلبات بنجاح");
      setOrderData({
        count: 1,
        clientId: undefined,
        deliveryId: undefined,
        from: undefined,
        to: undefined,
        notes: undefined,
        shipping: undefined,
        total: undefined,
      });
      setCompanyConfirm(false);
      setSelectedClient(undefined);
      queryClient.invalidateQueries({
        queryKey: ["orders", "deliveriesOrders"],
      });
      onClose();
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });
  const onSubmit = () => {
    const splitedTo = orderData?.to?.split("-");
    const splitedshipping = orderData?.shipping?.split("-");
    const splitedTotal = orderData?.total?.split("-");
    const splitedNotes = orderData?.notes?.split("-");

    let orders = [];
    for (let index = 0; index < orderData?.count!!; index++) {
      orders.push({
        clientId: orderData?.clientId,
        from: orderData?.from,
        to: splitedTo ? splitedTo[index] : undefined,
        notes: splitedNotes ? splitedNotes[index] : undefined,
        shipping: splitedshipping ? +splitedshipping[index] : undefined,
        total: splitedTotal ? +splitedTotal[index] : undefined,
        deliveryId: deliveryId || undefined,
        companyConfirm,
      });
    }
    orders.length > 0 && addOrder(orders);
  };

  const searchDeliveries = (value: string) => {
    const term = value.trim();

    if (!term) return [];

    // If input contains ANY letters → search by name
    const hasLetters = /[a-zA-Z\u0600-\u06FF]/.test(term);

    if (hasLetters) {
      return clients?.data.filter((d) =>
        d.name?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // If starts with 01 → search phone
    if (term.startsWith("01")) {
      return clients?.data.filter((d) => d.phone.startsWith(term));
    }

    // Otherwise → search by ID
    return clients?.data.filter((d) => d.id === Number(term));
  };

  const handleSearch = () => {
    const r = searchDeliveries(query);
    if (r) {
      setQuery(r[0]?.phone || "");
      setSelectedClient(r[0]);
      setOrderData({
        ...orderData!!,
        clientId: r[0].id,
        from: r[0].address!!,
      });
    } else {
      setSelectedClient(undefined);
      setOrderData({
        ...orderData!!,
        clientId: undefined,
        from: undefined,
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#0000006f] bg-opacity-10 z-42 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-[100px] left-[50%] translate-x-[-50%] w-full sm:w-[450px] bg-white text-[#121E2C] shadow-xl z-50 transition-transform duration-300 
        ${isOpen ? " opacity-100 visible" : " opacity-0 invisible"}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold flex items-center">
            {companyConfirm ? (
              <ArrowRight
                size={22}
                className="ml-2"
                cursor={"pointer"}
                onClick={() => setCompanyConfirm(false)}
              />
            ) : null}
            إضافة أوردر جديد
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {isPending ? (
          <div className="absolute w-full h-full flex items-center justify-center bg-[#0000002f] z-55">
            <Loader size="lg" />
          </div>
        ) : null}
        {/* Example order form */}
        {companyConfirm ? (
          <>
            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="حساب الشركه"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                value={orderData?.shipping ?? ""}
                onChange={(e) => {
                  setOrderData({
                    ...orderData!!,
                    shipping: e.target.value,
                  });
                }}
              />
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    onChange={(e) => {
                      if (e.target.checked) {
                        let result = "";
                        if (user?.user?.min) {
                          console.log("sss");

                          for (
                            let index = 0;
                            index < orderData?.count!!;
                            index++
                          ) {
                            result = result + user?.user?.min;
                            if (index < orderData?.count!! - 1) {
                              result = result + " - ";
                            }
                          }
                        }
                        setOrderData({
                          ...orderData!!,
                          shipping: result,
                        });
                      }
                    }}
                    className="w-5 h-5 text-[#21114A] border-gray-300 rounded focus:ring-[#21114A]"
                  />
                  <span className="text-gray-800">قيمة صغري</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    onChange={(e) => {
                      if (e.target.checked) {
                        let result = "";
                        if (user?.user?.max) {
                          for (
                            let index = 0;
                            index < orderData?.count!!;
                            index++
                          ) {
                            result = result + user?.user?.max;
                            if (index < orderData?.count!! - 1) {
                              result = result + " - ";
                            }
                          }
                        }
                        setOrderData({
                          ...orderData!!,
                          shipping: result,
                        });
                      }
                    }}
                    className="w-5 h-5 text-[#21114A] border-gray-300 rounded focus:ring-[#21114A]"
                  />
                  <span className="text-gray-800">قيمة كبري</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="قيمه الاوردر"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                value={orderData?.total}
                onChange={(e) => {
                  setOrderData({
                    ...orderData!!,
                    total: e.target.value,
                  });
                }}
              />
              <button
                type="button"
                className="w-full bg-[#121E2C] text-white py-2 rounded-lg hover:bg-[#2c2c2c] transition"
                onClick={onSubmit}>
                تآكيد
              </button>
            </div>
          </>
        ) : (
          <form className="p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="grow-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setSelectedClient(undefined);
                        setOrderData({
                          ...orderData!!,
                          clientId: undefined,
                          from: undefined,
                        });
                      }
                      setQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="اكتب هاتف او اسم او كود العميل"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  type="button"
                  className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700">
                  <Search size={20} />
                </button>
              </div>

              {selectedClient ? (
                <>
                  <input
                    type="text"
                    placeholder="اسم العميل"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                    value={selectedClient.name || ""}
                  />
                  <input
                    type="text"
                    placeholder="من"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                    value={orderData?.from}
                    onChange={(e) => {
                      setOrderData({
                        ...orderData!!,
                        from: e.target.value,
                      });
                    }}
                  />
                  <div className="flex gap-5 items-center mt-4">
                    <label className="block text-sm font-medium mb-1">
                      عدد الاوردرات
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                      min={1}
                      value={orderData?.count}
                      onChange={(e) => {
                        setOrderData({
                          ...orderData!!,
                          count: +e.target.value,
                        });
                      }}
                    />
                  </div>
                  <textarea
                    placeholder="إلي"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                    required
                    rows={2}
                    value={orderData?.to}
                    onChange={(e) => {
                      setOrderData({
                        ...orderData!!,
                        to: e.target.value,
                      });
                    }}></textarea>
                  <textarea
                    placeholder="ملاحظات"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
                    rows={2}
                    value={orderData?.notes}
                    onChange={(e) => {
                      setOrderData({
                        ...orderData!!,
                        notes: e.target.value,
                      });
                    }}></textarea>
                </>
              ) : null}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="w-full bg-[#121E2C] text-white py-2 rounded-lg hover:bg-[#2c2c2c] transition disabled:opacity-75"
                disabled={!orderData?.clientId || !orderData.from}
                onClick={() => setCompanyConfirm(true)}>
                تآكيد فرع
              </button>
              <button
                type="button"
                className="w-full bg-[#ccc] text-black py-2 rounded-lg hover:bg-[grey] transition disabled:opacity-75"
                disabled={!orderData?.clientId || !orderData.from}
                onClick={onSubmit}>
                تآكيد طيار
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
