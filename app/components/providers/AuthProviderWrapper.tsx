"use client";

import { ReactNode } from 'react';
import AuthProvider from '../../providers/AuthProvider';

/**
 * Wrapper client pour AuthProvider
 */
export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}