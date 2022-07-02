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
  console.log(isDarkTheme)
  console.log('========= isDarkTheme  ==========')

  return COLORS[isDarkTheme ? 'dark' : 'light'];
};
