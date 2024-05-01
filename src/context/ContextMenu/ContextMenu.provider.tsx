import React, {FC, PropsWithChildren, useCallback, useEffect, useState} from 'react';
import {ContextMenu, IContextMenuItem} from "./ContextMenu.context";
import styles from './context-menu.module.scss';

const ContextMenuProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const [contextMenuItems, setContextMenuItems] = useState<IContextMenuItem[]>([])
  const [position, setPosition] = useState<number[]>();

  const setContextMenu = useCallback((items: IContextMenuItem[], position: number[]) => {
    setContextMenuItems(items);
    setPosition(position);
  }, [])

  const closeMenu = useCallback(() => {
    setPosition(undefined);
  }, [])

  useEffect(() => {
    document.body.addEventListener('click', closeMenu);

    return () => {
      document.body,removeEventListener('click', closeMenu);
    }
  }, [closeMenu]);

  return (
    <ContextMenu.Provider value={{ setContextMenu }}>
      {!!position && (
        <ul className={styles.context_menu}
            style={{left: position[0], top: position[1]}}
        >
          {
            contextMenuItems.map(item => (
              <li key={item.name}
                  className={styles.context_menu_item}
                  onClick={item.onClick}

              >
                {item.name}
              </li>
            ))
          }
        </ul>
      )}
      {children}
    </ContextMenu.Provider>
  );
};

export default ContextMenuProvider;