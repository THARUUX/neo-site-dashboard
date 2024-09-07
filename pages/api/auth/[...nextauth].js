import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// Define a list of admin email addresses
const adminEmails = ['tharuuxofc@gmail.com', 'info@neo.lk'];

// Define NextAuth options
export const authOptions = {
  // Use the SECRET environment variable as the secret key
  secret: process.env.SECRET,
  providers: [
    // Configure Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  // Use MongoDBAdapter for session storage
  adapter: MongoDBAdapter(clientPromise),
  // Define session callback to check if user is an admin
  callbacks: {
    session: ({ session, token, user }) => {
      // Check if the user's email is in the adminEmails array
      if (adminEmails.includes(session?.user?.email)) {
        // Allow access if user is an admin
        return session;
      } else {
        // Deny access if user is not an admin
        return false;
      }
    },
  },
};

// Initialize NextAuth with the configured options
export default NextAuth(authOptions);

// Function to check if a request is from an admin user
export async function isAdminRequest(req, res) {
  // Get the session using getServerSession
  const session = await getServerSession(req, res, authOptions);
  // If session is not found or user is not admin, respond with 401 Unauthorized
  if (!session?.user || !adminEmails.includes(session.user.email)) {
    res.status(401);
    res.end();
    throw 'Unauthorized';
  }
}
