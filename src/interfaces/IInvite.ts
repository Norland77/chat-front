import {IRoom} from "./IRoom";

export interface IInvite {
  id: string
  roomId: string
  token: string
  accept: boolean
  room: IRoom
}