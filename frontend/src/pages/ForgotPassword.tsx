import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { validateMobileNumber, getMobileErrorMessage } from "@/utils/validation";
import { ENDPOINTS } from "@/utils/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (value: string) => {
    setMobileNumber(value);
    setMobileError(getMobileErrorMessage(value));
  };

  // Function to copy password to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(retrievedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle password retrieval
  const handleRetrievePassword = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_number: mobileNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Mobile number not found");

      setRetrievedPassword(data.password);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 space-y-20">
      {/* White Card Container */}
      <div className="flex flex-col items-center bg-white px-6 py-8 w-96 shadow-lg rounded-lg">
        {/* ✅ Organization Logo */}
        <img
          src="/Images/organization_logo.png"
          alt="Yuva Chetana Logo"
          className="h-16 w-auto object-contain mb-4"
          loading="eager"
        />

        <h2 className="text-2xl font-bold text-center mb-4">Recover Password</h2>

        {/* Input Fields */}
        <Input
          type="text"
          placeholder="Enter Registered Mobile Number"
          value={mobileNumber}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`mb-3 border ${mobileError ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-earth/70`}
        />
        {mobileError && <p className="text-red-500 text-xs mb-2">{mobileError}</p>}

        {/* Retrieved Password Display */}
        {retrievedPassword && (
          <div className="relative w-full">
            <Input
              type="text"
              value={retrievedPassword}
              readOnly
              className="mb-3 border border-gray-300 w-full px-4 py-2 rounded-lg bg-gray-100 focus:ring-2 focus:ring-earth/70"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute right-3 top-3 text-walnut hover:text-earth"
            >
              <Copy size={20} />
            </button>

            {/* Password copied notification */}
            {copied && (
              <div className="absolute -top-10 right-0 bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm shadow-md transition-opacity">
                Password copied to clipboard!
              </div>
            )}
          </div>
        )}

        {/* Retrieve Password Button */}
        <Button
          className="w-full mt-4 bg-walnut text-white py-3 rounded-lg transition-all transform hover:bg-walnut/90 hover:scale-105 focus:ring-2 focus:ring-earth/70"
          onClick={handleRetrievePassword}
          disabled={loading}
        >
          {loading ? "Recovering..." : "Recover Password"}
        </Button>

        {/* Back to Login Link */}
        <p className="text-sm text-earth font-medium text-center mt-4">
          Remembered?{" "}
          <span
            className="text-walnut cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
