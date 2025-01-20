import {
  ChangeEventHandler,
  DragEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { UploadIcon } from '../icons/UploadIcon';
import { File } from './File';
import { fileUploaderReducer } from './FileUploaderReducer';

export interface FileUploaderProps {
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
  onFileUpload: (file: File, abortCtrl: AbortController) => Promise<string>;
}

export const FileUploader = (props: FileUploaderProps) => {
  const { maxFiles, fileTypes, description, onFileUpload } = useMemo(
    () =>
      ({
        maxFiles: 1,
        fileTypes: [],
        description: '',
        ...props,
      } satisfies Required<FileUploaderProps>),
    [props]
  );

  const nativeFileInputRef = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(fileUploaderReducer, {
    maxFiles,
    items: [],
  });

  useEffect(() => {
    dispatch({ type: 'setMaxSize', size: maxFiles });
  }, [maxFiles]);

  const [cursor, setCursor] = useState<'default' | 'allowed' | 'disallowed'>(
    'default'
  );

  useEffect(() => {
    // To meet task requirements I'm going to perform simulated calls
    for (const item of state.items) {
      if (item.pending || item.finished) continue;
      dispatch({ type: 'started', filename: item.name });
      onFileUpload(item.file, item.abortController)
        .then((message) => {
          dispatch({
            type: 'finished',
            filename: item.name,
            status: 'success',
            message,
          });
        })
        .catch((message) => {
          dispatch({
            type: 'finished',
            filename: item.name,
            status: 'error',
            message,
          });
        });
    }
  }, [state.items, onFileUpload]);

  useEffect(() => {
    return () => {
      // Cancel all calls
      dispatch({ type: 'clear' });
    };
  }, []);

  useEffect(() => {
    // We will update native input "files" prop to support native form submitting process, when <FileUploader> is placed under <form> element
    if (!nativeFileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    for (const { file } of state.items) {
      dataTransfer.items.add(file);
    }
    nativeFileInputRef.current.files = dataTransfer.files;
  }, [state]);

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
      } else if (
        files.some(isFileAllowed) &&
        state.items.length < state.maxFiles
      ) {
        setCursor('allowed');
      } else {
        setCursor('disallowed');
      }
    },
    [state, isFileAllowed]
  );

  const onDragLeave: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    setCursor('default');
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    setCursor('default');
    const droppedFiles = Array.from(event.dataTransfer.files);
    for (const file of droppedFiles) {
      dispatch({ type: 'add', file });
    }
  }, []);

  const onFileInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files ?? []);
      for (const file of selectedFiles) {
        dispatch({ type: 'add', file });
      }
    },
    []
  );

  const handleFileDelete = useCallback((filename: string) => {
    dispatch({ type: 'remove', filename });
  }, []);

  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed border-gray-300 rounded-lg',
        {
          ['bg-gray-50']: cursor === 'default',
          ['bg-green-100']: cursor === 'allowed',
          ['bg-red-100']: cursor === 'disallowed',
          ['hover:bg-gray-100']: cursor === 'default',
        }
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <label
        htmlFor="dropzone-file"
        className={cx('w-full h-32', {
          ['cursor-pointer']: state.items.length < maxFiles,
          ['cursor-not-allowed']: state.items.length >= maxFiles,
        })}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon />
          <p className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <input
          accept={fileTypes.length === 0 ? undefined : fileTypes.join(',')}
          multiple={maxFiles > 1}
          disabled={state.items.length >= maxFiles}
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={onFileInputChange}
          ref={nativeFileInputRef}
        />
      </label>
      {!!state.items.length && (
        <div className="flex flex-col w-full p-4 space-y-1">
          {state.items.map((file) => (
            <File key={file.name} {...file} handleDelete={handleFileDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
