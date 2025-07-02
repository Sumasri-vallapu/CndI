import { useState } from "react";
import { ENDPOINTS } from "@/utils/api";

export default function Home() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const response = await fetch(ENDPOINTS.SUBMIT_NAME, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });      

      const data = await response.json();
      if (response.ok) {
        setStatus("✅ Name saved successfully");
        setName("");
      } else {
        setStatus("❌ " + data.error);
      }
    } catch (err: any) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Your Name</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-sm">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}
