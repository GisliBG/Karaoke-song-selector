export type TodoID = string;

export interface Todo {
  id: TodoID;
  completed: boolean;
  title: string;
}

interface Error {
  error: string;
  errorDetails?: {
    message: string;
    path: Array<string | number>;
    type: string;
  }[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  "karaoke:state": (isKaraokeLive: boolean) => void;
}

export interface ClientEvents {
  "karaoke:start": () => void;
  "karaoke:stop": () => void;
  // "todo:list": (callback: (res: Response<Todo[]>) => void) => void;

  // "todo:create": (
  //   payload: Omit<Todo, "id">,
  //   callback: (res: Response<TodoID>) => void
  // ) => void;

  // "todo:read": (id: TodoID, callback: (res: Response<Todo>) => void) => void;

  // "todo:update": (
  //   payload: Todo,
  //   callback: (res?: Response<void>) => void
  // ) => void;

  // "todo:delete": (id: TodoID, callback: (res?: Response<void>) => void) => void;
}
