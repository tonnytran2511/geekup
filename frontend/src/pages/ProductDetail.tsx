import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Header from "../components/Header";
import type { Product } from "../types/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async (productId: string) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/product/${productId}`);
        setProduct(response.data);
      } catch (err: unknown) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Không thể tải thông tin sản phẩm. Vui lòng thử lại!",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {error || "Không tìm thấy sản phẩm"}
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="bg-slate-50 rounded-xl p-8 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-96 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                    {product.brand}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < parseInt(product.rating) ? "⭐" : "☆"}
                    </span>
                  ))}
                  <span className="text-slate-600 text-sm ml-2">
                    ({product.rating} đánh giá)
                  </span>
                </div>
                <div className="text-4xl font-bold text-green-600">
                  ${product.price}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  Mô tả sản phẩm
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-1">SKU</p>
                  <p className="font-semibold text-slate-800">{product.sku}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-1">Tồn kho</p>
                  <p className="font-semibold text-slate-800">
                    {product.stock} sản phẩm
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 col-span-2">
                  <p className="text-sm text-slate-500 mb-1">Ngày tạo</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => navigate("/products")}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tiếp tục xem sản phẩm khác
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
