"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

export function ChangePassword() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const decodedEmail = decodeURIComponent(email || "");
    const router = useRouter();

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setNewPassword(value)
        setError("")
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setConfirmPassword(value)
        setError("")
    }

    const validatePassword = () => {
        if (!newPassword) {
            setError("New password is required")
            return false
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters")
            return false
        }

        if (!confirmPassword) {
            setError("Please confirm your password")
            return false
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return false
        }

        return true
    }

    const { mutate, isPending } = useMutation({
        mutationKey: ["change-password"],
        mutationFn: async ({ email, newPassword }: { email: string; newPassword: string }) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            })
            return res.json()
        },
        onSuccess: (data) => {
            if (!data?.success) {
                toast.error(data?.message || "Something went wrong.")
                return
            }
            toast.success(data?.message || "Password changed successfully!")
            router.push("/login")
        },
        onError: (error) => {
            console.error("Change password error:", error)
            toast.error("Something went wrong. Please try again.")
        },
    })

    const handleChangePassword = async () => {
        if (!validatePassword()) return
        mutate({ email: decodedEmail, newPassword });
    }

    const isFormValid = newPassword && confirmPassword && newPassword === confirmPassword

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.jpg')" }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

            {/* Card */}
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-[500px] border border-amber-100">
                <div className="mb-10 text-center">
                    <h3 className="text-[#f59e0a] text-[40px] font-semibold">Change Password</h3>
                    <p className="text-gray-500 font-normal text-[16px]">
                        Enter your new password to update your account
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

               {/* New Password Input */}
<div className="mb-6 relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">Create New Password</label>
    <Input
        type={showNewPassword ? "text" : "password"}
        value={newPassword}
        onChange={handleNewPasswordChange}
        placeholder="••••••••"
        className="pr-10 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#f59e0a] focus-visible:border-[#f59e0a]"
        disabled={isPending}
    />
    <button
        type="button"
        onClick={() => setShowNewPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
    >
        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
</div>

{/* Confirm Password Input */}
<div className="mb-8 relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
    <Input
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="••••••••"
        className="pr-10 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#f59e0a] focus-visible:border-[#f59e0a]"
        disabled={isPending}
    />
    <button
        type="button"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
    >
        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
</div>


                    {/* Change Password Button */}
                    <Button
                        onClick={handleChangePassword}
                        disabled={!isFormValid || isPending}
                        className="w-full bg-[#f59e0a] hover:bg-amber-600 text-white font-semibold py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Change Password
                    </Button>
                </div>
            </div>
        </div>
    )
}
