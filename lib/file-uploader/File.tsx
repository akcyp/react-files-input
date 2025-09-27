import cx from 'classnames';
import { ErrorIcon } from '../icons/ErrorIcon';
import { LoadingIcon } from '../icons/LoadingIcon';
import { SuccessIcon } from '../icons/SuccessIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { RetryIcon } from '../icons/RetryIcon';

export interface FileProps {
  file: File;
  name: string;
  action: 'upload' | 'delete';
  status: 'success' | 'error' | 'loading';
  message?: string;
  handleDelete: () => void;
  handleReload: () => void;
}

export const File = ({ name, action, status, message, handleDelete, handleReload }: FileProps) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center space-x-4">
        <div className="mr-1">
          {status === 'error' && <ErrorIcon />}
          {status === 'success' && <SuccessIcon />}
          {status === 'loading' && <LoadingIcon />}
        </div>
        <div className="flex flex-col">
          <span className="text-xs">{name}</span>
          <span
            className={cx('text-xs', {
              ['text-gray-500']: status === 'loading',
              ['text-red-500']: status === 'error',
              ['text-green-500']: status === 'success'
            })}
          >
            {message ?? (action === 'upload' ? 'Uploading...' : 'Deleting...')}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {status === 'error' && action === 'upload' && (
          <button
            onClick={handleReload}
            className="text-gray-500 hover:text-red-600bg-transparent border-none p-0 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 rounded transition text-gray-500 hover:text-blue-600"
          >
            <RetryIcon />
          </button>
        )}
        {status !== 'loading' && (
          <button
            onClick={handleDelete}
            className="bg-transparent border-none p-0 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 rounded transition text-gray-500 hover:text-red-600"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
};
