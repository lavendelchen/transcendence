export interface IUser {
  id?: number | undefined;
  name: string;
  twoFAenabled: boolean;
  image: string | undefined;
  token?: string | undefined;
  activeChats: string[];
}

export interface IChatUser {
  id: number;
  socket?: WebSocket;
}

export interface IMessage {
  user: IUser;
  input: string;
  room: string;
}

export enum EChannelType {
  PRIVATE,
  PUBLIC,
  DM
}

export interface IChannel {
  user: IUser;
  type: EChannelType;
  title: string;
}
