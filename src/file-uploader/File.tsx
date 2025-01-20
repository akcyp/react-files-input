import cx from 'classnames';
import { ErrorIcon } from '../icons/ErrorIcon';
import { LoadingIcon } from '../icons/LoadingIcon';
import { SuccessIcon } from '../icons/SuccessIcon';
import { TrashIcon } from '../icons/TrashIcon';

export interface FileProps {
  name: string;
  status: 'success' | 'error' | 'loading';
  message?: string;
  handleDelete?: (name: string) => void;
}

export const File = ({ name, status, message, handleDelete }: FileProps) => {
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
              ['text-green-500']: status === 'success',
            })}
          >
            {message ?? 'Uploading...'}
          </span>
        </div>
      </div>
      <button
        onClick={() => handleDelete?.(name)}
        className="text-gray-500 hover:text-red-600"
      >
        <TrashIcon />
      </button>
    </div>
  );
};
