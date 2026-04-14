import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ nama: "", harga: "", qty: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("kasir"));
    if (saved) setData(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("kasir", JSON.stringify(data));
  }, [data]);

  const rupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka);

  const handleSubmit = () => {
    if (!form.nama || !form.harga || !form.qty) return;

    if (editIndex !== null) {
      const updated = [...data];
      updated[editIndex] = {
        ...form,
        harga: parseInt(form.harga),
        qty: parseInt(form.qty),
      };
      setData(updated);
      setEditIndex(null);
    } else {
      setData([
        ...data,
        {
          ...form,
          harga: parseInt(form.harga),
          qty: parseInt(form.qty),
        },
      ]);
    }

    setForm({ nama: "", harga: "", qty: "" });
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const total = data.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          💸 Kasir Pro React
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="Nama"
            value={form.nama}
            onChange={(e) =>
              setForm({ ...form, nama: e.target.value })
            }
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Harga"
            type="number"
            value={form.harga}
            onChange={(e) =>
              setForm({ ...form, harga: e.target.value })
            }
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Qty"
            type="number"
            value={form.qty}
            onChange={(e) =>
              setForm({ ...form, qty: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            {editIndex !== null ? "Update" : "Tambah"}
          </button>
        </div>

        <table className="w-full border">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="text-center border-t">
                <td>{item.nama}</td>
                <td>Rp {rupiah(item.harga)}</td>
                <td>{item.qty}</td>
                <td>Rp {rupiah(item.harga * item.qty)}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(i)}
                    className="bg-yellow-400 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-right mt-4 font-bold text-lg">
          Total: Rp {rupiah(total)}
        </h2>
      </div>
    </div>
  );
}