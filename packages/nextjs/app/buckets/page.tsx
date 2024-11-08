"use client";

import { useState, useEffect } from "react";
import { PlusIcon, FolderIcon, CalendarIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { fetchBuckets, createBucket, uploadFile, type Bucket, type File } from "./calls";
import { formatDate } from "./utils";
import { FilePreview } from "./components/FilePreview";
import { DocEndpoint } from "./components/doc-component";

export default function BucketsPage() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [newBucketName, setNewBucketName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: {
      loading: boolean;
      completed: boolean;
      transactionHash: string;
    };
  }>({});
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);
  const [openFileIds, setOpenFileIds] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleFetchBuckets = async () => {
    setIsLoading(true);
    const fetchedBuckets = await fetchBuckets();
    setBuckets(fetchedBuckets);
    setIsLoading(false);
  };

  const handleCreateBucket = async () => {
    setIsLoading(true);
    const success = await createBucket(newBucketName);
    if (success) {
      setNewBucketName("");
      handleFetchBuckets();
    }
    setIsLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, bucketName: string) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files] as File[]);
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => (file as unknown as { name: string }).name !== fileName);
      // If all files are removed, also clear the upload progress
      if (updatedFiles.length === 0) {
        setUploadProgress({});
      }
      return updatedFiles;
    });
  };

  const handleUploadFiles = async (bucketName: string) => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);

    // Upload files sequentially
    for (const file of selectedFiles) {
      const fileName = (file as unknown as { name: string }).name;

      // Set loading state
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: { loading: true, completed: false, transactionHash: "" },
      }));

      const { success, transactionHash } = await uploadFile(bucketName, file);

      // Update completion state
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: { loading: false, completed: success, transactionHash },
      }));

      if (!success) {
        console.error(`Failed to upload ${fileName}`);
      }
    }

    // Clear selected files and refresh bucket contents after a short delay
    setTimeout(() => {
      setSelectedFiles([]);
      setUploadProgress({});
      handleFetchBuckets();
      setIsLoading(false);
    }, 1500); // Show completion state for 1.5 seconds
  };

  const handleFileToggle = (bucketName: string, file: File) => {
    const fileId = `${bucketName}-${file.RootCID}-${file.Name}`;
    setOpenFileIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleBucketToggle = (bucketName: string) => {
    setExpandedBucket(expandedBucket === bucketName ? null : bucketName);
  };

  useEffect(() => {
    handleFetchBuckets();
  }, []);

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="flex flex-col mb-8 border-b-2 border-black pb-4">
        <h1 className="text-4xl font-bold mb-4">Buckets</h1>
        <div className="flex justify-between items-center">
          <DocEndpoint
            method="GET"
            endpoint="/api/buckets"
            implementationFile="/app/api/buckets/route.ts"
            description="List all buckets"
            docsUrl="https://hackathon-docs.akave.ai/js-docker-example-code#id-2.-list-buckets"
          />
          <button
            onClick={() => setShowCreateForm(oldValue => !oldValue)}
            className="btn bg-black hover:bg-gray-800 text-white border-2 border-black"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Bucket
          </button>
        </div>
      </div>

      {/* Create Bucket Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">Create New Bucket</h2>
              <DocEndpoint
                method="POST"
                endpoint="/api/buckets/create"
                implementationFile="/app/api/buckets/create/route.ts"
                description="Creates a new bucket with specified parameters. Returns the bucket ID and access details."
                docsUrl="https://hackathon-docs.akave.ai/js-docker-example-code#id-1.-create-a-bucket"
              />
            </div>
            <button onClick={() => setShowCreateForm(false)} className="btn btn-ghost btn-sm hover:bg-gray-100">
              ×
            </button>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={newBucketName}
              onChange={e => setNewBucketName(e.target.value)}
              placeholder="Enter bucket name"
              className="input input-bordered border-2 bg-white border-black focus:border-black focus:border-2 text-black flex-1"
              disabled={isLoading}
            />
            <button
              onClick={() => {
                handleCreateBucket();
                setShowCreateForm(false);
              }}
              className="btn bg-black hover:bg-gray-800 text-white border-2 border-black disabled:bg-black disabled:text-white"
              disabled={isLoading}
            >
              {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !selectedFiles.length && (
        <div className="flex justify-center my-8">
          <span className="loading loading-spinner loading-lg text-black"></span>
        </div>
      )}

      {/* Buckets List */}
      <div className="space-y-4">
        {buckets.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-black">
            <p className="text-gray-600">No buckets found. Create one to get started!</p>
          </div>
        ) : (
          buckets.map((bucket, index) => (
            <div
              key={bucket.ID}
              className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Bucket Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleBucketToggle(bucket.Name)}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{bucket.Name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(bucket.CreatedAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{bucket.files.length} files</span>
                    </div>
                    {index === 0 && (
                      <DocEndpoint
                        endpoint={`/buckets/[bucketName]/files`}
                        method="GET"
                        implementationFile="/api/akave/bucket/[bucketName]/files/route.ts"
                        description="List files in bucket"
                        docsUrl="https://hackathon-docs.akave.ai/js-docker-example-code#id-1.-list-files-in-a-bucket"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {expandedBucket === bucket.Name ? (
                    <span className="text-sm text-gray-600">Click to collapse</span>
                  ) : (
                    <span className="text-sm text-gray-600">Click to expand</span>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedBucket === bucket.Name && (
                <div className="border-t-2 border-black">
                  {/* File Upload Section */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          multiple
                          onChange={e => handleFileSelect(e, bucket.Name)}
                          className="file-input w-full border-2 border-black bg-white transition-colors text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {selectedFiles.length > 0 && (
                        <button
                          onClick={() => handleUploadFiles(bucket.Name)}
                          className={`btn border-2 border-black min-w-[100px] ${
                            isLoading
                              ? "bg-black text-white hover:bg-black disabled:bg-black disabled:text-white"
                              : "bg-black hover:bg-gray-800 text-white"
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="loading loading-spinner loading-sm text-white"></span>
                          ) : (
                            "Upload All"
                          )}
                        </button>
                      )}
                    </div>
                    <div className="mb-2">
                      <DocEndpoint
                        endpoint={`/buckets/[bucketName]/files`}
                        method="POST"
                        implementationFile="/api/akave/bucket/[bucketName]/files/route.ts"
                        description="Upload files to bucket"
                        docsUrl="https://hackathon-docs.akave.ai/js-docker-example-code#id-3.-upload-a-file"
                      />
                    </div>
                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 bg-white rounded-lg border-2 border-black p-2">
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Selected Files ({selectedFiles.length}):
                        </div>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => {
                            const fileName = (file as unknown as { name: string }).name;
                            const fileStatus = uploadProgress[fileName];

                            return (
                              <div
                                key={`${fileName}-${index}`}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                              >
                                <span className="text-sm text-gray-600 truncate">{fileName}</span>
                                <div className="flex items-center space-x-2">
                                  {fileStatus?.loading && (
                                    <span className="loading loading-spinner loading-sm text-black"></span>
                                  )}
                                  {fileStatus?.completed && (
                                    <svg 
                                    className="w-5 h-5 text-green-500" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth="2" 
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  )}
                                  {!fileStatus?.loading && !fileStatus?.completed && (
                                    <button
                                      onClick={() => handleRemoveFile(fileName)}
                                      className="btn btn-ghost btn-xs text-gray-500 hover:text-red-500"
                                      aria-label={`Remove ${fileName}`}
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Files List */}
                  <div className="divide-y divide-gray-200">
                    {bucket.files.length > 0 ? (
                      bucket.files.map(file => {
                        const fileId = `${bucket.Name}-${file.RootCID}-${file.Name}`;
                        return (
                          <FilePreview
                            key={fileId}
                            file={file}
                            bucketName={bucket.Name}
                            isOpen={openFileIds.has(fileId)}
                            onToggle={() => handleFileToggle(bucket.Name, file)}
                          />
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-600">No files in this bucket</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
