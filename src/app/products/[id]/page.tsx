"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { findProductById, Product } from "@/lib/mock-db";
import { addToCart } from "@/lib/cart-utils";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const foundProduct = findProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Jika produk tidak ditemukan, redirect ke halaman 404 atau home
        router.push("/not-found"); // Atau router.push('/')
      }
    }
  }, [productId, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setMessage(`${quantity} ${product.name} added to cart!`);
      setTimeout(() => setMessage(null), 3000); // Hapus pesan setelah 3 detik
    }
  };

  if (!product) {
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
            className="bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
          {message && (
            <p className="mt-4 text-green-600 font-medium">{message}</p>
          )}

          <div className="mt-8">
            <Link href="/" className="text-blue-500 hover:underline">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}