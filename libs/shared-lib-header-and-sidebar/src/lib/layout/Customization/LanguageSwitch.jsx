import { useState } from 'react';
import * as React from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { IconWorld } from '@tabler/icons';

// third-party

// project imports
import Iran from '../../assets/images/countries/Iran.svg';
import SaudiArabia from '../../assets/images/countries/Saudi-Arabia.svg';
import UK from '../../assets/images/countries/United_Kingdom.svg';
import AnimateButton from '../../components/@extended/AnimateButton';
import { useTranslation } from 'react-i18next';
// concat 'px'
function valueText(value) {
  return `${value}px`;
}

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const LanguageSwitch = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const Menuopen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const customizationHandleClose = () => {
    setAnchorEl(null);
  };
  // drawer on/off
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const changeLanguageHandler = (value) => {
    const languageValue = value;
    i18n.changeLanguage(languageValue);
    localStorage.setItem('language', languageValue);
  };
  let initialFont;

  return (
    <React.Fragment>
      {i18n.language === 'fa' && (
        <AnimateButton type="scale">
          <IconButton
            color="inherit"
            size="large"
            onClick={handleClick}
            aria-controls={Menuopen ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Menuopen ? 'true' : undefined}
            style={{ width: '50px', height: '60px' }}
            disableRipple
          >
            <IconWorld />
          </IconButton>
        </AnimateButton>
      )}
      {i18n.language === 'en' && (
        <AnimateButton type="scale">
          <IconButton
            color="inherit"
            size="large"
            onClick={handleClick}
            style={{ width: '50px', height: '60px' }}
            disableRipple
          >
            <IconWorld />
          </IconButton>
        </AnimateButton>
      )}
      {i18n.language === 'ar' && (
        <AnimateButton type="scale">
          <IconButton
            color="inherit"
            size="large"
            onClick={handleClick}
            style={{ width: '50px', height: '60px' }}
            disableRipple
          >
            <IconWorld />
          </IconButton>
        </AnimateButton>
      )}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Menuopen}
        onClose={customizationHandleClose}
        onClick={customizationHandleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            textAlign: 'center',
            width: '150px',
            direction: 'rtl',
            mt: 0,
            '& .MuiAvatar-root': {
              width: 24,
              height: 24,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 19,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Button onClick={() => changeLanguageHandler('fa')}>
            <Avatar src={Iran} sx={{ width: 24, height: 24 }}></Avatar>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                marginRight: '15px',
                fontFamily: 'IRANSansWeb!important',
              }}
            >
              فارسی
            </Typography>
          </Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => changeLanguageHandler('ar')}>
            <Avatar src={SaudiArabia}></Avatar>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                marginRight: '15px',
                fontFamily: 'IRANSansWeb!important',
              }}
            >
              العربیه
            </Typography>
          </Button>
        </MenuItem>
        <MenuItem>
          <Button onClick={() => changeLanguageHandler('en')}>
            <Avatar src={UK}></Avatar>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                marginRight: '15px',
                fontFamily: 'IRANSansWeb!important',
              }}
            >
              English
            </Typography>
          </Button>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default LanguageSwitch;
