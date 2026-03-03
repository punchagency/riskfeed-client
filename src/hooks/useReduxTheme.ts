import { useEffect } from 'react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme, toggleTheme } from '../store/slices/themeSlice';

export const useReduxTheme = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const changeTheme = useCallback((newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return { theme, changeTheme, toggleTheme: toggle };
};
