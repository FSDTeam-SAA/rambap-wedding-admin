// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { PasswordInput } from "@/components/ui/password-input";
// import { Checkbox } from "@/components/ui/checkbox";
// import Link from "next/link";

// const formSchema = z.object({
//   email: z.string().min(1, "Email is required"),
//   password: z.string().min(1, "Password is required"),
//   rememberMe: z.boolean().optional(),
// });

// export default function LoginForm() {
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       rememberMe: false,
//     },
//   });

//   // ✅ Load saved credentials from localStorage
//   useEffect(() => {
//     const savedUser = localStorage.getItem("rememberedUser1");
//     if (savedUser) {
//       const parsed = JSON.parse(savedUser);
//       form.setValue("email", parsed.email || "");
//       form.setValue("password", parsed.password || "");
//       form.setValue("rememberMe", true);
//     }
//   }, [form]);

//   // ✅ Handle Login with NextAuth
//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       setIsLoading(true);

//       // Save or clear remembered user
//       if (values.rememberMe) {
//         localStorage.setItem(
//           "rememberedUser1",
//           JSON.stringify({
//             email: values.email,
//             password: values.password,
//           })
//         );
//       } else {
//         localStorage.removeItem("rememberedUser1");
//       }

//       // Call NextAuth signIn
//       const res = await signIn("credentials", {
//         email: values.email,
//         password: values.password,
//         redirect: false,
//       });

//       if (res?.error) {
//         toast.error(res.error);
//         return;
//       }

//       toast.success("Login successful!");
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Login failed:", error);
//       toast.error((error as Error).message || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div
//       className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage: "url('/bg.jpg')",
//       }}
//     >
//       <div className="absolute inset-0 bg-white/60"></div>

//       <div className="relative z-10 bg-white/85 backdrop-blur-sm rounded-2xl shadow-md p-8 sm:p-10 w-full max-w-[500px]">
//         <div className="mb-10 text-center">
//           <h3 className="text-[#00383B] text-[40px] font-semibold">Welcome</h3>
//           <p className="text-[#6C757D] text-[16px]">
//             Sign in to oversee accounts, listings, and updates
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[16px]">
//             {/* Email */}
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
//                     Email Address
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       {...field}
//                       placeholder="hello@example.com"
//                       className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Password */}
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
//                     Password
//                   </FormLabel>
//                   <FormControl>
//                     <PasswordInput
//                       {...field}
//                       placeholder="Password"
//                       className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Remember Me + Forgot Password */}
//             <div className="flex items-center justify-between">
//               <FormField
//                 control={form.control}
//                 name="rememberMe"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center space-x-2">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={(checked) =>
//                           field.onChange(checked === true)
//                         }
//                       />
//                     </FormControl>
//                     <FormLabel className="text-[#616161] font-medium text-[14px] cursor-pointer">
//                       Remember me
//                     </FormLabel>
//                   </FormItem>
//                 )}
//               />

//               <Link href="/forgot-password">
//                 <p className="text-[#00383B] font-normal text-[16px] underline cursor-pointer hover:text-[#0f5e5e] transition-colors">
//                   Forgot password?
//                 </p>
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="bg-[#00383B] hover:bg-[#00383B]/90 w-full text-white text-[16px] py-5 shadow-md hover:shadow-lg transition-shadow"
//             >
//               {isLoading ? "Signing In..." : "Sign In"}
//             </Button>
//           </form>

//           {/* Sign Up link */}
//           {/* <p className="text-center mt-16 text-[16px] text-[#616161]">
//             Don’t have an account?{" "}
//             <Link href="/sign-up">
//               <span className="text-[#00383B] font-bold cursor-pointer hover:underline">
//                 Sign Up
//               </span>
//             </Link>
//           </p> */}
//         </Form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser1");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      form.setValue("email", parsed.email || "");
      form.setValue("password", parsed.password || "");
      form.setValue("rememberMe", true);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (values.rememberMe) {
        localStorage.setItem(
          "rememberedUser1",
          JSON.stringify({
            email: values.email,
            password: values.password,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser1");
      }

      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
            Welcome
          </h3>
          <p className="text-gray-500 text-[16px]">
            Sign in to oversee accounts, listings, and updates
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-medium text-[16px] mb-2">
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Password"
                      className="border border-gray-300 py-4 focus-visible:ring-2 focus-visible:ring-[#f59e0a] focus-visible:border-[#f59e0a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="data-[state=checked]:bg-[#f59e0a] data-[state=checked]:border-[#f59e0a]"
                      />
                    </FormControl>
                    <FormLabel className="text-gray-600 font-medium text-[14px] cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Link href="/forgot-password">
                <p className="text-[#f59e0a] font-medium text-[16px] underline cursor-pointer hover:text-amber-600 transition-colors">
                  Forgot password?
                </p>
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#f59e0a] hover:bg-amber-600 w-full text-white text-[16px] py-5 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
