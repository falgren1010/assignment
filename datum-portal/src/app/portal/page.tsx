"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {

    const router = useRouter();

    function handleCreate() {
        router.push("/portal/upload");
    }

    return (
        <div className="flex flex-grow">
        {/* Sidebar */}
            <aside className="w-64 bg-base-200 p-6 border-r border-base-300">
                <nav className="flex flex-col gap-3">
                    <a onClick={handleCreate} className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Create Order
                    </a>
                    <a className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Active Orders
                    </a>
                    <a className="btn bg-base-100 border border-base-300 justify-start text-left">
                        Order History
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-10 flex flex-col">
                <h1 className="text-3xl font-bold mb-6">
                    Portal
                </h1>
                <div className="flex flex-col items-center justify-center flex-grow text-center">
                    <p className="text-base-content/70 mb-6 max-w-xl">
                        Welcome to your Portal. Select an option from the sidebar to get started or create a new Order by uploading a File.
                    </p>
                    <button className="btn btn-primary rounded-full px-10 py-3 text-lg" onClick={handleCreate}>
                        Create Order
                    </button>
                </div>
            </main>
        </div>
    );
}
