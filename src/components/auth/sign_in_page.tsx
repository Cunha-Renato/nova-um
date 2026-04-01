import { SignInButton } from "@clerk/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center w-full max-w-sm">
        <span className="text-gray-800 text-6xl font-bold tracking-tight">NovaUm</span>

        <h1 className="text-gray-800 text-3xl font-medium tracking-tight mb-2">Welcome</h1>
        <p className="text-gray-500 text-base mb-10">Sign in to get started with NovaUm</p>

        <SignInButton mode="modal">
          <button type="button" className="w-full py-3 bg-black text-white rounded-lg text-base font-medium hover:bg-gray-800 active:scale-95 transition-all">
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
}