import { styled, TextField } from "@mui/material";

export const StyledTextFieldButton = styled(TextField)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    border: `1px solid ${theme.palette.primary.dark}`,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      border: `1px solid ${theme.palette.primary.dark}`,
    },
  },
}));
