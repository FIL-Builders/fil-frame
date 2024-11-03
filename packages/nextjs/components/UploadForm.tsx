// components/UploadForm.tsx
import { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setIsUploading(true);
    setError("");
    setResponse("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/lighthouse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(JSON.stringify(data.result, null, 2));
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-primary">Get Deal Params</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-secondary mb-1">
            Select File
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-primary text-base-100 rounded-md hover:bg-primary-focus transition ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {response && (
        <div className="mt-6 bg-success bg-opacity-20 border border-success text-success p-4 rounded-md">
          <h3 className="text-lg font-medium">Upload Successful</h3>
          <pre className="mt-2 text-sm whitespace-pre-wrap break-words">{response}</pre>
        </div>
      )}
      {error && (
        <div className="mt-6 bg-error bg-opacity-20 border border-error text-error p-4 rounded-md">
          <h3 className="text-lg font-medium">Error</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
