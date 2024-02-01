import { type Metadata } from "next";
import Link from "next/link";
// import { getServerAuthSession } from "~/server/auth";
import { getServerSession } from "next-auth";
import Authentication from "./_components/login";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
  const user = await getServerSession();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Login
        </h2>
        <Authentication />
        <div className="text-center">
          <Link
            className="text-sm text-blue-500 underline dark:text-blue-400"
            href="#"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
