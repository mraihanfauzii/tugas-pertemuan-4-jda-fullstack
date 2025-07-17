import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, getNextUserId, findUserByEmail, addUser } from '@/lib/mock-db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }
    const newUser: User = {
      id: getNextUserId(),
      name,
      email,
      password,
    };
    addUser(newUser); // Tambahkan user ke array global

    console.log("Registered user:", newUser);
    console.log("Current users in mock DB:", mockUsers); // Untuk debugging

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}