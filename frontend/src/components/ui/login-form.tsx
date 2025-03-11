"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [mobileNumber, setMobileNumber] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt with:", { mobileNumber, password })
  }

  return (
    <div className="w-full max-w-md px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-normal text-gray-600">Login</h1>
        <div className="size-8 rounded-full bg-amber-700 flex items-center justify-center">
          <span className="text-white text-xs">@</span>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="mobile-number" className="sr-only">
                Mobile Number
              </Label>
              <Input
                id="mobile-number"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-amber-800 hover:bg-amber-900 text-white">
            Login
          </Button>

          <div className="text-center">
            <button className="text-xs text-gray-600 hover:underline">Forgot Password?</button>
          </div>
        </CardContent>
      </Card>

      <Button variant="secondary" className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white">
        Click to Register
      </Button>
    </div>
  )
}
