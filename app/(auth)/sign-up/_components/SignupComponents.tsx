"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link";


const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
});

export default function SignUp() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);

            toast.success("Login successful!", {
                description: `Welcome back, ${values.email}!`,
            });
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/bg.jpg')",
            }}
        >

            <div className="absolute inset-0 bg-white/60"></div>

            <div className="relative z-10 bg-white/85 backdrop-blur-sm rounded-2xl shadow-md p-8 sm:p-10 w-full max-w-[600px]">
                <div className="mb-10">
                    <h3 className="text-[#00383B] text-center text-[40px] ">Create Your Account</h3>
                    <p className="text-[#6C757D] font-normal text-[16px] text-center">Step into the future of growth — join Next Level today</p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-[16px]"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
                                            First Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                                placeholder="First Name"
                                                className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                                placeholder="Last Name"
                                                className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                            placeholder="hello@example.com"
                                            className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
                                        Create Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            placeholder="Password"
                                            className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="mb-10">
                                    <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            placeholder="Confirm Password"
                                            className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="bg-[#00383B]  hover:bg-[#00383B]/90 w-full text-white text-[16px] py-5 shadow-md hover:shadow-lg transition-shadow"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Sign Up link */}
                    <p className="text-center mt-16 text-[16px] text-[#616161]">
                        Already have an account? {" "}
                       <Link href="/login">
                        <span className="text-[#00383B] font-bold cursor-pointer hover:underline">
                            Log In
                        </span>
                       </Link>
                    </p>
                </Form>
            </div>
        </div>
    );
}
