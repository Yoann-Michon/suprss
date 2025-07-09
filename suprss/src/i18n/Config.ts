// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Charge les traductions depuis des fichiers
  .use(LanguageDetector) // Détecte automatiquement la langue
  .use(initReactI18next) // Intègre avec React
  .init({
    fallbackLng: 'fr', // Langue par défaut
    lng: 'fr', // Langue initiale
    debug: import.meta.env.DEV, // Debug uniquement en développement
    
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    
    // Configuration du détecteur de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Configuration du backend HTTP
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Ressources inline (optionnel, pour un chargement plus rapide)
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          hello: "Hello {{name}}",
          buttons: {
            save: "Save",
            cancel: "Cancel",
            delete: "Delete"
          }
        }
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          hello: "Bonjour {{name}}",
          buttons: {
            save: "Sauvegarder",
            cancel: "Annuler",
            delete: "Supprimer"
          }
        }
      }
    }
  });

export default i18n;