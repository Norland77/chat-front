import React, {useEffect, useState} from 'react';
import styles from './toggle-color-mode.module.scss'
const ToggleColorMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    console.log(isDarkMode)
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div onClick={toggleTheme} className={isDarkMode ? styles.dark + ' ' +styles.theme_toggle : styles.theme_toggle}>
      <span className={isDarkMode ? styles.toggle_circle + ' ' + styles.animate : styles.toggle_circle}></span>
    </div>
  );
};

export default ToggleColorMode;