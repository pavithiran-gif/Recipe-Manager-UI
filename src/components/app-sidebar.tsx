import  { useState, useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { UserCircle, Book, Heart, LogOut  } from "lucide-react"; // For icons (optional)
import axiosInstance from "../utils/axiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";


interface UserEmail {
  email_id: string;
}


export function AppSidebar() {
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store the user's email
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fetch user details (email) from localStorage or API if not found
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');

    if (storedEmail) {
      setUserEmail(storedEmail); // If email exists in localStorage, set it directly
    } else {
      // If email is not in localStorage, fetch it via the API
      const fetchUserDetails = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get("/data/useremail", {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // If you need to send cookies for auth
          });

          const userData: UserEmail = response.data;
          setUserEmail(userData.email_id); // Set the email to state

          // Store email in localStorage for future use
          localStorage.setItem('userEmail', userData.email_id);
          setLoading(false); // Stop loading
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.error(axios.isAxiosError(err) ? err.message : "An unknown error occurred");
            setLoading(false); // Stop loading
          }
        }
      };

      fetchUserDetails();
    }
  }, []); // Empty dependency array to run once on component mount

    // Function to extract the name from the email (before @)
    const getNameFromEmail = (email: string) => {
      const name = email.split('@')[0]; // Split the email by '@' and take the first part
      return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
    };

  const [open, setOpen] = useState<boolean>(false);
    // Logout functionality
    const handleLogout = async () => {
      try {
        // Call logout endpoint
        // await axiosInstance.post("/auth/logout", {}, {
        //   withCredentials: true
        // });
  
        // Clear local storage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('token'); // Assuming you store token in localStorage
  
        // Redirect to login page
        navigate('/');
      } catch (error) {
        console.error("Logout failed", error);
        // Optionally show error to user
      }
    };

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader>
        <h2 style={{ padding: "16px", fontSize: "18px", fontWeight: "bold" }}>
        Recipe Manager
        </h2>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
      <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            borderTop: "1px solid #e5e5e5",
          }}
        ></div>
          <SidebarMenu>
            {/* Recipes Menu */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate("/recipes")} // Replace href with navigate
                className="cursor-pointer" // Add cursor pointer for better UX
              
              >
                {/* <a href="/recipes"> */}
                  <Book style={{ marginRight: "8px" }} /> {/* Icon */}
                  Recipes
                {/* </a> */}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Favourite Menu */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => navigate("/favourite")} // Replace href with navigate
                className="cursor-pointer" // Add cursor pointer for better UX
              >
                {/* <a href="/favourite"> */}
                  <Heart style={{ marginRight: "8px" }} /> {/* Icon */}
                  Favourite
                {/* </a> */}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with Popover */}
      <SidebarFooter>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div 
              className="flex items-center p-4 border-t border-gray-200 cursor-pointer hover:bg-gray-100"
            >
              <UserCircle className="mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userEmail ? getNameFromEmail(userEmail) : "Loading..."}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userEmail || "Loading..."}
                </p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem 
                    onSelect={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
