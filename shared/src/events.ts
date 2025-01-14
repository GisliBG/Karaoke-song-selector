import { Song } from "./karaoke";

export type TodoID = string;

export interface SessionUser {
  id: string;
  songId?: number;
  userName?: string;
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
  "karaoke:state": (state: {
    isKaraokeLive: boolean;
    playlist: Song[];
    queue: Song[];
  }) => void;
  "session:data": (sessionUser: SessionUser) => void;
}

export interface ClientEvents {
  "karaoke:start": () => void;
  "karaoke:stop": () => void;
  "song:chosen": (song: Song) => void;
  "song:cancel": (song: Song) => void;
  "song:next": () => void;
  "session:username": (userName: string) => void;
}
