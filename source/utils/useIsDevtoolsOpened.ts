// @ts-nocheck

export const useIsDevtoolsOpened = () => {
  let flag = false;
  let devtools = function () {};
  devtools.toString = function () {
    if (!this.opened) {
      flag = true;
    }
    this.opened = true;
  };

  console.log('%c', devtools);

  return flag;
};
