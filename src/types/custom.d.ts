export interface AppUser {
  id: string;
  name: string;
  role: string;
  planId?: string;
}

declare global {
  namespace Express {
    // نغيّر تعريف User بالكامل
    interface User extends AppUser {}

    interface Request {
      user?: User;
    }
  }
}
