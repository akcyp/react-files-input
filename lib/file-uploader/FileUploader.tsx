import {
  ChangeEventHandler,
  DragEventHandler,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import cx from 'classnames';
import { File } from './File';
import { useUploader } from './useUploader';
import { UploadIcon } from '../icons/UploadIcon';

export interface FileUploaderProps {
  /**
   * Name of input[type=file]
   * Set when using inside form
   */
  inputName?: string;
  /**
   * Maximum number of files allowed in upload
   * @default 1
   */
  maxFiles?: number;
  /**
   * Allowed files mime types, by default all types are allowed. See https://mimetype.io/all-types
   * @default []
   */
  fileTypes?: string[];
  /**
   * Additional input description
   */
  description?: string;
  /**
   * Callback to handle single file upload
   */
  onFileUpload?: (file: File) => Promise<string>;
  /**
   * Callback to handle single file delete
   */
  onFileDelete?: (file: File) => Promise<void>;
}

export const FileUploader = (props: FileUploaderProps) => {
  const { maxFiles, fileTypes, description, onFileUpload, onFileDelete, inputName } = useMemo(
    () =>
      ({
        maxFiles: 1,
        fileTypes: [],
        description: '',
        onFileUpload: (file: File) => Promise.resolve(`Success: ${file.name} uploaded`),
        onFileDelete: () => Promise.resolve(),
        ...props
      }) satisfies FileUploaderProps,
    [props]
  );

  const dynamicDropZoneFileInputId = useId();
  const dropZoneFileInputId = useMemo(
    () => `rfs-input-${dynamicDropZoneFileInputId}`,
    [dynamicDropZoneFileInputId]
  );

  const nativeFileInputRef = useRef<HTMLInputElement>(null);
  const [cursor, setCursor] = useState<'default' | 'allowed' | 'disallowed'>('default');
  const [items, { uploadFile, deleteFile, retryFile }] = useUploader({
    onFileDelete,
    onFileUpload,
    maxFiles
  });

  useEffect(() => {
    // We will update native input "files" prop to support native form submitting process, when <FileUploader> is placed under <form> element
    if (!nativeFileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    for (const { file } of items) {
      dataTransfer.items.add(file);
    }
    nativeFileInputRef.current.value = '';
    nativeFileInputRef.current.files = dataTransfer.files.length ? dataTransfer.files : null;
  }, [items]);

  const isFileAllowed = useCallback(
    (file: File | DataTransferItem) => {
      if (fileTypes.length === 0) return true;
      return fileTypes.includes(file.type);
    },
    [fileTypes]
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.items);
      if (!files.length) {
        setCursor('default');
      } else if (files.some(isFileAllowed) && items.length < maxFiles) {
        setCursor('allowed');
      } else {
        setCursor('disallowed');
      }
    },
    [items, maxFiles, isFileAllowed]
  );

  const onDragLeave: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    setCursor('default');
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      setCursor('default');
      const droppedFiles = Array.from(event.dataTransfer.files);
      uploadFile(droppedFiles);
    },
    [uploadFile]
  );

  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      uploadFile(selectedFiles);
    },
    [uploadFile]
  );

  const handleFileDelete = useCallback(
    (file: File) => {
      deleteFile(file);
    },
    [deleteFile]
  );

  const handleFileReload = useCallback(
    (file: File) => {
      retryFile(file);
    },
    [retryFile]
  );

  return (
    <div
      className={cx(
        'react-files-input',
        ':uno: min-h-[175px] box-border flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg',
        {
          [':uno: bg-gray-50']: cursor === 'default',
          [':uno: bg-green-100']: cursor === 'allowed',
          [':uno: bg-red-100']: cursor === 'disallowed',
          [':uno: hover:bg-gray-100']: cursor === 'default'
        }
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <label
        htmlFor={dropZoneFileInputId}
        className={cx(':uno: w-full', {
          [':uno: cursor-pointer']: items.length < maxFiles,
          [':uno: cursor-not-allowed']: items.length >= maxFiles,
          [':uno: pointer-events-none']: items.length >= maxFiles
        })}
      >
        <div className=":uno: flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon />
          <p className=":uno: m-0 mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className=":uno: font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className=":uno: m-0 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </label>
      <input
        accept={fileTypes.length === 0 ? undefined : fileTypes.join(',')}
        multiple={maxFiles > 1}
        readOnly={items.length >= maxFiles}
        id={dropZoneFileInputId}
        type="file"
        name={inputName}
        className=":uno: hidden"
        onChange={onFileInputChange}
        ref={nativeFileInputRef}
      />
      {!!items.length && (
        <div className=":uno: box-border flex flex-col w-full p-4 space-y-1 overflow-auto">
          {items.map((file) => (
            <File
              key={file.name}
              action={file.action}
              name={file.name}
              status={file.status}
              message={file.message}
              handleDelete={() => handleFileDelete(file.file)}
              handleReload={() => handleFileReload(file.file)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
