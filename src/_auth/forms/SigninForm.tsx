import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isPending: isUserLoading } = useUserContext();

  // Ensure context is returning correctly
  console.log("Checking user context: ", checkAuthUser, isUserLoading);

  // Query for sign-in
  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  // Ensure sign-in query is correctly set up
  console.log("Sign-in account hook status: ", signInAccount, isPending);

  // Form setup using Zod for validation
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign-in handler
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    console.log("Handling sign-in for user: ", user); // Log form data when submitted

    try {
      const session = await signInAccount(user); // Attempting login
      console.log("session" , session);
      console.log("Sign-in response: ", session); // Log the session response

      if (!session) {
        console.log("No session returned. Toasting error.");
        toast({ title: "Login failed. Please try again." });
        // return;
      }

      // Checking authentication status
      const isLoggedIn = await checkAuthUser(); 
      console.log("Is user logged in: ", isLoggedIn);

      if (isLoggedIn) {
        form.reset(); // Reset form on successful login
        navigate("/");
      } else {
        console.log("Authentication failed after login");
        toast({ title: "Login failed. Please try again." });
      }
    } catch (error) {
      console.error("Error during sign-in: ", error); // Log the error if one occurs
      toast({ title: "An error occurred. Please try again later." });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.png" alt="logo" className="w-[300px] h-[250px]" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>

        {/* Sign-in form */}
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log("Form submitted with data: ", data); // Log form submission
            handleSignin(data); // Trigger the sign-in handler
          })}
          className="flex flex-col gap-5 w-full mt-4">
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="shad-button_primary">
            {isPending || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          {/* Sign-up Link */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
