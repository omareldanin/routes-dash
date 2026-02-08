import { useState } from "react";
import { useParams } from "react-router-dom";
import { useClientByKey } from "../hooks/useClients";
import Loading from "../components/loading";
import AddOrder from "../components/AddOrder";
import OrdersTab from "../components/ClientOrders";

export default function ClientPage() {
  const { key } = useParams<{ key: string }>();
  const { data, isLoading } = useClientByKey(key);

  const [activeTab, setActiveTab] = useState<"add" | "list">("add");

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg min-h-[80vh] mt-10 mb-10">
      <h1 className="text-2xl font-bold text-[#121E2C] mb-6">
        مرحبا {data?.name}
      </h1>

      {/* Tabs */}
      <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden p-1">
        <button
          onClick={() => setActiveTab("add")}
          className={`w-1/2 py-3 text-center  transition font-bold text-md 
      ${
        activeTab === "add"
          ? "bg-[#D9C8AA] text-[#404040] border-b-2 border-[#D9C8AA]"
          : "text-gray-400 hover:text-[#121E2C] "
      }`}>
          إضافة طلب
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`w-1/2 py-3 text-center transition border-r font-bold text-md
      ${
        activeTab === "list"
          ? "bg-[#D9C8AA] text-[#404040] border-b-2 border-[#D9C8AA]"
          : "text-gray-400 hover:text-[#121E2C]"
      }`}>
          عرض الطلبات
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && (
          <div>
            {/* Add Order Component */}
            <AddOrder clientKey={key} address={data?.address} />
          </div>
        )}

        {activeTab === "list" && (
          <div>
            {/* Get Orders Component */}
            <OrdersTab clientKey={key} />
          </div>
        )}
      </div>
    </div>
  );
}
