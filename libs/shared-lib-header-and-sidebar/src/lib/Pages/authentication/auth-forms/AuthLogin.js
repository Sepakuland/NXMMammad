import React, { useEffect } from "react";

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
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
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/store";
import { history } from "../../../utils/history";

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(x => x.auth.user);
  const authError = useSelector(x => x.auth.error);
  const [checked, setChecked] = React.useState(false);
 
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(t("نام کاربری الزامیست!")),
      password: Yup.string().max(255).required(t("رمز عبور الزامیست!")),
    }),
    onSubmit: (values) => {
      console.log(values)
      return dispatch(authActions.login( values ));
    },
  });
  return (
    <>
      {i18n.language === "en" ? (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} style={{ direction: "ltr" }}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="username">{t("نام کاربری")}</InputLabel>
                <OutlinedInput
                  id="username"
                  type="text"
                  value={formik.values.username}
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("نام کاربری خود را وارد کنید")}
                  fullWidth
                  error={formik.touched.username && formik.errors.username}
                />
                {formik.touched.username && formik.errors.username && (
                  <FormHelperText error>
                    {formik.errors.username}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">
                  {t("رمز عبور")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                  id="-password-login"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder={t("رمز عبور خود را وارد کنید")}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-login"
                  >
                    {formik.errors.password}
                  </FormHelperText>
                )}
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
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">
                      {t("مرا به خاطر بسپار")}
                    </Typography>
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
                  {t("ورود")}
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
                <InputLabel htmlFor="username">{t("نام کاربری")}</InputLabel>
                <OutlinedInput
                  id="username"
                  type="text"
                  value={formik.values.username}
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={t("نام کاربری خود را وارد کنید")}
                  fullWidth
                  error={formik.touched.username && formik.errors.username}
                />
                {formik.touched.username && formik.errors.username && (
                  <FormHelperText error>
                    {formik.errors.username}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">
                  {t("رمز عبور")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                  id="-password-login"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder={t("رمز عبور خود را وارد کنید")}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-login"
                  >
                    {formik.errors.password}
                  </FormHelperText>
                )}
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
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="h6">
                      {t("مرا به خاطر بسپار")}
                    </Typography>
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
                  {t("ورود")}
                </Button>
                
                {authError &&
                            <div style={{color: "red" , textAlign: "center"}}>{t(authError.message)}</div>
                        }
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};

export default AuthLogin;
