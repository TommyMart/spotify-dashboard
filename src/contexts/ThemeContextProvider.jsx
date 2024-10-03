
import { createContext, useContext, useEffect, useState } from "react";




const ThemeContext = createContext("dark");

export function useThemeContext(){
    return useContext(ThemeContext);
}

function ThemeContextProvider({children}) {
    let [currentTheme, setCurrentTheme] = useState("dark");

    useEffect(() => {
        document.documentElement.style.setProperty("color-scheme", currentTheme);
    }, [currentTheme]);

    const toggleTheme = () => {
        if (currentTheme == "dark") {
            setCurrentTheme("light");
        } else {
            setCurrentTheme("dark")
        }
    }

    const setToSystem = () => {
        setCurrentTheme("light dark")
    }

    return (
        <ThemeContext.Provider value={[currentTheme, toggleTheme, setToSystem]}>
            {children}
        </ThemeContext.Provider>

    );
}


export default ThemeContextProvider;