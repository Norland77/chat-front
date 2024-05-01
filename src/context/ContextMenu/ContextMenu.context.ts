import { createContext } from "react";

export interface IContextMenuItem {
  name: string;
  onClick: () => void;
}

interface ContextMenuModel {
  setContextMenu: (items: IContextMenuItem[], position: number[]) => void;
}

export const ContextMenu = createContext<ContextMenuModel>({
  setContextMenu: () => {},
});