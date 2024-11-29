// components/Layout.tsx
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar"; // Ensure correct import path
import { AppSidebar } from "./app-sidebar"; // Ensure correct import path
import { SidebarTrigger } from "@/components/ui/sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", height: "80vh" }}>
        {/* Sidebar (Constant) */}
        <AppSidebar />

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: "20px" }}>
          <SidebarTrigger />
          {children} {/* Dynamically change content here */}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
