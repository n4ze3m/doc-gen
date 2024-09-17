import { useAuthActions } from "@convex-dev/auth/react";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function SignUpWithPassword() {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          {/* <Logo /> */}
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            DocGen
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Create account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              const formData = new FormData(event.currentTarget);
              signIn("password", formData)
                .then(() => {
                  toast({
                    title: "Welcome to DocGen!",
                  });
                })
                .catch((error) => {
                  const title = "Unable to sign up. Please try again later.";

                  toast({ title, variant: "destructive" });
                  setSubmitting(false);
                });
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
            <input name="flow" value={"signUp"} type="hidden" />

            <Button
              disabled={submitting}
              className="w-full mt-6 "
              type="submit"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
