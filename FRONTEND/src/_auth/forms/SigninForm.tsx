import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/custom/passwordinput";
import { useState } from "react";
import { useAuth } from "./../../api/authContext"; // Make sure this path is correct

const SignInForm = () => {
    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const { signIn } = useAuth(); // Use the signIn function from AuthContext
    const navigate = useNavigate(); // For redirecting after successful login
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Error state for showing feedback

    const onSubmit = async (values: z.infer<typeof SigninValidation>) => {
        setIsLoading(true);
        setError(null); // Reset error on submit

        try {
            const result = await signIn(values); // Perform sign-in
            console.log("Sign in response:", JSON.stringify(result, null, 2));
            navigate("/"); 
        } catch (err) {
            setError("Failed to sign in. Please check your credentials."); // Set error message
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <div className="sm:w-420 flex-center flex-col items-center text-center">
            <h1 className="font-bold text-3xl mt-5 pb-2">Log In to your account</h1>
            <p className="text-base text-stone-600 mb-3">Enter your login information</p>

            <div className="w-96 mx-10 flex-left flex-col items-left text-left mb-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-1xl bold">Username or Email</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input" {...field} placeholder="Enter your username or email" />
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
                                    <FormLabel className="text-1xl bold">Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Display error message if there's an error */}
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Logging In..." : "Log In"}
                        </Button>

                        {/* BRUH DOESN"T WORK YET
                        
                        <div className="flex items-center gap-4 mt-4">
                            <Separator className="flex-1" />
                            <span className="text-muted-foreground text-xs">OR PROCEED WITH</span>
                            <Separator className="flex-1" />
                        </div>

                        <Button type="button" variant="outline">Google</Button>
                        <Button type="button" variant="outline">Github</Button>
                        
                        */}

                        <p className="small-medium text-stone-600 mb-3">
                            By clicking continue, you agree to our 
                            <Link className="text-stone-800 underline hover:no-underline px-1" to="/terms-of-service">
                                Terms of Service
                            </Link> 
                            and 
                            <Link className="text-stone-800 underline hover:no-underline pl-1" to="/privacy-policy">
                                Privacy Policy
                            </Link>.
                        </p>
                        <p className="small-medium text-stone-600 mt-4">
                            Don't yet have an account?
                            <Link className="text-blue-600 hover:underline ml-1" to="/sign-up">
                                Sign Up to Syntony
                            </Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default SignInForm;
