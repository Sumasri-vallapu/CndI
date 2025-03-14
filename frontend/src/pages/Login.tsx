import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ImageCarousel from "@/components/ui/ImageCarousel"; // ✅ Importing ImageCarousel
import { validateMobileNumber, getMobileErrorMessage } from "@/utils/validation";
import { ENDPOINTS } from "@/utils/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get mobile number from navigation state if available
  useEffect(() => {
    if (location.state?.mobileNumber) {
      setMobileNumber(location.state.mobileNumber);
    }
  }, [location.state]);

  // Handle mobile number input change
  const handleMobileChange = (value: string) => {
    setMobileNumber(value);
    setMobileError(getMobileErrorMessage(value));
  };

  const handleLogin = async () => {
    setError(""); // Reset error

    // Validate mobile number
    if (!mobileNumber || !password) {
      setError("Mobile Number and Password are required!");
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9");
      return;
    }

    try {
      // Use the ENDPOINTS constant for the API URL
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      localStorage.setItem("token", data.token); // Store JWT token (for future use)

      // ✅ Redirect based on user_status from backend
      const userStatus = data.user_status;

      if (userStatus === "PENDING_REGISTRATION") {
        navigate("/register", { state: { mobileNumber } });
      } else if (userStatus === "PENDING_TASK_SUBMISSION") {
        navigate("/tasks", { state: { mobileNumber } });
      } else if (userStatus === "AWAITING_SELECTION") {
        alert("Your tasks are under review. Please wait for approval.");
      } else if (userStatus === "PENDING_DATA_CONSENT") {
        navigate("/data-consent", { state: { mobileNumber } });
      } else if (userStatus === "PENDING_CHILD_PROTECTION_CONSENT") {
        navigate("/child-protection-consent", { state: { mobileNumber } });
      } else if (userStatus === "ACCESS_GRANTED") {
        navigate("/final-ui", { state: { mobileNumber } });
      } else {
        setError("Unexpected status. Please try again.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-8">
      <div className="flex flex-col items-center bg-white px-6 py-8 w-96 shadow-lg rounded-lg">
        {/* ✅ Organization Logo */}
        <img
          src="/Images/organization_logo.png"
          alt="Yuva Chetana Logo"
          className="h-16 w-auto object-contain mb-4"
          loading="eager"
        />

        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
        <div className="w-full space-y-3">
          <div>
            <Input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => handleMobileChange(e.target.value)}
              className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-walnut"
            />
            {mobileError && (
              <p className="text-red-500 text-sm mt-1">{mobileError}</p>
            )}
          </div>

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-walnut"
          />

          {/* Connect handleLogin to the button */}
          <Button 
            onClick={handleLogin}
            className="w-full bg-walnut text-white py-3 rounded-lg transition-all transform hover:bg-walnut/90 hover:scale-105 cursor-pointer focus:ring-2 focus:ring-earth/70 focus:outline-none"
          >
            Login
          </Button>
        </div>

        {/* Forgot Password */}
        <p className="text-center text-sm mt-2">
          <Link 
            to="/forgot-password" 
            className="text-walnut hover:underline hover:text-walnut/80 transition-all"
          >
            Forgot Password?
          </Link>
        </p>

        {/* Click to Register Button */}
        <Button
          className="w-full mt-4 bg-earth text-white rounded-lg cursor-pointer hover:underline hover:text-walnut/80 transition-all"
          onClick={() => navigate("/signup")}
        >
          Click to Register
        </Button>

      </div>

      {/* ✅ Aligned Image Gallery & Login Box */}
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="w-full overflow-hidden rounded-lg shadow-md bg-white p-6">
          <h3 className="text-2xl font-bold text-walnut text-center mb-4">Our Gallery</h3>
          <ImageCarousel className="max-w-full" />
        </div>
      </div>

    </div>
  );
};

export default Login;
