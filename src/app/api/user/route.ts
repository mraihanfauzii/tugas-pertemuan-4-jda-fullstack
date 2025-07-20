import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { updateUser } from '@/lib/mock-db';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { name, email, password } = await req.json();
    const updatedData: { name?: string; email?: string; password?: string } = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) updatedData.password = password;

    if (Object.keys(updatedData).length === 0) {
        return NextResponse.json({ message: 'No data provided for update' }, { status: 400 });
    }

    const updatedUser = updateUser(session.user.id, updatedData);

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile updated successfully!', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}