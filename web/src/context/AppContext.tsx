import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  BUNDLED_ACTS,
  BUNDLED_SCHEDULE,
  BUNDLED_STAGES,
  type Act,
  type DayId,
  type ScheduleItem,
  type Stage,
} from '../data/festival';
import { I18N, type Lang, type Translation } from '../data/i18n';
import { api } from '../data/api';
import { favSync, queueSize } from '../data/favSync';
import { enablePush, disablePush, isPushActive, notificationPermission, pushSupported } from '../pwa/push';

type Theme = 'dark' | 'light';

export interface Toast {
  title: string;
  sub: string;
  icon: 'heart' | 'heart-off';
}

interface AppContextValue {
  stages: Stage[];
  acts: Act[];
  schedule: Record<DayId, ScheduleItem[]>;
  dataReady: boolean;

  deviceId: string;
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

  pushSupported: boolean;
  pushPermission: NotificationPermission;
  pushOn: boolean;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => Promise<void>;

  online: boolean;
  pendingSync: number;

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

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem('ufest_device_id');
  if (!id) {
    id = (crypto.randomUUID?.() ?? `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    localStorage.setItem('ufest_device_id', id);
  }
  return id;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [stages, setStages] = useState<Stage[]>(BUNDLED_STAGES);
  const [acts, setActs] = useState<Act[]>(BUNDLED_ACTS);
  const [schedule, setSchedule] = useState<Record<DayId, ScheduleItem[]>>(BUNDLED_SCHEDULE);
  const [dataReady, setDataReady] = useState(false);

  const deviceIdRef = useRef<string>(getOrCreateDeviceId());
  const deviceId = deviceIdRef.current;

  const [favorites, setFavorites] = useState<string[]>(() =>
    readJSON<string[]>('ufest_favs', [])
  );
  const favsRef = useRef<string[]>(favorites);
  useEffect(() => { favsRef.current = favorites; }, [favorites]);

  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('ufest_lang') as Lang) || 'nl'
  );
  const [theme, setThemeState] = useState<Theme>(() =>
    (localStorage.getItem('ufest_theme') as Theme) || 'dark'
  );
  const [toast, setToast] = useState<Toast | null>(null);
  const [actDetail, setActDetail] = useState<string | null>(null);

  const [supported] = useState<boolean>(pushSupported);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(notificationPermission);
  const [pushOn, setPushOn] = useState(false);

  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [pendingSync, setPendingSync] = useState<number>(queueSize);

  const refreshPendingSync = useCallback(() => setPendingSync(queueSize()), []);

  // Bootstrap data, device, push-status, en flush eventuele oude queue.
  useEffect(() => {
    let alive = true;
    (async () => {
      const [s, a, sc] = await Promise.all([api.stages(), api.acts(), api.schedule()]);
      if (!alive) return;
      if (s?.length) setStages(s);
      if (a?.length) setActs(a);
      if (sc) setSchedule(sc);
      setDataReady(true);
    })();
    api.registerDevice(deviceId, lang, theme);

    (async () => {
      // Server kent misschien favs die hier nog niet zijn, of andersom.
      // Eerst de lokale state als bron-van-waarheid sturen via flush, dan
      // server-stand mergen.
      await favSync.flush(deviceId, favsRef.current);
      refreshPendingSync();
      const serverFavs = await api.getFavorites(deviceId);
      if (alive && serverFavs) {
        setFavorites((local) => {
          const merged = Array.from(new Set([...local, ...serverFavs]));
          return merged;
        });
      }
    })();
    (async () => {
      const on = await isPushActive();
      if (alive) setPushOn(on);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Online/offline + flush bij terugkeer.
  useEffect(() => {
    const goOnline = async () => {
      setOnline(true);
      await favSync.flush(deviceId, favsRef.current);
      refreshPendingSync();
    };
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [deviceId, refreshPendingSync]);

  useEffect(() => { localStorage.setItem('ufest_favs', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => {
    localStorage.setItem('ufest_lang', lang);
    api.registerDevice(deviceId, lang, theme);
  }, [lang, theme, deviceId]);
  useEffect(() => { localStorage.setItem('ufest_theme', theme); }, [theme]);

  const t = I18N[lang];

  const showToast = useCallback((toast: Toast) => {
    setToast(toast);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const enableNotifications = useCallback(async () => {
    const res = await enablePush(deviceId);
    setPushPermission(notificationPermission());
    setPushOn(res.ok);
    return res.ok;
  }, [deviceId]);

  const disableNotifications = useCallback(async () => {
    await disablePush();
    setPushOn(false);
  }, []);

  // Eerste keer dat de gebruiker een favoriet aanzet vragen we proactief
  // om push-permissie — past bij de toast 'Meldingen aan: 15/10/5 min'.
  const askedPushRef = useRef<boolean>(localStorage.getItem('ufest_push_asked') === '1');
  const maybeAskForPush = useCallback(async () => {
    if (askedPushRef.current) return;
    if (!supported) return;
    if (notificationPermission() !== 'default') return;
    askedPushRef.current = true;
    localStorage.setItem('ufest_push_asked', '1');
    await enableNotifications();
  }, [supported, enableNotifications]);

  const toggleFav = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const isNew = !prev.includes(id);
        const next = isNew ? [...prev, id] : prev.filter((x) => x !== id);
        if (isNew) {
          favSync.add(deviceId, id).then(refreshPendingSync);
          // Bij allereerste 'add' (lokaal of remote): vraag om push-permissie.
          void maybeAskForPush();
        } else {
          favSync.remove(deviceId, id).then(refreshPendingSync);
        }
        const act = acts.find((x) => x.id === id);
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
    [lang, showToast, acts, deviceId, refreshPendingSync, maybeAskForPush]
  );

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setTheme = useCallback((th: Theme) => setThemeState(th), []);
  const showActDetail = useCallback((id: string | null) => setActDetail(id), []);

  const value = useMemo<AppContextValue>(
    () => ({
      stages, acts, schedule, dataReady,
      deviceId,
      favorites, toggleFav,
      lang, setLang,
      theme, setTheme,
      toast, showToast, hideToast,
      actDetail, showActDetail,
      pushSupported: supported,
      pushPermission, pushOn,
      enableNotifications, disableNotifications,
      online, pendingSync,
      t,
    }),
    [stages, acts, schedule, dataReady, deviceId, favorites, toggleFav, lang, setLang,
     theme, setTheme, toast, showToast, hideToast, actDetail, showActDetail,
     supported, pushPermission, pushOn, enableNotifications, disableNotifications,
     online, pendingSync, t]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
