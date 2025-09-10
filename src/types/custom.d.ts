import { Request } from "express";

export interface AppUser {
  id: string;
  name: string;
  role: string;
    planId?: string;

}

export interface AuthenticatedRequest extends Request {
  user?: AppUser; 
}

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    } // extend default `User`
  }
}
