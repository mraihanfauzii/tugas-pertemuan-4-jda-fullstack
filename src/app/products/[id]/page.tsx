"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/lib/mock-db";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getCart, saveCart, CartItem } from '@/lib/cart-storage';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const { user, isAdmin, isAuthenticated, isLoading } = useCurrentUser();
  const userId = user?.id; // Dapatkan ID pengguna dari hook useCurrentUser

  useEffect(() => {
    if (productId) {
      // Mengambil produk dari API endpoint, bukan mock-db langsung di client
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${productId}`);
          if (!res.ok) {
            console.error(`Failed to fetch product with ID ${productId}:`, res.statusText);
            router.push("/not-found"); // Redirect jika produk tidak ditemukan atau ada error
            return;
          }
          const data: Product = await res.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
          router.push("/not-found");
        }
      };
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!isAuthenticated || !userId) { // Jika user belum login atau tidak ada userId
      router.push('/auth/signin'); // Arahkan ke halaman login
      return;
    }

    if (product) {
      const currentCart = getCart(userId);
      const existingItem = currentCart.find(item => item.id === product.id);

      let updatedCart: CartItem[];
      if (existingItem) {
        updatedCart = currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedCart = [...currentCart, { ...product, quantity: quantity }];
      }
      saveCart(userId, updatedCart);
      setMessage(`${quantity} ${product.name} added to cart!`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEditProduct = () => {
    if (isAdmin) { // Pastikan hanya admin yang bisa mengedit
        router.push(`/products?edit=${productId}`);
    }
  };

  if (isLoading || !product) { // Tambahkan isLoading ke kondisi loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="md:w-1/2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={450}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          <p className="text-blue-600 font-extrabold text-3xl mb-6">
            Rp{product.price.toLocaleString('id-ID')}
          </p>

          {isAdmin ? (
            <button
              onClick={handleEditProduct}
              className="bg-yellow-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Edit Product
            </button>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <label htmlFor="quantity" className="mr-4 text-lg font-medium">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 p-2 border border-gray-300 rounded-md text-center"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className={`${
                  isAuthenticated // Cek isAuthenticated dari useCurrentUser
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors`}
                title={isAuthenticated ? "" : "Login to add to cart"}
                disabled={!isAuthenticated} // Disable tombol jika belum login
              >
                Add to Cart
              </button>
            </>
          )}

          {message && (
            <p className="mt-4 text-green-600 font-medium">{message}</p>
          )}

          <div className="mt-8">
            <Link href="/dashboard" className="text-blue-500 hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}