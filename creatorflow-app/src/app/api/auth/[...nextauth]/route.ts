// This file is commented out because we're using the Pages Router approach for NextAuth v4
// import NextAuth from "next-auth";
// import { authOptions } from "@/auth";
// 
// // For NextAuth v4 with App Router, we'll use a simpler approach
// // This works because NextAuth v4 can adapt to both environments
// const handler = NextAuth(authOptions);
// 
// export { handler as GET, handler as POST }

import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };