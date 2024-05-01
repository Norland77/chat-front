import React, { useEffect, useState } from 'react';
import styles from './toggle-color-mode.module.scss';

const ToggleColorMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const localMode = localStorage.getItem('isDark');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localMode === null) {
      localStorage.setItem('isDark', String(prefersDarkMode));
      return prefersDarkMode;
    } else {
      return localMode === 'true';
    }
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDark', String(!isDarkMode));
  };

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div onClick={toggleTheme} className={isDarkMode ? styles.dark + ' ' + styles.theme_toggle : styles.theme_toggle}>
      <span className={isDarkMode ? styles.toggle_circle + ' ' + styles.animate : styles.toggle_circle}></span>
    </div>
  );
};

export default ToggleColorMode;