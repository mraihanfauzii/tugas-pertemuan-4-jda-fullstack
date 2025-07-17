"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItemQuantity, CartItem } from "@/lib/cart-utils";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
  }, []);

  useEffect(() => {
    calculateTotal(cartItems);
  }, [cartItems]);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleRemove = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCartItems(updatedCart);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, quantity);
    setCartItems(updatedCart);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-10">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/" className="text-blue-500 hover:underline text-lg">
            Start shopping now!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-md mr-6"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
                  <p className="text-blue-600 font-bold text-lg mb-2">
                    Rp{item.price.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center">
                    <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-700">Qty:</label>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="w-16 p-1 border border-gray-300 rounded-md text-center"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center text-xl font-semibold mb-4">
              <span>Total:</span>
              <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}