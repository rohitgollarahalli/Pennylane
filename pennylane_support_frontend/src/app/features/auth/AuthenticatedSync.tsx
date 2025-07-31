'use client';

import { useSyncUser } from './useSyncUser';

export const AuthenticatedSync = () => {
  useSyncUser();
  return null;
};
