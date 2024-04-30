import {IFiles} from "./IFiles";
import {IUser} from "./IUser";

export interface IMessage {
  id: string;
  text: string;
  username: string;
  userId: string;
  roomId: string;
  files: IFiles[];
  User: IUser;
  createdAt: Date;
  updatedAt: Date;
}