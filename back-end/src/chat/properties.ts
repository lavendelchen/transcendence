export interface IUser {
  id?: number | undefined;
  name: string | undefined;
  intraname: string | undefined;
  twoFAenabled: boolean;
  image: string | undefined;
  token?: string | undefined;
  activeChats: string[];
}

export interface IMessage {
  user: IUser;
  input: string;
  room: string;
}

export enum EChannelType {
  PRIVATE,
  PUBLIC
}

export interface IChannel {
  user: IUser;
  type: EChannelType;
  title: string;
}


export const roomConnections: Record<string, WebSocket[]> = {};