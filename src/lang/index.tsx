import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import { en } from './en';
import { fr } from "./fr";
import * as Localization from 'expo-localization';

type LanguageContextType = {
  hello: string;
};
export const LanguageContext = React.createContext<LanguageContextType>({} as LanguageContextType);

const languageObj = {
  en: en,
  fr: fr,
};

export const LanguageContextProvider: React.FC = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const currentLanguage = Localization.locale.substr(0, 2)
    let appLang = null
    Object.keys(languageObj).forEach(e => {
      if (e === currentLanguage) {
        appLang = e;
      }
    })


    setSelectedLanguage(appLang ? appLang : 'en');
  }, []);

  const value = {
    ...languageObj[selectedLanguage as 'en' | "fr"],
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);

let curentLang = ""

const locale = Localization.locale.substr(0, 2)
let appLang = null
Object.keys(languageObj).forEach(e => {
  if (e === locale) {
    appLang = e;
  }
})

curentLang = locale || "en";

export const strings = languageObj[curentLang];