import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

// project import
import { activeItem } from '../../../../../store/reducers/menu';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.reducer.menu);
  const { drawerOpen, openItem } = menu;
  const [anchorEl, setAnchorEl] = React.useState(null);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    localStorage.setItem('activeMenu', id);
    dispatch(activeItem({ openItem: [id] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
  ) : (
    false
  );
  const { t, i18n } = useTranslation();
  const isSelected = openItem.findIndex((id) => id === item.id) > -1;
  const location = useLocation();
  const { pathname } = location;
  // active menu item on page load
  useEffect(() => {
    if (pathname == '/') {
      localStorage.setItem('activeMenu', 'dashboard');
      dispatch(activeItem({ openItem: ['dashboard'] }));
    } else {
      const currentIndex = pathname
        .split('/')
        .findIndex((id) => id === item.id);
      if (currentIndex > -1) {
        localStorage.setItem('activeMenu', item.id);
        dispatch(activeItem({ openItem: [item.id] }));
      }
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => itemHandler(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        display: '-webkit-box',
        pl: drawerOpen ? `5px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: `${theme.palette.background.default}`,
          },
          ...(i18n.language == 'en'
            ? {
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.background.default}`,
                  borderLeft: `2px solid ${theme.palette.primary.main}`,
                  color: iconSelectedColor,
                  '&:hover': {
                    color: iconSelectedColor,
                    bgcolor: `${theme.palette.background.default}`,
                  },
                },
              }
            : {
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.background.default}`,
                  borderRight: `2px solid ${theme.palette.primary.main}`,
                  color: iconSelectedColor,
                  '&:hover': {
                    color: iconSelectedColor,
                    bgcolor: `${theme.palette.background.default}`,
                  },
                },
              }),
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: `${theme.palette.background.default}`,
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: `${theme.palette.background.default}`,
            },
            bgcolor: `${theme.palette.background.default}`,
          },
        }),
      }}
    >
      {itemIcon && drawerOpen && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 30,
              height: 25,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: `${theme.palette.background.default}`,
              },
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor: `${theme.palette.background.default}`,
                '&:hover': {
                  bgcolor: `${theme.palette.background.default}`,
                },
              }),
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography
              variant="h6"
              sx={{ color: isSelected ? iconSelectedColor : textColor }}
            >
              {t(item.title)}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
      {!drawerOpen && (
        <Tooltip title={t(item.title)} placement="left">
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: isSelected ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 30,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: `${theme.palette.background.default}`,
                },
              }),
              ...(!drawerOpen &&
                isSelected && {
                  bgcolor: `${theme.palette.background.default}`,
                  '&:hover': {
                    bgcolor: `${theme.palette.background.default}`,
                  },
                }),
            }}
          >
            {itemIcon}
          </ListItemIcon>
        </Tooltip>
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
