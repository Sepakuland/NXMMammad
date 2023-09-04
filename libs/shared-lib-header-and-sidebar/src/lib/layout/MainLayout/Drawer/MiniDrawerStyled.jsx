// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

import i18n from '../../../components/i18n';

// project import
import { drawerWidth } from '../../../config';

const openedMixin = (theme) => ({
  width: drawerWidth,
  borderLeft: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: 'none',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 80,
  borderRight: 'none',
  boxShadow: theme.customShadows.z1,
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      borderLeft: `1px solid ${theme.palette.divider}`,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      boxShadow: 'none',
    },
  }),
  ...(open &&
    i18n.language === 'en' && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        borderLeft: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        boxShadow: 'none',
        left: 0,
      },
    }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: 80,
      borderRight: 'none',
      boxShadow: theme.customShadows.z1,
    },
  }),
  ...(!open &&
    i18n.language === 'en' && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: 80,
        borderRight: 'none',
        left: 0,
        boxShadow: theme.customShadows.z1,
      },
    }),
}));

export default MiniDrawerStyled;
