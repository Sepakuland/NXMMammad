import { useTheme } from '@mui/material';
import React from 'react'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../../../store/reducers/darkToggle';

const ThemeToggle = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const darkmode  = useSelector((state) => state.reducer.darkToggle.darkmode);
    const [togglemode, setToggleMode] = React.useState(darkmode);
    const DarkModeToggle = () => {
        localStorage.setItem('mode', 'dark');
        dispatch(toggleDarkMode({ darkmode: "dark" }));
    };
    const LightModeToggle = () => {
        localStorage.setItem('mode', 'light');
        dispatch(toggleDarkMode({ darkmode: "light" }));
    };
    React.useEffect(() => {
        if (togglemode !== darkmode) setToggleMode(darkmode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [darkmode]);
    return (
        <Box
            sx={{
                display: 'flex',
                color: `${theme.palette.text.primary}`,
                borderRadius: 1,

            }}

        >
            <IconButton sx={{ ml: 1 }} onClick={togglemode === 'light' ? DarkModeToggle : LightModeToggle} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Box>
    )
}

export default ThemeToggle