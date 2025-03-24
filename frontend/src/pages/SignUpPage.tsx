import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/PasswordInput";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { fetchSignUp } from "@/feature/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { GlowInput } from "@/components/ui/glow-input";
import PhoneInput from "@/components/phone-input";

const phoneRegex = new RegExp("^[6-9]\\d{9}$");

const FormSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    phoneNumber: z.string().regex(phoneRegex, "Invalid Phone Number!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })
  // check password and confirm password
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUpPage() {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "IN",
    dialCode: "+91",
  });
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useLayoutEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  const signUp = useDispatchWithToast(fetchSignUp, {
    loadingMessage: "Account creating...",
    getSuccessMessage: (data) => data.message || "Account created successfully",
    getErrorMessage: (error) =>
      error.message ||
      error ||
      "Failed to create account. Please try again later.",
    onSuccess() {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        navigate("/login");
      }, 10000);
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await signUp({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phoneNumber: data.phoneNumber,
      countryCode: selectedCountry.dialCode,
    });
  }

  // const responseGoogle = (authResponse: any) => {
  //   try {
  //     dispatch(fetchGoogleAuth(authResponse.code));
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
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verification</AlertDialogTitle>
            <AlertDialogDescription>
              We have sent a verification link to your email. Click the link to
              verify your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogCancel>Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mx-auto max-w-[600px] min-w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <GlowInput placeholder="full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        onPhoneNumberChange={field.onChange}
                        phoneNumber={field.value}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        {...field}
                      />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" size="sm" type="submit">
                Submit
              </Button>
            </form>
          </Form>
          {/* <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={googleLogin}
            >
              Sign Up with Google
            </Button> */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default SignUpPage;
