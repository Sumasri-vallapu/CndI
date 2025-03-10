import { useState, useEffect } from "react";

export default function UsersList() {
  const [users, setUsers] = useState([]); // Holds API data
  const [loading, setLoading] = useState(true); // Tracks loading

  useEffect(() => {
    console.log("🔄 Fetching data...");

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        console.log("✅ Response received");
        return res.json();
      })
      .then((data) => {
        console.log("📥 Data received:", data);
        setUsers(data); // Store in state
        setLoading(false); // Hide loading message
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
      });
  }, []); // Runs once on mount

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-xl font-bold">User List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        users.map((user: { id: number; name: string }) => (
          <p key={user.id} className="text-lg">{user.name}</p>
        ))
      )}
    </div>
  );
}
