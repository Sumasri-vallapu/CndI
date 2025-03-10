import { useState } from "react";

const UploadPhoto = () => {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!username || !photo) {
      setMessage("Please provide a username and a photo.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("photo", photo);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Uploaded successfully! Photo URL: ${data.photo_url}`);
      } else {
        setMessage(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed! Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Upload Your Photo</h1>

      <input
        type="text"
        placeholder="Enter username"
        className="border p-2 rounded mb-4 w-full max-w-sm"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input type="file" className="mb-4" onChange={handleFileChange} />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default UploadPhoto;
