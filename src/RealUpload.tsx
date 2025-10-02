import { useEffect, useRef } from 'react';
import { FileUploader } from '../lib';

export const RealUpload = () => {
  const abortCtrl = useRef<AbortController>(null);

  useEffect(() => {
    abortCtrl.current = new AbortController();
    return () => {
      abortCtrl.current?.abort();
    };
  }, []);

  const onFileUpload = async (file: File) => {
    const data = new FormData();
    data.append('file', file);

    const response = await fetch('/example', {
      method: 'POST',
      body: data,
      signal: abortCtrl.current?.signal
    });

    if (response.status >= 200 && response.status < 300) {
      return `Success: ${file.name} saved`;
    }
    throw `Error: ${file.name} not saved`;
  };

  const onFileDelete = async (file: File) => {
    await fetch(`/example/${file.name}`, {
      method: 'DELETE',
      signal: abortCtrl.current?.signal
    });
  };

  return (
    <FileUploader
      maxFiles={3}
      fileTypes={['image/png', 'image/jpeg', 'image/svg', 'image/gif']}
      description="PNG, JPG, SVG or GIF"
      onFileUpload={onFileUpload}
      onFileDelete={onFileDelete}
    />
  );
};
