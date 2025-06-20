'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation('common'); // Ensure 'common' namespace is loaded if using keys from it

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4 my-4 border border-gray-300 rounded-md bg-gray-50">
      <span className="mr-4 text-gray-700">{t('greeting')} Current language: <strong>{i18n.language}</strong></span>
      <button
        onClick={() => changeLanguage('en')}
        disabled={i18n.language === 'en'}
        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {t('changeToEnglish')}
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        disabled={i18n.language === 'fr'}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {t('changeToFrench')}
      </button>
    </div>
  );
};

export default LanguageSelector;
