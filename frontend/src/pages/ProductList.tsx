import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Header from "../components/Header";
import type { Product } from "../types/product";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });

  // 1. Fetch danh sách 120 sản phẩm từ Mock API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/product");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    if (filters.brand) {
      result = result.filter((product) => product.brand === filters.brand);
    }

    if (filters.minPrice) {
      result = result.filter(
        (product) => parseFloat(product.price) >= parseFloat(filters.minPrice),
      );
    }

    if (filters.maxPrice) {
      result = result.filter(
        (product) => parseFloat(product.price) <= parseFloat(filters.maxPrice),
      );
    }

    if (filters.minRating) {
      result = result.filter(
        (product) => parseInt(product.rating) >= parseInt(filters.minRating),
      );
    }

    return result;
  }, [searchQuery, filters, products]);

  const getUniqueCategories = () => {
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.sort();
  };

  const getUniqueBrands = () => {
    const brands = [...new Set(products.map((p) => p.brand))];
    return brands.sort();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Danh sách sản phẩm
          </h2>
          <p className="text-slate-600">
            Hiển thị {filteredProducts.length} / {products.length} sản phẩm
          </p>
        </div>

        {/* Khu vực thanh tìm kiếm và bộ lọc */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
            <div className="xl:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên sản phẩm..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Danh mục
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                {getUniqueCategories().map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thương hiệu
              </label>
              <select
                value={filters.brand}
                onChange={(e) =>
                  setFilters({ ...filters, brand: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả</option>
                {getUniqueBrands().map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Giá tối thiểu
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                placeholder="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Giá tối đa
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                placeholder="1000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Grid hiển thị sản phẩm */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-slate-600">
              Vui lòng thử lại với từ khóa hoặc bộ lọc khác
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="aspect-square bg-slate-100 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      ⭐ {product.rating}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
