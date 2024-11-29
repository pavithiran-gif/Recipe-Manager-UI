// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number; // Expiration time (Unix timestamp)
}

const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [expiryTime, setExpiryTime] = useState<string | null>(null); // Store expiration time

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        // Decode the token to get the expiration time
        const decodedToken = jwtDecode<TokenPayload>(token);

        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

        if (decodedToken && decodedToken.exp > currentTime) {
          setIsAuthenticated(true);

          // Convert expiration time to IST
          const expirationDate = new Date(decodedToken.exp * 1000); // Convert to milliseconds
          const istTime = expirationDate.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          setExpiryTime(istTime); // Store the IST formatted time

          // Set a timeout to auto-logout when the token expires
          const timeUntilExpiration = decodedToken.exp * 1000 - Date.now(); // Milliseconds until expiration
          const expirationTimer = setTimeout(() => {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            navigate("/"); // Redirect to login page
          }, timeUntilExpiration);

          // Cleanup the timer on unmount
          return () => clearTimeout(expirationTimer);
        } else {
          // Token has expired
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/"); // Redirect to login page
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/"); // Redirect to login page
      }
    } else {
      // No token, not authenticated
      setIsAuthenticated(false);
      navigate("/"); // Redirect to login page
    }
  }, [navigate]);

  return { isAuthenticated, expiryTime }; // Return both authentication state and expiration time
};

export default useAuth;
