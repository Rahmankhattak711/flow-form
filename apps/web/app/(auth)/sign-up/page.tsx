"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSignUp } from "~/hooks/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormInput, KeyRound, Mail, User, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  fullName: string;
  email: string;
  password: string;
}

function SignUp() {
  const { mutateAsync: signUpAsync } = useSignUp();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Props>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Props> = async (data) => {
    try {
      await signUpAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created!", {
        description: "Welcome to FlowForm. Let's build something amazing.",
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error("Registration failed", {
        description: err.message || "Something went wrong. Please check your information.",
      });
    }
  };

  return (
    <main className="min-h-screen w-screen bg-[#fafaf9] text-neutral-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Glow Effects */}
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-3xl text-neutral-900 mb-2">
            <FormInput className="w-8 h-8 text-orange-500 stroke-[2.5]" />
            <span>
              Flow<span className="chai-gradient-text">Form</span>
            </span>
          </Link>
          <p className="text-neutral-600">Join FlowForm to create interactive web forms</p>
        </div>

        {/* Card */}
        <div className="chai-card border border-orange-100 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 block" htmlFor="fullName-input">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                  <User className="w-5 h-5" />
                </span>
                <input
                  id="fullName-input"
                  type="text"
                  {...register("fullName", { required: "Full name is required" })}
                  placeholder="John Doe"
                  className="w-full bg-[#fafaf9]/80 border border-neutral-200 rounded-xl py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition duration-200"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 block" htmlFor="email-input">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email-input"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format"
                    }
                  })}
                  placeholder="name@example.com"
                  className="w-full bg-[#fafaf9]/80 border border-neutral-200 rounded-xl py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 block" htmlFor="password-input">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                  <KeyRound className="w-5 h-5" />
                </span>
                <input
                  id="password-input"
                  type="password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  placeholder="••••••••"
                  className="w-full bg-[#fafaf9]/80 border border-neutral-200 rounded-xl py-3 pl-11 pr-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition duration-200"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 font-bold text-white bg-gradient-to-r chai-gradient-bg hover:opacity-95 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          {/* Prompt to login */}
          <div className="mt-8 pt-6 border-t border-orange-100 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-orange-500 hover:text-indigo-300 transition">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default SignUp;
