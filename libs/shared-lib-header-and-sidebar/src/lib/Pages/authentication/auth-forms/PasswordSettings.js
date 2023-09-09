import React, { useEffect } from "react";

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { useFormik } from "formik";

// project import
import AnimateButton from "../../../components/@extended/AnimateButton";

// assets
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axios from "axios";

// ============================|| FIREBASE - LOGIN ||============================ //

const PasswordSettings = () => {
  const authUser = useSelector((x) => x.auth.user);
  const authError = useSelector((x) => x.auth.error);
  const appConfig = window.globalConfig;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    // redirect to home if already logged in

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formik = useFormik({
    initialValues: {
      passLeastChar: 0,
      passMaxChar: 0,
      specialChar: "",
      useDigit: false,
      useChar: false,
      useSpecialChar: false,
    },
    validationSchema: Yup.object().shape({
        passLeastChar: Yup.string().required(
        t("وارد کردن حداقل کاراکتر الزامیست!")
      ),
      passMaxChar: Yup.string().required(
        t("وارد کردن حداکثر کاراکتر الزامیست!")
      ),
    }),
    onSubmit: (values) => {
      console.log(values);
      axios.post(`${appConfig.BaseURL}/api/authenticate/PasswordSettings/` , values).then((res) => res.data).catch(error => error)
    },
  });
  return (
    <>
      {i18n.language === "en" ? (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} style={{ direction: "ltr" }}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="PassLeastChar">
                  {t("حداقل کاراکتر")}
                </InputLabel>
                <OutlinedInput
                  id="passLeastChar"
                  type="number"
                  value={formik.values.passLeastChar}
                  name="passLeastChar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("0")}
                  fullWidth
                  error={
                    formik.touched.passLeastChar && formik.errors.passLeastChar
                  }
                />
                {formik.touched.passLeastChar &&
                  formik.errors.passLeastChar && (
                    <FormHelperText error>
                      {formik.errors.passLeastChar}
                    </FormHelperText>
                  )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="passMaxChar">
                  {t("حداکثر کاراکتر")}
                </InputLabel>
                <OutlinedInput
                  id="passMaxChar"
                  type="number"
                  value={formik.values.passMaxChar}
                  name="passMaxChar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("8")}
                  fullWidth
                  error={
                    formik.touched.passMaxChar && formik.errors.passMaxChar
                  }
                />
                {formik.touched.passMaxChar && formik.errors.passMaxChar && (
                  <FormHelperText error>
                    {formik.errors.passMaxChar}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="specialChar">
                  {t("کاراکتر خاص")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id="specialChar"
                  value={formik.values.specialChar}
                  name="specialChar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("@")}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.useChar}
                      id="useChar"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="useChar"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">{t("استفاده از حروف")}</Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.useDigit}
                      id="useDigit"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="useDigit"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">{t("استفاده از عدد")}</Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.useSpecialChar}
                      id="useSpecialChar"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="useSpecialChar"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">{t("استفاده از حروف خاص")}</Typography>
                  }
                />
              </Stack>
            </Grid>
            {formik.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{formik.errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  type="button"
                  onClick={formik.handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  {t("ثبت")}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} style={{ direction: "rtl" }}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="passLeastChar">
                  {t("حداقل کاراکتر")}
                </InputLabel>
                <OutlinedInput
                  id="passLeastChar"
                  type="number"
                  value={formik.values.passLeastChar}
                  name="passLeastChar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("0")}
                  fullWidth
                  error={
                    formik.touched.passLeastChar && formik.errors.passLeastChar
                  }
                />
                {formik.touched.passLeastChar &&
                  formik.errors.passLeastChar && (
                    <FormHelperText error>
                      {formik.errors.passLeastChar}
                    </FormHelperText>
                  )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="passMaxChar">
                  {t("حداکثر کاراکتر")}
                </InputLabel>
                <OutlinedInput
                  id="passMaxChar"
                  type="number"
                  value={formik.values.passMaxChar}
                  name="passMaxChar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("8")}
                  fullWidth
                  error={
                    formik.touched.passMaxChar && formik.errors.passMaxChar
                  }
                />
                {formik.touched.passMaxChar && formik.errors.passMaxChar && (
                  <FormHelperText error>
                    {formik.errors.passMaxChar}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="specialChar">
                  {t("کاراکتر خاص")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id="specialChar"
                  value={formik.values.specialChar}
                  name="specialChar"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("@")}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.useChar}
                      id="useChar"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="useChar"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">{t("استفاده از حروف")}</Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.useDigit}
                      id="useDigit"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="useDigit"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">{t("استفاده از عدد")}</Typography>
                  }
                />
              </Stack>
              </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.useSpecialChar}
                      id="useSpecialChar"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      name="useSpecialChar"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">{t("استفاده از حروف خاص")}</Typography>
                  }
                />
              </Stack>
            </Grid>
            {formik.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{formik.errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  type="button"
                  onClick={formik.handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  {t("ثبت")}
                </Button>

                {authError && (
                  <div style={{ color: "red", textAlign: "center" }}>
                    {t(authError.message)}
                  </div>
                )}
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};

export default PasswordSettings;
