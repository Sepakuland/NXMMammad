

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //
//   backend();
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import { loadMessages, locale } from 'devextreme/localization';
import * as faMessages from './locales/fa/fa.json';
import * as enMessages from 'devextreme/localization/messages/en.json';
import * as arMessages from 'devextreme/localization/messages/ar.json';
import { history } from './utils/history';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import Routes from './routes';
import './leaflet.draw.css'


const Main = () => {
 

  const { t, i18n } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    locale(
      i18n.language === 'fa' ? 'fa-IR' : i18n.language === 'ar' ? 'ar' : 'en'
    );
    loadMessages(
      i18n.language === 'fa'
        ? faMessages
        : i18n.language === 'ar'
        ? arMessages
        : enMessages
    );
  }, [i18n.language]);
  let body = document.querySelector('body');

  useEffect(() => {
    const mode = localStorage.getItem('mode');
    console.log('mode::::::::', mode);
    if (mode === 'light' || theme.palette.mode === 'light') {
      body.classList.remove('dark-theme');
    } else {
      body.classList.add('dark-theme');
    }
  }, []);

  history.navigate = useNavigate();
  history.location = useLocation();

  // let body = document.querySelector('body');
  // return(
  //    <div style={{ background: 'red' }}>shared-lib-header-and-sidebar</div>;
  // );
  return (
    <HelmetProvider>
      <ThemeCustomization>
        <ScrollTop>
          <Routes />
        </ScrollTop>
      </ThemeCustomization>
    </HelmetProvider>
  );
};

export default Main;
