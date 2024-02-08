"use client";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";

export default function Authentication() {
  const router = useRouter();

  const { toast } = useToast();

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const email = (e.target as unknown as { email: { value: string } })
          .email.value;
        const password = (
          e.target as unknown as { password: { value: string } }
        ).password.value;
        void signIn("credentials", {
          userId: email,
          password: password,
          redirect: false,
        }).then((res) => {
          if (!res?.ok) {
            toast({
              title: "Login failed",
              description: "Invalid email or password",
              variant: "destructive",
            });
          } else {
            router.push("/dashboard");
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          className="w-full"
          id="email"
          placeholder="m@example.com"
          required
          type="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input className="w-full" id="password" required type="password" />
      </div>
      <Button className="w-full" type="submit">
        Login
      </Button>
    </form>
  );
}
