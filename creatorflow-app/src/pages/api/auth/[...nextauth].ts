import NextAuth from "next-auth";
import { authOptions } from "@/auth";
import type { NextApiRequest, NextApiResponse } from "next";

// Use the correct handler format for NextAuth v4 with Pages Router
export default (req: NextApiRequest, res: NextApiResponse) => 
  NextAuth(req, res, authOptions);