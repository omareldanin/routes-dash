import { DotSpinner } from "ldrs/react";
import { useState } from "react";
import { useGetProfile } from "../hooks/useUsers";

interface DeleteDialogProps {
  isOpen: boolean;
  title?: string;
  isLoading?: boolean;
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

export default function ConfirmOrder({
  isOpen,
  title = "تأكيد الحذف",
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteDialogProps) {
  const { data: user } = useGetProfile();

  const [shipping, setShipping] = useState(0);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* العنوان */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>

        {/* الرسالة */}
        <div className="mb-5">
          <label className="text-gray-800 ">حساب الشركه</label>
          <input
            type="number"
            placeholder="حساب الشركه"
            value={shipping}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#21114A] bg-[#F9FAFB] text-gray-900 mt-4"
            onChange={(e) => {
              setShipping(+e.target.value);
            }}
          />
        </div>

        <div className="flex items-center gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              onChange={(e) => {
                if (e.target.checked) {
                  if (user?.user?.min) {
                    setShipping(user.user.min);
                  }
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
                  if (user?.user?.max) {
                    if (user?.user?.max) {
                      setShipping(user.user.max);
                    }
                  }
                }
              }}
              className="w-5 h-5 text-[#21114A] border-gray-300 rounded focus:ring-[#21114A]"
            />
            <span className="text-gray-800">قيمة كبري</span>
          </label>
        </div>
        {/* الأزرار */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            إلغاء
          </button>
          <button
            onClick={() => {
              onConfirm(shipping);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {isLoading ? (
              <DotSpinner size="18" speed="0.9" color="#fff" />
            ) : (
              "تأكيد"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
