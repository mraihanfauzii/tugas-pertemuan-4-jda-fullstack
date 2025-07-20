import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, addProduct, Product } from '@/lib/mock-db';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";

// GET: Mengambil semua produk (Bisa diakses siapa saja)
export async function GET() {
  const products = getAllProducts();
  return NextResponse.json(products, { status: 200 });
}

// POST: Menambahkan produk baru (Hanya Admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') { // <<< Cek Role Admin
    return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const { name, description, price, imageUrl } = await req.json();

    if (!name || !description || typeof price !== 'number' || price <= 0 || !imageUrl) {
      return NextResponse.json({ message: 'Invalid product data: name, description, price (positive number), imageUrl are required.' }, { status: 400 });
    }

    const newProduct: Omit<Product, 'id'> = { name, description, price, imageUrl };
    const addedProduct = addProduct(newProduct);

    return NextResponse.json(addedProduct, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}