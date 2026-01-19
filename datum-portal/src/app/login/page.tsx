"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {

    const router = useRouter();

    function handleLogin() {
        router.push("/portal");
    }

    return (
        <section className="flex flex-col items-center justify-center px-6 py-20 flex-grow">
            <div className="w-full max-w-md bg-base-200 p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">
                    Login
                </h2>

                <form className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                    />
                    <button className="btn btn-primary w-full mt-2" onClick={handleLogin}>Sign In</button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-base-content/70">
                        Don’t have an account yet?
                    </p>
                    <a className="link link-primary text-sm">
                        Create Account
                    </a>
                </div>
            </div>
        </section>
    );
}
