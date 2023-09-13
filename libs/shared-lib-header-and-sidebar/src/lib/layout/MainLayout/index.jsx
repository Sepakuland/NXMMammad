import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, Grid, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from '../../menu-items';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import AuthFooter from '../../components/cards/AuthFooter';

// types
import { openDrawer } from '../../store/reducers/menu';
import { useTranslation } from 'react-i18next';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.reducer.menu);
  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);
  const { t, i18n } = useTranslation();
  return (
    <div contentEditable>
      {i18n.language === 'en' ? (
        <Box sx={{ display: 'fixed', width: '100%', direction: 'ltr' }}>
          <Header open={open} handleDrawerToggle={handleDrawerToggle} />
          <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}
          >
            <Toolbar />
            <Breadcrumbs
              navigation={navigation}
              title
              titleBottom
              card={false}
              divider={false}
            />
            <div className="pageContent">
              <Outlet />
            </div>
            <Grid item xs={12} sx={{ mt: 5 }}>
              <AuthFooter />
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'fixed', width: '100%', direction: 'rtl' }}>
          <Header open={open} handleDrawerToggle={handleDrawerToggle} />
          <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}
          >
            <Toolbar />
            <Breadcrumbs
              navigation={navigation}
              title
              titleBottom
              card={false}
              divider={false}
            />
            <div className="pageContent">
              <Outlet />
            </div>
            <Grid item xs={12} sx={{ mt: 5 }}>
              <AuthFooter />
            </Grid>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default MainLayout;
