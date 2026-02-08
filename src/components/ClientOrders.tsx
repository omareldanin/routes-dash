import { useState } from "react";
import { useClientOrders } from "../hooks/useOrders";
import Loader from "./Loader";
import { orderStatusOptions } from "../pages/orders";
import Pagination from "./Pagintation";

export default function OrdersTab({ clientKey }: { clientKey?: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useClientOrders({
    page,
    size: 20,
    key: clientKey,
  });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center z-55 ">
        <Loader size="md" />
      </div>
    );
  }
  if (!data?.data.length) {
    return (
      <div className="text-center text-gray-400 py-10">
        لا يوجد طلبات حتى الآن
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-[#121E2C]">
                طلب #{order.id}
              </span>

              <span
                className={`px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#21114A] text-center ${
                  orderStatusOptions.find((opt) => opt.value === order.status)
                    ?.style
                }`}>
                {
                  orderStatusOptions.find((opt) => opt.value === order.status)
                    ?.label
                }
              </span>
            </div>

            {/* Route */}
            <div className="text-sm text-gray-700 mb-2">
              <div>
                <span className="font-medium">من:</span> {order.from}
              </div>
              <div>
                <span className="font-medium">إلى:</span>{" "}
                {order.to || "لا يوجد"}
              </div>
            </div>

            {/* Notes */}
            <div className="text-sm text-gray-500 mb-3 line-clamp-2">
              <span className="font-medium">ملاحظات:</span>{" "}
              {order.notes || "لا يوجد"}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t">
              <div className="text-sm">
                <div>
                  <span className="text-gray-500">الشحن:</span>{" "}
                  <span className="font-medium text-gray-800">
                    {order.shipping || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">الإجمالي:</span>{" "}
                  <span className="font-semibold text-gray-800">
                    {order.total || 0}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-800">
                {new Date(order.createdAt).toLocaleDateString("ar-EG")}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          page={page}
          totalPages={data?.pagination.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
