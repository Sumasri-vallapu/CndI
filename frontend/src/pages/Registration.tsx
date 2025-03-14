import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { validateMobileNumber } from "@/utils/validation";
import { ENDPOINTS } from "@/utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
      const payload = {
        mobile_number: mobileNumber,
        surname: surname,
        given_name: givenName,
        password: password,
      };

      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('API Response:', data);
      console.groupEnd();

      if (!response.ok) throw new Error(data.detail || "Registration failed");

      setRegistrationSuccess(true);
      
      setTimeout(() => {
        navigate("/login", { state: { mobileNumber } });
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        {mobileError && <p className="text-red-500 text-sm">{mobileError}</p>}

        <Input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />

        <Input
          type="text"
          placeholder="Given Name"
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button 
          className="w-full" 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        {registrationSuccess && (
          <p className="text-green-500 text-center">
            Registration successful! Redirecting to login...
          </p>
        )}
      </div>
    </div>
  );
};

export default Register; 