export interface IPersonalRoomCreate {
  name: string;
  firstUserId: string;
  secondUserId: string;
  isPrivate: boolean;
  isPersonal: boolean;
  token: string
}