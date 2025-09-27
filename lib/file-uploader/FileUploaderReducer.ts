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
  | { type: 'upload'; file: File }
  | { type: 'started'; file: File }
  | {
      type: 'finished-upload';
      file: File;
      status: FileUploadStatus;
      message?: string;
    }
  | { type: 'reload'; file: File }
  | { type: 'delete'; file: File }
  | {
      type: 'finished-delete';
      file: File;
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
      if (state.items.length >= state.maxFiles) return state;
      if (state.items.some((item) => item.name === action.file.name)) return state;
      return {
        ...state,
        items: [
          ...state.items,
          {
            name: action.file.name,
            file: action.file,
            action: 'upload',
            status: 'loading',
            pending: false,
            finished: false
          }
        ]
      };
    }
    case 'reload': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.file.name === action.file.name
            ? {
                name: action.file.name,
                file: action.file,
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
          item.name === action.file.name
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
          item.name === action.file.name
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
          item.name === action.file.name
            ? {
                status: 'loading',
                file: item.file,
                name: item.name,
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
            ? state.items.filter((item) => item.name !== action.file.name)
            : state.items.map((item) =>
                item.file.name === action.file.name
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
