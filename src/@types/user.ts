import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: any;
        name: string;
        email: string;
        verified: boolean;
        avatar?: string | undefined;
        followers: number;
        followings: number;
      };
      token:string
    }
  }
}

export interface createUser extends Request {
   body: {
      name: string;
      email: string;
      password: string
   }
}
export interface verifyEmailRequest extends Request {
   body: {
      userId: string;
      token: string;
   }
}
export interface RevalidateEmailRequest  extends Request {
   body: {
      userId: string;
   }
}
export interface ForgotPaasswordLinkRequest  extends Request {
   body: {
      email: string;
   }
}