// material-ui
import { Box, Button, FormControl, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
  const { t, i18n } = useTranslation();
  return(
    <Box sx={{  ml: { xs: 0, md: 1 }, marginRight: "35px" }}>
      <FormControl sx={{ width: { xs: "100%", md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          placeholder={t("جستجو...")}
          startAdornment={
            <InputAdornment position="start" sx={{ mr: 1 }}>
              <Button sx={{ minWidth: "unset!important" }}>
                <SearchOutlined />
              </Button>
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            "aria-label": "weight"
          }}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
