import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface Props {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditOrderModal({
  order,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    notes: "",
    from: "",
    to: "",
    shipping: 0,
    total: 0,
  });

  useEffect(() => {
    if (order) {
      setForm({
        notes: order.notes || "",
        from: order.from || "",
        to: order.to || "",
        shipping: order.shipping || 0,
        total: order.total || 0,
      });
    }
  }, [order]);

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`تعديل الطلب #${order.id}`}>
      <div className="space-y-3">
        <div className="space-y-4 mt-4 text-right">
          {/* From */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              من
            </label>
            <input
              type="text"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21114A] focus:border-[#21114A] bg-[#F9FAFB]"
            />
          </div>

          {/* To */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              الي
            </label>
            <input
              type="text"
              value={form.to}
              onChange={(e) => setForm({ ...form, to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21114A] focus:border-[#21114A] bg-[#F9FAFB]"
            />
          </div>

          {/* Shipping */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              حساب الشركة
            </label>
            <input
              type="number"
              value={form.shipping}
              onChange={(e) =>
                setForm({ ...form, shipping: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21114A] focus:border-[#21114A] bg-[#F9FAFB]"
            />
          </div>

          {/* Total */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              قيمة الطلب
            </label>
            <input
              type="number"
              value={form.total}
              onChange={(e) =>
                setForm({ ...form, total: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21114A] focus:border-[#21114A] bg-[#F9FAFB]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              ملاحظات
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#21114A] focus:border-[#21114A] bg-[#F9FAFB]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg">
            إلغاء
          </button>

          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            حفظ
          </button>
        </div>
      </div>
    </Modal>
  );
}
