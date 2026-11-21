import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { storage } from '../services/storage';

export type Gender = 'female' | 'male' | 'none';

export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  /** شمسی، مثل "1375/01/01" */
  birthDate: string | null;
  gender: Gender | null;
};

const EMPTY: Profile = {
  firstName: '',
  lastName: '',
  email: '',
  birthDate: null,
  gender: null,
};
const STORAGE_KEY = 'profile.data';

function readProfile(): Profile {
  try {
    const raw = storage.getString(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

type ProfileContextValue = {
  profile: Profile;
  /** نام کامل؛ اگر هنوز ثبت نشده «کاربر نوازون» */
  fullName: string;
  update: (patch: Partial<Profile>) => void;
  reset: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(readProfile);

  useEffect(() => {
    storage.set(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile(p => ({ ...p, ...patch }));
  }, []);

  const reset = useCallback(() => setProfile(EMPTY), []);

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || 'کاربر نوازون';

  const value = useMemo(
    () => ({ profile, fullName, update, reset }),
    [profile, fullName, update, reset],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
