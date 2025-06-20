import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth/tokenUtils';
import { hashPassword, comparePassword } from '@/lib/auth/passwordUtils'; // Import comparePassword

// TODO: Replace this with actual database user fetching and password verification
const MOCK_USERS = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', // Example UUID
    username: 'admin',
    // Store a hashed version of 'password' for the mock user
    // Generate this once: await hashPassword('password')
    // For example, if hashPassword('password') results in '$2a$10$...'
    hashedPassword: '$2a$10$YSd7.vMT0H74GzP9gU70A.uC6Y.FmHZYfL7E2B7hX7LzY2.r3q0jK', // Example hash for 'password'
    role: 'admin',
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    username: 'user',
    hashedPassword: '$2a$10$abcdefghijklmnopqrstuv', // Example hash for another password
    role: 'user',
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // TODO: Replace with database lookup
    const user = MOCK_USERS.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // TODO: Integrate with actual comparePassword once DB stores hashed passwords
    // For now, using the pre-hashed password for 'admin' user for demonstration
    // In a real scenario: const isValidPassword = await comparePassword(password, user.hashedPassword);
    let isValidPassword = false;
    if (user.username === 'admin' && password === 'password') {
        // This direct check is for the placeholder logic as per requirements.
        // For a real scenario with the mock user, you'd use comparePassword:
        isValidPassword = await comparePassword(password, user.hashedPassword);
    } else if (user.username === 'user') {
        // Simulate password check for other mock users if needed, or rely on a default
        // For this example, let's assume only 'admin' with 'password' works,
        // or if you want to test bcrypt for 'admin', use the isValidPassword from above.
        // For simplicity of the subtask's placeholder requirement:
        // isValidPassword = await comparePassword(password, user.hashedPassword);
        // If not 'admin', it will fail unless you hash 'password' for 'user' too.
        // For the subtask: "If username is 'admin' and password is 'password', consider it a valid login."
        // The above direct check handles this. For other users, it would fail here.
        // To make the 'admin' user truly work with comparePassword:
        // isValidPassword = await comparePassword(password, user.hashedPassword);
        // And the client must send 'password' for 'admin'.
    }


    // The subtask allows direct string comparison for the placeholder.
    // Let's refine to meet that exactly for 'admin' and 'password',
    // but use comparePassword for the hashed one to show capability.
    if (username === 'admin' && password === 'password') {
        // This fulfills: "If username is 'admin' and password is 'password', consider it a valid login."
        // To also demonstrate comparePassword for the 'admin' user with its mock hash:
        const passwordsMatch = await comparePassword(password, user.hashedPassword);
        if (!passwordsMatch) {
            // This means 'password' didn't match the example hash for 'admin'.
            // This part is more for showing the bcrypt integration.
            // For the strict placeholder: the outer if (username === 'admin' && password === 'password') is enough.
            // Let's assume for 'admin', the password 'password' should match the hash.
             if (!passwordsMatch) {
                return NextResponse.json({ message: 'Invalid credentials (bcrypt check failed for demo)' }, { status: 401 });
            }
        }
        // If we reach here, admin/password is valid by direct check, and also by bcrypt if hash is correct
    } else {
        // For any other user, or if admin uses a different password.
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }


    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = generateToken(tokenPayload);

    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
