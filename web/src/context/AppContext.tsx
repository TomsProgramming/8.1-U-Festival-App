import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ACTS } from '../data/festival';
import { I18N, type Lang, type Translation } from '../data/i18n';

type Theme = 'dark' | 'light';

export interface Toast {
  title: string;
  sub: string;
  icon: 'heart' | 'heart-off';
}

interface AppContextValue {
  favorites: string[];
  toggleFav: (id: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toast: Toast | null;
  showToast: (t: Toast) => void;
  hideToast: () => void;
  actDetail: string | null;
  showActDetail: (id: string | null) => void;
  t: Translation;
}

const AppContext = createContext<AppContextValue | null>(null);

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() =>
    readJSON<string[]>('ufest_favs', ['armin', 'kensington'])
  );
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('ufest_lang') as Lang) || 'nl'
  );
  const [theme, setThemeState] = useState<Theme>(() =>
    (localStorage.getItem('ufest_theme') as Theme) || 'dark'
  );
  const [toast, setToast] = useState<Toast | null>(null);
  const [actDetail, setActDetail] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ufest_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ufest_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ufest_theme', theme);
  }, [theme]);

  const t = I18N[lang];

  const showToast = useCallback((toast: Toast) => {
    setToast(toast);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const toggleFav = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const isNew = !prev.includes(id);
        const next = isNew ? [...prev, id] : prev.filter((x) => x !== id);
        const act = ACTS.find((x) => x.id === id);
        if (act) {
          const tr = I18N[lang];
          showToast(
            isNew
              ? { title: tr.favAdded, sub: `${act.name} · ${tr.notifOn}`, icon: 'heart' }
              : {
                  title: lang === 'nl' ? 'Verwijderd uit favorieten' : 'Removed from favorites',
                  sub: act.name,
                  icon: 'heart-off',
                }
          );
        }
        return next;
      });
    },
    [lang, showToast]
  );

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setTheme = useCallback((th: Theme) => setThemeState(th), []);
  const showActDetail = useCallback((id: string | null) => setActDetail(id), []);

  const value = useMemo<AppContextValue>(
    () => ({
      favorites,
      toggleFav,
      lang,
      setLang,
      theme,
      setTheme,
      toast,
      showToast,
      hideToast,
      actDetail,
      showActDetail,
      t,
    }),
    [favorites, toggleFav, lang, setLang, theme, setTheme, toast, showToast, hideToast, actDetail, showActDetail, t]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
