import { styled, ToggleButton } from "@mui/material";

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    '&.MuiToggleButton-root': {
        textTransform: 'none',
        boxShadow: 'none',
    },
    '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
        borderLeft: `1px solid ${theme.palette.primary.main}`,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 50,
        borderRight: 0,
    },
    '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
        borderTopRightRadius: 50,
        borderBottomRightRadius: 4,
        borderLeft: 0,
    },
    borderRadius: 0,
    width: 60,
    height: 30,
    padding: '0 10px',
    margin: '-1px',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: `1px solid ${theme.palette.primary.main}`,
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: `1px solid ${theme.palette.primary.dark}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            border: `1px solid ${theme.palette.primary.dark}`,
        },
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.text.disabled,
        border: `1px solid ${theme.palette.action.disabled}`,
    },
}));