import { Link } from "react-router-dom";

// material-ui
import { Grid, Stack, Typography } from "@mui/material";

// project import
import PasswordSettings from "./auth-forms/PasswordSettings";
import AuthWrapper from "./AuthWrapper";
import "../../style.css";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../../layout/Customization/LanguageSwitch";

// ================================|| LOGIN ||================================ //

const AuthSetting = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      {i18n.language === "en" ? (
        <AuthWrapper>
          <Grid
            container
            spacing={3}
            style={{ direction: "ltr", fontFamily: "IRANSansWeb" }}
          >
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                sx={{ mb: { xs: -0.5, sm: 0.5 } }}
              >
                <Typography variant="h3">{t("تنظیمات رمز عبور")}</Typography>
              <LanguageSwitch/>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PasswordSettings />
            </Grid>
          </Grid>
        </AuthWrapper>
      ) : (
        <AuthWrapper>
          <Grid
            container
            spacing={3}
            style={{ direction: "rtl", fontFamily: "IRANSansWeb" }}
          >
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: { xs: -0.5, sm: 0.5 } }}
              >
                <Typography variant="h3">{t("تنظیمات رمز عبور")}</Typography>
              <LanguageSwitch/>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PasswordSettings />
            </Grid>
          </Grid>
        </AuthWrapper>
      )}
    </>
  );
};

export default AuthSetting;
