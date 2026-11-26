import { useCallback, useEffect, useState } from 'react';

export function useRouter() {
  const push = useCallback((path: string) => { if (typeof window !== 'undefined') window.location.assign(path); }, []);
  const replace = useCallback((path: string) => { if (typeof window !== 'undefined') window.location.replace(path); }, []);
  return { push, replace, back: () => window.history.back(), refresh: () => window.location.reload() };
}

export function useSearchParams(): URLSearchParams {
  const [params, setParams] = useState(() => new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search));
  useEffect(() => {
    const sync = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return params;
}

export function usePathname(): string {
  const [path, setPath] = useState(() => typeof window === 'undefined' ? '/' : window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return path;
}
