import { useState } from 'react';
import { File } from '../calls';
import { formatDate, formatFileSize, getFileTypeInfo } from '../utils';
import { ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface FilePreviewProps {
  file: File;
  bucketName: string;
  isOpen: boolean;
  onToggle: () => void;
}

const backendUrl = process.env.NEXT_PUBLIC_AKAVE_BACKEND_URL;

export const FilePreview = ({ file, bucketName, isOpen, onToggle }: FilePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const fileInfo = getFileTypeInfo(file.Name);

  return (
    <div className="border-b border-gray-200 last:border-none hover:bg-gray-50">
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 flex-1 cursor-pointer"
          onClick={onToggle}
        >
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
        
        <a
          href={`${backendUrl}/buckets/${bucketName}/files/${file.Name}/download`}
          download={file.Name}
          className="btn bg-black hover:bg-gray-800 text-white border-2 border-black btn-sm ml-4"
          title="Download file"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </a>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
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