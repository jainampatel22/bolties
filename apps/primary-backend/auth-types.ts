import { type Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: any; // You can replace `any` with a specific user type
}