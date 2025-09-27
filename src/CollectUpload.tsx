import { useState } from 'react';
import { FileUploader } from '../lib';

export const CollectUpload = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onFileUpload = async (file: File) => {
    setFiles((files) => [...files, file]);
    return `Success: ${file.name} collected`;
  };

  const onFileDelete = async (file: File) => {
    setFiles(files.filter((item) => item.name !== file.name));
  };

  const onCollect = () => {
    alert(`Files collected (${files.length})`);
  };

  return (
    <div>
      <FileUploader
        maxFiles={3}
        fileTypes={['image/png', 'image/jpeg', 'image/svg', 'image/gif']}
        description="PNG, JPG, SVG or GIF"
        onFileUpload={onFileUpload}
        onFileDelete={onFileDelete}
      />
      <button
        onClick={onCollect}
        className="mt-3 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Collect
      </button>
    </div>
  );
};
