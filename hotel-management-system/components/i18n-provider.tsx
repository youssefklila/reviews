'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '../lib/i18n'; // Path to your i18n configuration

interface I18nProviderWrapperProps {
  children: ReactNode;
}

const I18nProviderWrapper: React.FC<I18nProviderWrapperProps> = ({ children }) => {
  // State to ensure i18n is initialized before rendering children,
  // especially if relying on async operations or specific conditions for initialization.
  // For this setup with HttpBackend and LanguageDetector, i18next handles async loading.
  // A simple check or relying on Suspense (if translations are not ready) is often enough.

  // You could add a loading state if you want to show a spinner while translations load for the first time.
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   i18nInstance.on('initialized', () => {
  //     setIsLoading(false);
  //   });
  //   // Handle case where it might already be initialized
  //   if (i18nInstance.isInitialized) {
  //     setIsLoading(false);
  //   }
  // }, []);

  // if (isLoading) {
  //   return <div>Loading translations...</div>; // Or a proper loader/spinner
  // }

  return (
    // Using Suspense for components that might need translations before they are loaded.
    // react-i18next's useTranslation hook handles Suspense automatically.
    <React.Suspense fallback={<div>Loading...</div>}>
      <I18nextProvider i18n={i18nInstance}>
        {children}
      </I18nextProvider>
    </React.Suspense>
  );
};

export default I18nProviderWrapper;
