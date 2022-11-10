import { useIsDarkMode } from './useIsDarkMode';

const COLORS = {
  dark: {
    main: 'white',
    secondary: 'black',
  },
  light: {
    main: 'black',
    secondary: 'white',
  },
};

export const useColors = () => {
  const isDarkTheme = useIsDarkMode();

  return COLORS[isDarkTheme ? 'light' : 'dark'];
};
