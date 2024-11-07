// Format date to be more readable
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format file size to human readable format
export const formatFileSize = (bytes: string) => {
  const size = parseInt(bytes);
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

// Get file type icon and preview info
export const getFileTypeInfo = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const fileTypes = {
    // Images
    'png': { type: 'image', icon: '🖼️', previewable: true },
    'jpg': { type: 'image', icon: '🖼️', previewable: true },
    'jpeg': { type: 'image', icon: '🖼️', previewable: true },
    'gif': { type: 'image', icon: '🖼️', previewable: true },
    // Documents
    'pdf': { type: 'document', icon: '📄', previewable: true },
    'txt': { type: 'text', icon: '📝', previewable: true },
    'doc': { type: 'document', icon: '📄', previewable: false },
    'docx': { type: 'document', icon: '📄', previewable: false },
    // Other
    'bin': { type: 'binary', icon: '📦', previewable: false },
  };

  return fileTypes[extension as keyof typeof fileTypes] || { type: 'unknown', icon: '📎', previewable: false };
}; 