export type UploadStatus = 'success' | 'error' | 'loading';

export interface FileUploaderItemState {
  name: string;
  file: File;
  status: UploadStatus;
  message?: string;
  pending: boolean;
  finished: boolean;
  abortController: AbortController;
}

export interface FileUploaderState {
  maxFiles: number;
  items: FileUploaderItemState[];
}

export type FileUploaderAction =
  | { type: 'clear' }
  | { type: 'setMaxSize'; size: number }
  | { type: 'add'; file: File }
  | { type: 'remove'; filename: string }
  | { type: 'started'; filename: string }
  | {
      type: 'finished';
      filename: string;
      status: UploadStatus;
      message?: string;
    };

export const fileUploaderReducer = (
  state: FileUploaderState,
  action: FileUploaderAction
): FileUploaderState => {
  switch (action.type) {
    case 'clear': {
      for (const item of state.items) {
        if (item.pending && !item.finished) {
          item.abortController.abort();
        }
      }
      return { ...state, items: [] };
    }
    case 'setMaxSize': {
      return {
        ...state,
        maxFiles: action.size,
        items: state.items.slice(0, action.size),
      };
    }
    case 'add': {
      if (state.items.length >= state.maxFiles) return state;
      if (state.items.some((item) => item.name === action.file.name))
        return state;
      return {
        ...state,
        items: [
          ...state.items,
          {
            name: action.file.name,
            file: action.file,
            status: 'loading',
            pending: false,
            finished: false,
            abortController: new AbortController(),
          },
        ],
      };
    }
    case 'remove': {
      const items: FileUploaderItemState[] = [];
      for (const item of state.items) {
        if (item.name === action.filename) {
          item.abortController.abort();
        } else {
          items.push(item);
        }
      }
      return {
        ...state,
        items,
      };
    }
    case 'started': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.name === action.filename
            ? {
                ...item,
                pending: true,
              }
            : item
        ),
      };
    }
    case 'finished': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.name === action.filename
            ? {
                ...item,
                status: action.status,
                message: action.message,
                finished: true,
                pending: false,
              }
            : item
        ),
      };
    }
    default:
      return state;
  }
};
