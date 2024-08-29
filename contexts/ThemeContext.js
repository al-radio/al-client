// ThemeProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import vaporTeal from "react95/dist/themes/vaporTeal";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const loadThemeFromStorage = () => {
    // make sure we're in browser environment
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? JSON.parse(savedTheme) : vaporTeal;
    }
    return vaporTeal; // Default theme
  };

  const [theme, setTheme] = useState(vaporTeal);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = loadThemeFromStorage();
    setTheme(savedTheme);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", JSON.stringify(newTheme));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
