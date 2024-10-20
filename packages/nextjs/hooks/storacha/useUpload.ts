import { useMutation } from "@tanstack/react-query";

function fileToFormData(data: string | File | Blob) {
  const formData = new FormData();

  if (!(data instanceof File)) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    data = new File([blob], "metadata.json");
  }

  formData.append("file", data);
  return formData;
}

function folderToFormData(files: string[] | File[] | Blob[]): FormData {
  const formData = new FormData();
  files.forEach(file => {
    formData.append(`files[]`, file); // Ensure files are appended as an array
  });
  return formData;
}

export const storachaUploadFile = async (file: string | File | Blob) => {
  const res = await fetch(`/api/storacha/fileUpload`, {
    method: "POST",
    body: fileToFormData(file),
  });
  return (await res.json()).cid;
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: storachaUploadFile,
  });
};

export const storachaUploadFolder = async (files: string[] | File[] | Blob[]) => {
  const res = await fetch(`/api/storacha/directoryUpload`, {
    method: "POST",
    body: folderToFormData(files),
  });
  return (await res.json()).cid;
};

export const useUploadFolder = () => {
  return useMutation({
    mutationFn: storachaUploadFolder,
  });
};
