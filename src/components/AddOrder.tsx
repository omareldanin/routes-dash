import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { createOrderByCLient } from "../services/order";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import type { AxiosError } from "axios";
import type { APIError } from "../api/api";
import { DotSpinner } from "ldrs/react";

export default function AddOrder({
  clientKey,
  address,
}: {
  clientKey?: string;
  address?: string;
}) {
  const [from, setFrom] = useState(address);
  const [to, setTo] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: addOrder, isPending } = useMutation({
    mutationFn: (data: any) => createOrderByCLient(data),
    onSuccess: () => {
      toast.success("تم اضافة الطلبات بنجاح");
      setTo("");
      setNotes("");
      queryClient.invalidateQueries({
        queryKey: ["client-orders"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(clientKey);

    addOrder({ from, to, notes, key: clientKey });
    // 🔜 هنا تقدر تربطه بالـ API
    // mutate(payload)

    // reset
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* From */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          من
        </label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9C8AA]"
          required
        />
      </div>

      {/* To */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          إلى
        </label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9C8AA]"
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          ملاحظات
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9C8AA]"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#121E2C] text-white py-2 rounded-lg hover:opacity-90 transition">
        {isPending ? (
          <DotSpinner size="18" speed="0.9" color="#fff" />
        ) : (
          "إضافة الطلب"
        )}
      </button>
    </form>
  );
}
