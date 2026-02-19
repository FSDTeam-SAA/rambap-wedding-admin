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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
});

export default function ForgetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),

    onSuccess: (data, email) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(data?.message || "Email sent successfully!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },

    onError: (error) => {
      toast.error("Something went wrong. Please try again.");
      console.error("Forgot password error:", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values.email);
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/bg.jpg')",
      }}
    >
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-[500px] border border-amber-100">
        <div className="mb-10 text-center">
          <h3 className="text-[#f59e0a] text-[40px] font-semibold">
            Forgot Password
          </h3>
          <p className="text-gray-500 font-normal text-[16px]">
            Enter your email to recover your password
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-[16px]"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-medium text-[16px] mb-2">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="hello@example.com"
                      className="border border-gray-300 py-4 focus-visible:ring-2 focus-visible:ring-[#f59e0a] focus-visible:border-[#f59e0a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#f59e0a] hover:bg-amber-600 w-full text-white text-[16px] py-5 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="animate-spin h-4 w-4" />}
              Send OTP
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
