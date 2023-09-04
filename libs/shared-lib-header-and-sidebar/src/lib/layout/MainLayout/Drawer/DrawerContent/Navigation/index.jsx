// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from '../../../../../menu-items';
import NavSuperGroup from './NavSuperGroup';
import NavMegaGroup from './NavMegaGroup';
import NavItem from './NavItem';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItem.items.map((item) => {
    switch (item.type) {
      case 'item':
        return <NavItem key={item.id} item={item} level={1} />;
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'SuperGroup':
        return <NavSuperGroup key={item.id} item={item} />;
      case 'MegaGroup':
        return <NavMegaGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
