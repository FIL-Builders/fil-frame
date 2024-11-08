import { useState } from "react";
import { File } from "../calls";
import { formatDate, formatFileSize, getFileTypeInfo } from "../utils";
import { ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline";
import { DocEndpoint } from "./doc-component";

interface FilePreviewProps {
  file: File;
  bucketName: string;
  isOpen: boolean;
  onToggle: () => void;
}

const backendUrl = process.env.NEXT_PUBLIC_AKAVE_BACKEND_URL;

export const FilePreview = ({ file, bucketName, isOpen, onToggle }: FilePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const fileInfo = getFileTypeInfo(file.Name);
  const fileUrl = `${backendUrl}/buckets/${bucketName}/files/${file.Name}/download`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-none hover:bg-gray-50">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={onToggle}>
          <div className="w-6">
            {isOpen ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            )}
          </div>
          <span className="text-xl">{fileInfo.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{file.Name}</div>
            <div className="text-xs text-gray-500">
              {formatFileSize(file.Size)} • {formatDate(file.CreatedAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={handleShare}
              className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-black btn-sm"
              title="Copy download link"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
            {showCopied && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded shadow-lg">
                Copied!
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                </div>
              </div>
            )}
          </div>

          <a
            href={fileUrl}
            download={file.Name}
            className="btn bg-black hover:bg-gray-800 text-white border-2 border-black btn-sm"
            title="Download file"
            onClick={e => e.stopPropagation()}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-4">
          <DocEndpoint
            endpoint={`/buckets/[bucketName]/files/[fileName]/download`}
            method="GET"
            implementationFile="/api/akave/bucket/[bucketName]/files/[fileName]/route.ts"
            description="Download a file from the specified bucket"
            docsUrl="https://hackathon-docs.akave.ai/js-docker-example-code#id-4.-download-a-file"
          />
          <div className="grid gap-2 text-sm bg-white p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Created:</span>
              <span className="text-gray-700">{formatDate(file.CreatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Size:</span>
              <span className="text-gray-700">{formatFileSize(file.Size)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <span className="font-medium text-gray-900">CID:</span>
              <span className="ml-2 font-mono text-xs text-gray-600 break-all">{file.RootCID}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
