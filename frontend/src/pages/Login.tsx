// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-6 py-8 space-y-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center px-6 py-4 bg-white shadow-md rounded-md">
        <h1 
          className="text-lg font-semibold text-gray-500 cursor-pointer hover:text-walnut" 
          onClick={() => navigate("/fellowregistration")}
        >
          Login
        </h1>
      </div>

      {/* Placeholder for Logo */}
      <div className="w-full max-w-4xl h-20 bg-gray-300 rounded-md shadow-lg"></div>

      {/* Login Form */}
      <Card className="w-full max-w-md px-6 py-6">
        <h2  className="text-xl font-bold text-center text-walnut mb-4">Login</h2>
        <Input
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button className="w-full">Login</Button>
        <p className="text-center text-sm text-gray-500 mt-2 cursor-pointer hover:underline">Forgot Password?</p>
        <Button onClick={() => navigate("/password-generation")} className="w-full mt-4 bg-earth hover:bg-walnut">
          Click to Register
        </Button>
      </Card>
    </div>
  );
};

export default Login;
