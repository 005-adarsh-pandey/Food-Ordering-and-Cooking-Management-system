import { NextResponse } from 'next/server';
import { getServerUsers, saveServerUsers, UserRecord } from '@/lib/serverStorage';
import { generateId, getCurrentDateTime } from '@/lib/utils';

export async function GET() {
  try {
    const users = await getServerUsers();
    // Strip passwords before returning
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    if (!name || !username || !email) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const users = await getServerUsers();

    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 400 });
    }

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
    }

    const newUser: UserRecord = {
      id: generateId(),
      name,
      username,
      email,
      role: 'customer',
      createdAt: getCurrentDateTime(),
      password: password || 'password',
    };

    const updated = [...users, newUser];
    await saveServerUsers(updated);

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 500 });
  }
}
