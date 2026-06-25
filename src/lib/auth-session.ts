import { Role } from './mock-db';

const ROLE_COOKIE_NAME = 'sg_role';
const EMAIL_COOKIE_NAME = 'sg_email';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Default sessions for each role
export const MOCK_SESSIONS: Record<Role, UserSession> = {
  SUPER_ADMIN: { id: 'usr-1', name: 'Sri Devi (Director)', email: 'admin@gowthami.edu', role: 'SUPER_ADMIN' },
  COUNSELLOR: { id: 'usr-2', name: 'Rama Rao (Senior Counsellor)', email: 'counsellor.rama@gowthami.edu', role: 'COUNSELLOR' },
  FACULTY: { id: 'usr-4', name: 'Prof. Krishna Rao', email: 'faculty.krishna@gowthami.edu', role: 'FACULTY' },
  STUDENT: { id: 'usr-5', name: 'Aditya Varma', email: 'student.aditya@gmail.com', role: 'STUDENT' },
  PARENT: { id: 'usr-6', name: 'Srinivas Varma', email: 'parent.srinivas@gmail.com', role: 'PARENT' },
};

/**
 * Server-side helper to fetch the active session role.
 * Safe to call in Next.js Server Components.
 */
export async function getServerSession(): Promise<UserSession> {
  // We dynamic import cookies to prevent compilation issues in pure static paths
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const roleVal = cookieStore.get(ROLE_COOKIE_NAME)?.value as Role | undefined;
  
  if (roleVal && MOCK_SESSIONS[roleVal]) {
    return MOCK_SESSIONS[roleVal];
  }
  
  // Default to SUPER_ADMIN so user has full control out of the box
  return MOCK_SESSIONS.SUPER_ADMIN;
}

/**
 * Client-side helper to write the active session cookie.
 */
export function setClientSession(role: Role) {
  if (typeof window !== 'undefined') {
    const session = MOCK_SESSIONS[role];
    document.cookie = `${ROLE_COOKIE_NAME}=${role}; path=/; max-age=604800; SameSite=Strict`;
    document.cookie = `${EMAIL_COOKIE_NAME}=${session.email}; path=/; max-age=604800; SameSite=Strict`;

    // Notify other components of role change (avoids polling)
    window.dispatchEvent(new StorageEvent('storage', { key: ROLE_COOKIE_NAME, newValue: role }));

    // Redirect if on a login or landing page, otherwise reload
    if (window.location.pathname.startsWith('/auth') || window.location.pathname === '/') {
      window.location.href = '/dashboard';
    } else {
      window.location.reload();
    }
  }
}

/**
 * Client-side helper to read a cookie value.
 */
export function getClientCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getClientSession(): UserSession {
  const roleVal = getClientCookie(ROLE_COOKIE_NAME) as Role | null;
  if (roleVal && MOCK_SESSIONS[roleVal]) {
    return MOCK_SESSIONS[roleVal];
  }
  return MOCK_SESSIONS.SUPER_ADMIN;
}
