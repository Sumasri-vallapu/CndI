import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import { validateMobileNumber, getMobileErrorMessage } from "@/utils/validation";
import { ENDPOINTS } from "@/utils/api";   

const SignUp = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [password, setPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
  
  const handleInputChange = (setter: Function, value: string, field: string) => {
    setter(value);
    
    if (field === 'mobileNumber') {
      setMobileError(getMobileErrorMessage(value));
      setPassword(generatePassword(value, givenName));
    } else if (field === 'givenName') {
      setPassword(generatePassword(mobileNumber, value));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setTimeout(() => {}, 2000);
  };

  const handleRegister = async () => {
    if (!mobileNumber || !surname || !givenName) {
      alert("All fields are required!");
      return;
    }
    
    if (!validateMobileNumber(mobileNumber)) {
      setMobileError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.FELLOW_SIGNUP, {
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F1E3] px-6 space-y-8">      
      <div className="flex flex-col items-center bg-white px-6 py-8 w-full max-w-md shadow-lg rounded-lg">
        <img
          src="/Images/organization_logo.png"
          alt="Yuva Chetana Logo"
          className="h-16 w-auto object-contain mb-4"
          loading="eager"
        />

        <h2 className="text-2xl font-bold text-center mb-4">Fellow SignUp</h2>

        {registrationSuccess && (
          <div className="w-full mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
            Registration successful! Redirecting to login page...
          </div>
        )}

<div className="w-full space-y-4">
  <Input
    type="text"
    placeholder="Mobile Number"
    value={mobileNumber}
    onChange={(e) => handleInputChange(setMobileNumber, e.target.value, 'mobileNumber')}
    className={`signup-input ${mobileError ? 'border-red-500' : ''}`}
  />
  {mobileError && <p className="text-red-500 text-xs">{mobileError}</p>}

  <Input
    type="text"
    placeholder="Surname"
    value={surname}
    onChange={(e) => handleInputChange(setSurname, e.target.value, 'surname')}
    className="signup-input"
  />

  <Input
    type="text"
    placeholder="Given Name"
    value={givenName}
    onChange={(e) => handleInputChange(setGivenName, e.target.value, 'givenName')}
    className="signup-input"
  />

  {/* Password Field */}
  <div className="relative w-full">
    <Input
      type="text"
      placeholder="Auto-Generated Password"
      value={password}
      readOnly
      className="signup-input bg-gray-100"
    />
    <button
      type="button"
      onClick={copyToClipboard}
      className="absolute right-3 top-3 text-walnut hover:text-earth"
    >
      <Copy size={20} />
    </button>
  </div>
</div>

        <p className="text-sm text-earth font-medium text-center">Note: Save password & Login to complete Registration</p>

        <Button
          className="w-full mt-4 bg-walnut text-white py-3 rounded-lg transition-all transform hover:bg-walnut/90 hover:scale-105 hover:cursor-pointer focus:ring-2 focus:ring-earth/70"
          onClick={handleRegister}
          disabled={registrationSuccess}
        >
          Save Password & Login 
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
