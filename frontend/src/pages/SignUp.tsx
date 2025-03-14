import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { validateMobileNumber, getMobileErrorMessage } from "@/utils/validation";
import { ENDPOINTS } from "@/utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePassword = (mobile: string, name: string) => {
    if (mobile.length >= 4 && name.length >= 4) {
      return mobile.slice(-4) + name.slice(-4).toUpperCase();
    } else if (mobile.length >= 4) {
      return mobile.slice(-4) + name.toUpperCase();
    } else if (name.length >= 4) {
      return mobile + name.slice(-4).toUpperCase();
    }
    return "";
  };
  
  // Update handleInputChange to validate mobile number
  const handleInputChange = (setter: Function, value: string, field: string) => {
    setter(value);
    
    if (field === 'mobileNumber') {
      // Use the shared validation utility
      setMobileError(getMobileErrorMessage(value));
      
      // Update password with what's available
      setPassword(generatePassword(value, givenName));
    } else if (field === 'givenName') {
      // For given name changes, use existing mobile + new value
      setPassword(generatePassword(mobileNumber, value));
    }
  };

  // Function to copy password to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update handleRegister to show success message
  const handleRegister = async () => {
    if (!mobileNumber || !surname || !givenName) {
      alert("All fields are required!");
      return;
    }
    
    if (!validateMobileNumber(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          surname,
          given_name: givenName,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Registration failed");

      setRegistrationSuccess(true);
      
      setTimeout(() => {
        navigate("/login", { state: { mobileNumber } });
      }, 2000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 space-y-20">      {/* White Card Container */}
      <div className="flex flex-col items-center bg-white px-6 py-8 w-96 shadow-lg rounded-lg">
        {/* ✅ Organization Logo */}
        <img
          src="/Images/organization_logo.png"
          alt="Yuva Chetana Logo"
          className="h-16 w-auto object-contain mb-4"
          loading="eager"
        />

        <h2 className="text-2xl font-bold text-center mb-4">Fellow SignUp</h2>

        {/* Success Message */}
        {registrationSuccess && (
          <div className="w-full mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
            Registration successful! Redirecting to login page...
          </div>
        )}

        {/* Input Fields */}
        <Input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => handleInputChange(setMobileNumber, e.target.value, 'mobileNumber')}
          className={`mb-1 border ${mobileError ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-earth/70`}
        />
        {mobileError && <p className="text-red-500 text-xs mb-2">{mobileError}</p>}
        <Input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => handleInputChange(setSurname, e.target.value, 'surname')}
          className="mb-3 border border-gray-300 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-earth/70"
        />
        <Input
          type="text"
          placeholder="Given Name"
          value={givenName}
          onChange={(e) => handleInputChange(setGivenName, e.target.value, 'givenName')}
          className="mb-3 border border-gray-300 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-earth/70"
        />

        {/* Auto-Generated Password */}
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Auto-Generated Password"
            value={password}
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

        <p className="text-sm text-earth font-medium text-center">Note: Save password & Login to complete Registration</p>

        {/* Register Button */}
        <Button
          className="w-full mt-4 bg-walnut text-white py-3 rounded-lg transition-all transform hover:bg-walnut/90 hover:scale-105 hover:cursor-pointer focus:ring-2 focus:ring-earth/70"
          onClick={handleRegister}
          disabled={loading || registrationSuccess}
        >
          {loading ? "Registering..." : "Save Password & Login"} 
        </Button>
      </div>
    </div>
  );
};

export default Register;