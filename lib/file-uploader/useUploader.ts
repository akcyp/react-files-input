import { useCallback, useEffect, useMemo, useState } from 'react';

interface FileUploaderItem {
  name: string;
  file: File;
  action: 'upload' | 'delete';
  status: 'loading' | 'success' | 'error';
  message?: string;
}

interface UseUploaderProps {
  maxFiles: number;
  onFileUpload: (file: File) => Promise<string>;
  onFileDelete: (file: File) => Promise<void>;
}

export const useUploader = ({ maxFiles, onFileDelete, onFileUpload }: UseUploaderProps) => {
  const [items, setItems] = useState<FileUploaderItem[]>([]);

  const setItem = useCallback((name: string, props: Partial<FileUploaderItem>) => {
    setItems((items) => items.map((item) => (item.name === name ? { ...item, ...props } : item)));
  }, []);

  const deleteItem = useCallback((name: string) => {
    setItems((items) => items.filter((item) => item.name !== name));
  }, []);

  const startUploading = useCallback(
    async (file: File) => {
      try {
        const message = await onFileUpload(file);
        setItem(file.name, {
          status: 'success',
          message
        });
      } catch (e) {
        setItem(file.name, {
          status: 'error',
          message: String(e)
        });
      }
    },
    [setItem, onFileUpload]
  );

  const deleteFile = useCallback(
    async (file: File) => {
      setItem(file.name, { action: 'delete', status: 'loading' });
      try {
        await onFileDelete(file);
        deleteItem(file.name);
      } catch (e) {
        setItem(file.name, {
          status: 'error',
          message: String(e)
        });
      }
    },
    [setItem, deleteItem, onFileDelete]
  );

  const uploadFile = useCallback(
    (files: File[]) => {
      const currentNames = items.map((item) => item.name);
      const newFiles = files.filter((file) => !currentNames.includes(file.name));
      if (items.length + newFiles.length > maxFiles) {
        setItems((items) => [...items]);
        return;
      }
      setItems((items) => [
        ...items,
        ...newFiles.map((file) => ({
          name: file.name,
          file,
          action: 'upload' as const,
          status: 'loading' as const
        }))
      ]);
      for (const file of newFiles) {
        startUploading(file);
      }
    },
    [items, maxFiles, startUploading]
  );

  const retryFile = useCallback(
    (file: File) => {
      setItem(file.name, {
        action: 'upload' as const,
        status: 'loading' as const
      });
      startUploading(file);
    },
    [setItem, startUploading]
  );

  useEffect(() => {
    setItems((items) => items.slice(0, maxFiles));
  }, [maxFiles]);

  useEffect(() => {
    setItems([]);
  }, []);

  const controller = useMemo(
    () => ({
      uploadFile,
      deleteFile,
      retryFile
    }),
    [uploadFile, deleteFile, retryFile]
  );

  return [items, controller] as const;
};
