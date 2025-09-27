export type FileUploadStatus = 'success' | 'error' | 'loading';
export type FileActionType = 'upload' | 'delete';

export interface FileUploaderItemState {
  name: string;
  file: File;
  action: FileActionType;
  status: FileUploadStatus;
  message?: string;
  pending: boolean;
  finished: boolean;
}

export interface FileUploaderState {
  maxFiles: number;
  items: FileUploaderItemState[];
}

export type FileUploaderAction =
  | { type: 'clear' }
  | { type: 'setMaxSize'; size: number }
  | { type: 'upload'; files: File[] }
  | { type: 'started'; name: string }
  | {
      type: 'finished-upload';
      name: string;
      status: FileUploadStatus;
      message?: string;
    }
  | { type: 'reload'; name: string }
  | { type: 'delete'; name: string }
  | {
      type: 'finished-delete';
      name: string;
      status: FileUploadStatus;
      message?: string;
    };

export const fileUploaderReducer = (
  state: FileUploaderState,
  action: FileUploaderAction
): FileUploaderState => {
  switch (action.type) {
    case 'clear': {
      return { ...state, items: [] };
    }
    case 'setMaxSize': {
      return {
        ...state,
        maxFiles: action.size,
        items: state.items.slice(0, action.size)
      };
    }
    case 'upload': {
      const currentNames = state.items.map((item) => item.name);
      const newFiles = action.files.filter((file) => !currentNames.includes(file.name));
      if (state.items.length + newFiles.length > state.maxFiles) return state;
      return {
        ...state,
        items: [
          ...state.items,
          ...newFiles.map(
            (file) =>
              ({
                name: file.name,
                file: file,
                action: 'upload',
                status: 'loading',
                pending: false,
                finished: false
              }) as const
          )
        ]
      };
    }
    case 'reload': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.name === action.name
            ? {
                ...item,
                action: 'upload',
                status: 'loading',
                pending: false,
                finished: false
              }
            : item
        )
      };
    }
    case 'started': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.name === action.name
            ? {
                ...item,
                pending: true
              }
            : item
        )
      };
    }
    case 'finished-upload': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.name === action.name
            ? {
                ...item,
                action: 'upload',
                status: action.status,
                message: action.message,
                finished: true,
                pending: false
              }
            : item
        )
      };
    }
    case 'delete': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.name === action.name
            ? {
                ...item,
                status: 'loading',
                action: 'delete',
                pending: false,
                finished: false
              }
            : item
        )
      };
    }
    case 'finished-delete': {
      return {
        ...state,
        items:
          action.status === 'success'
            ? state.items.filter((item) => item.name !== action.name)
            : state.items.map((item) =>
                item.name === action.name
                  ? {
                      ...item,
                      action: 'delete',
                      status: action.status,
                      message: action.message,
                      finished: true,
                      pending: false
                    }
                  : item
              )
      };
    }
    default:
      return state;
  }
};
