import MonthlyOrdersChart from "../components/ChartComponent";
import Loading from "../components/loading";
import ProductOrdersChart from "../components/ProductOrdersChart";
import { useDashboard } from "../hooks/useStatistics";
import { PackageCheck, Truck, CircleDollarSign, Wallet } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import Select from "react-select";
import { useState } from "react";
import { useAuth } from "../store/authStore";

const Home = () => {
  const { role } = useAuth();
  const [company, setCompany] = useState<string | undefined>(undefined);
  const { data, isLoading } = useDashboard(company);
  const { data: companies } = useUsers({
    page: 1,
    size: 1000,
    role: "COMPANY_ADMIN",
  });

  if (isLoading) {
    return <Loading />;
  }

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: data?.totalOrders ?? 0,
      icon: <PackageCheck size={28} />,
      color: "bg-[#D9C8AA]",
      textColor: "text-[#403D39]",
    },
    {
      title: "عدد المناديب",
      value: data?.activeDeliveries ?? 0,
      icon: <Truck size={28} />,
      color: "bg-[#F4EBDC]",
      textColor: "text-[#403D39]",
    },
    {
      title: "إجمالي المدفوعات",
      value: data?.totalPaid?.toLocaleString() ?? 0,
      icon: <CircleDollarSign size={28} />,
      color: "bg-[#E2D3B5]",
      textColor: "text-[#403D39]",
    },
    {
      title: "أرباح الشركة (الشحن)",
      value: data?.shipping?.toLocaleString() ?? 0,
      icon: <Wallet size={28} />,
      color: "bg-[#C4AF8A]",
      textColor: "text-[#fff]",
    },
  ];

  const deliveryOptions = companies?.results.map((d) => ({
    value: d.id,
    label: d?.name || `#${d.id}`,
  }));

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex item-center justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#21114A] mb-1">
            لوحه التحكم الرئيسيه
          </h1>
          <p className="text-sm text-gray-500">نظرة عامة على أداء الشركه</p>
        </div>
        {role === "ADMIN" ? (
          <div className="text-[#121E2C] w-50">
            <Select
              value={deliveryOptions?.find((o) => o.value + "" === company)}
              options={[...(deliveryOptions || [])]}
              isClearable
              className="basic-single"
              placeholder="اختر الشركه..."
              onChange={(opt) => setCompany(opt?.value + "")}
            />
          </div>
        ) : null}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <div className="grid grid-cols-3  gap-4 mt-5">
        {/* إجراءات سريعة */}
        <div className="bg-white shadow rounded-2xl">
          <ProductOrdersChart ordersByStatus={data?.statusCounts || {}} />
        </div>
        {/* النشاط الأخير */}
        <div className="bg-white shadow rounded-2xl p-4 col-span-2">
          <h2 className="font-bold text-lg mb-4 text-right text-[#121E2C]">
            أداء المبيعات الشهريه
          </h2>
          <div className="space-y-4">
            <MonthlyOrdersChart monthlySales={data?.monthlySales || {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
