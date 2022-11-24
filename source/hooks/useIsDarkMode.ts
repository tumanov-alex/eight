import { Appearance, useColorScheme } from 'react-native';

import { useIsDevtoolsOpened } from '../utils/useIsDevtoolsOpened';

export const useIsDarkMode = (): boolean => {
  const isDevtoolsOpened = useIsDevtoolsOpened();

  const colorScheme = useColorScheme();
  // todo: make it actually react to a device theme
  return colorScheme === (isDevtoolsOpened ? 'light' : 'dark');
  // return Appearance.getColorScheme() === 'dark';
};
