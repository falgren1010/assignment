"use client";

import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    function handleLogout() {
        router.push("/login");
    }

    return (
        <header className="navbar bg-neutral px-6 text-base-100">
            <div className="flex-1">
                <a className="text-xl font-bold text-primary">SAEKI 3D</a>
            </div>

            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                src="https://api.dicebear.com/7.x/identicon/svg?seed=user"
                                alt="profile"
                            />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-40"
                    >
                        <li>
                            <a>Settings</a>
                        </li>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
