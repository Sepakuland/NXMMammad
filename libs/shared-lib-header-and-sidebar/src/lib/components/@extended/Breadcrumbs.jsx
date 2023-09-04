import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { Grid, Typography } from '@mui/material';

// project imports
import MainCard from '../MainCard';
import { useTranslation } from 'react-i18next';

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({ navigation, title, ...others }) => {
    const location = useLocation();
    const [megaGroup , setMegaGroup] = useState();
    const [superGroup , setSuperGroup] = useState();
    const [main, setMain] = useState();
    const [item, setItem] = useState();

    const { t, i18n } = useTranslation();
    // set active item state
    let MenuLoc = location.pathname.split("/")
    const getCollapse = (menu) => {
        if (menu.children) {
            menu.children.filter((collapse) => {
                if (collapse.type && collapse.type === 'MegaGroup') {
                    getCollapse(collapse);
                }  else if (collapse.type && collapse.type === 'item') {
                    if (location.pathname === collapse.url) {
                        if(MenuLoc.length<5){
                            setMegaGroup(MenuLoc[1]);
                        }else{
                            setMegaGroup(MenuLoc[1]);
                            setSuperGroup(MenuLoc[2])
                        }

                        setMain(menu);
                        setItem(collapse);
                    }
                }
                return false;
            });
        }
    };

    useEffect(() => {
        navigation?.items?.map((menu) => {
            if (menu.type && menu.type === 'MegaGroup') {
                getCollapse(menu);
                menu?.children?.map((subMenu) => {
                    getCollapse(subMenu);
                    subMenu?.children?.map((groupMenu) => {
                        getCollapse(groupMenu);
                    })
                })
            }

            return false;
        });
    });

    // only used for component demo breadcrumbs
    if (location.pathname === '/breadcrumbs') {
        location.pathname = '/dashboard/analytics';
    }
    let megaContent;
    let superContent;
    let mainContent;
    let itemContent;
    let breadcrumbContent = <Typography />;
    let itemTitle = '';

    // collapse item
    if (main && (main.type === 'MegaGroup')) {
        mainContent = (
            <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {t(main.title)}
            </Typography>
        );
    }
    if (main && (main.type === 'group')) {
        megaContent = (
            <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {t(megaGroup)}
            </Typography>
        )
        superContent = (
            <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {t(superGroup)}
            </Typography>
        );
        mainContent = (
            <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {t(main.title)}
            </Typography>
        );
    }
    if (main && (main.type === 'SuperGroup')) {
        megaContent = (
            <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {t(megaGroup)}
            </Typography>
        )
        mainContent = (
            <Typography variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
                {t(main.title)}
            </Typography>
        );
    }

    // items
    if (item && item.type === 'item') {
        itemTitle = item.title;
        itemContent = (
            <Typography variant="subtitle1" color="textPrimary">
                {t(itemTitle)}
            </Typography>
        );

        // main
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <MainCard border={false} sx={{ mb: 3,mt:2, bgcolor: 'transparent' }} {...others} content={false}>
                    <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                        <Grid item>
                            <MuiBreadcrumbs aria-label="breadcrumb">
                                <Typography component={Link} to="/" color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                                    {t("خانه")}
                                </Typography>
                                {megaContent}
                                {MenuLoc.length>=5?superContent:null}
                                {mainContent}
                                {itemContent}
                            </MuiBreadcrumbs>
                        </Grid>
                    </Grid>
                </MainCard>
            );
        }
    }

    return location.pathname!=='/'? breadcrumbContent:<></>;
};

Breadcrumbs.propTypes = {
    navigation: PropTypes.object,
    title: PropTypes.bool
};

export default Breadcrumbs;
