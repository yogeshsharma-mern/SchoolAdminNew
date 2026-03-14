import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/ui/Sidebar.jsx';
import Header from "../components/ui/Header.jsx";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]">

            {/* Sidebar */}
         
<Sidebar/>
            {/* Main Section */}
            <div className="flex flex-col flex-1">

                {/* Header */}
              <Header/>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-2 md:p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}