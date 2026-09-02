import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const THEME_KEY = 'printworks-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEME_LIGHT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Leer preferencia guardada o usar prefers-color-scheme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && (savedTheme === THEME_LIGHT || savedTheme === THEME_DARK)) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? THEME_DARK : THEME_LIGHT);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', theme);
    
    // Guardar preferencia
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
