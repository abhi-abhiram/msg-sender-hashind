"use client";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function Authentication() {
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
      <Button
        onClick={() => {
          void signIn("credentials", {
            userId: "abhiram@gmail.com",
            password: "abhiram",
            redirect: false,
          });
        }}
        className="w-full"
        type="submit"
      >
        Login
      </Button>
    </form>
  );
}
