import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowInput } from "@/components/ui/glow-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/PasswordInput";
import { fetchLogIn } from "@/feature/authSlice";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLayoutEffect } from "react";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function LoginPage() {
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useLayoutEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatchLogin = useDispatchWithToast(fetchLogIn, {
    loadingMessage: "Logging in...",
    getSuccessMessage: (data) => data.message || "Successfully logged in!",
    getErrorMessage: (error) => (error as string) || "Error logging in.",
    onSuccess: () => {
      navigate("/");
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    await dispatchLogin(values);
  }

  // const responseGoogle = (authResponse: any) => {
  //   try {
  //     if (authResponse.code === undefined) {
  //       toast.error("Failed to Sign Up with Google. Please try again later.");
  //       return;
  //     }
  //     const googlePromise = dispatch(
  //       fetchGoogleAuth(authResponse.code)
  //     ).unwrap();
  //     toast.promise(googlePromise, {
  //       loading: "Logging in...",
  //       success: (data: any) => {
  //         form.reset();
  //         navigate("/");
  //         return data.message || "Login successful";
  //       },
  //       error: (error) => {
  //         return error || error.message || "Error logging in.";
  //       },
  //     });
  //   } catch (error) {
  //     toast.error("Failed to Sign Up with Google. Please try again later.");
  //   }
  // };

  // const googleLogin = useGoogleLogin({
  //   onSuccess: responseGoogle,
  //   onError: responseGoogle,
  //   flow: "auth-code",
  // });
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <GlowInput placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="sm" type="submit">
              Login
            </Button>
          </form>
        </Form>
        {/* <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={googleLogin}
        >
          Login with Google
        </Button> */}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
