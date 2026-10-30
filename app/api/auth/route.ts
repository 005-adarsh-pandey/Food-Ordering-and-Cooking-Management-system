import { NextResponse } from 'next/server';
import { getServerUsers } from '@/lib/serverStorage';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const users = await getServerUsers();
    const cleanUsername = username.trim().toLowerCase();

    // Check built-in accounts with convenient dev passwords and the legacy challenge password
    if (cleanUsername === 'admin') {
      const adminUser = users.find((u) => u.username.toLowerCase() === 'admin');
      if (
        adminUser &&
        (password === '2025DEVChallenge' ||
          password === 'admin' ||
          password === 'admin123' ||
          adminUser.password === password)
      ) {
        const { password: _, ...safeUser } = adminUser;
        return NextResponse.json({ success: true, user: safeUser, message: 'Login successful' });
      }
    }

    if (cleanUsername === 'chef') {
      const chefUser = users.find((u) => u.username.toLowerCase() === 'chef');
      if (
        chefUser &&
        (password === '2025DEVChallenge' ||
          password === 'chef' ||
          password === 'chef123' ||
          chefUser.password === password)
      ) {
        const { password: _, ...safeUser } = chefUser;
        return NextResponse.json({ success: true, user: safeUser, message: 'Login successful' });
      }
    }

    if (cleanUsername === 'newuser') {
      const customerUser = users.find((u) => u.username.toLowerCase() === 'newuser');
      if (
        customerUser &&
        (password === '2025DEVChallenge' ||
          password === 'newuser' ||
          password === 'user123' ||
          customerUser.password === password)
      ) {
        const { password: _, ...safeUser } = customerUser;
        return NextResponse.json({ success: true, user: safeUser, message: 'Login successful' });
      }
    }

    // Check all registered users
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername
    );

    if (matchedUser) {
      if (!matchedUser.password || matchedUser.password === password) {
        const { password: _, ...safeUser } = matchedUser;
        return NextResponse.json({ success: true, user: safeUser, message: 'Login successful' });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
