import React, { useEffect } from "react";

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { useFormik } from "formik";

// project import
import AnimateButton from "../../../components/@extended/AnimateButton";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { history } from "../../../utils/history";
import axios from "axios";

// ============================|| FIREBASE - LOGIN ||============================ //

const ChangePassword = () => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const appConfig = window.globalConfig;
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [showNewPassword, setshowNewPassword] = React.useState(false);
  const handleClickShowNewPassword = () => {
    setshowNewPassword(!showNewPassword);
  };
  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };
  const [user] = React.useState(JSON.parse(localStorage.getItem("user")));
  const [result, setResult] = React.useState("");
  console.log(result)
  const [showconfirmNewPass, setshowconfirmNewPass] = React.useState(false);
  const handleClickshowconfirmNewPass = () => {
    setshowconfirmNewPass(!showconfirmNewPass);
  };
  const handleMouseDownconfirmNewPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    // redirect to home if already logged in
    if (result.succeeded == true) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);
  const formik = useFormik({
    initialValues: {
      username: user.username,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().max(255).required("رمز عبور الزامیست"),
    }),
    onSubmit: (values) => {
      console.log(values);
      axios
        .post(
          `${appConfig.BaseURL}/api/authenticate/ChangePassword/`,
          values
        )
        .then((res) => setResult(res.data))
        .catch((error) => error);
    },
  });
  return (
    <>
      {i18n.language === "en" ? (
        <form onSubmit={formik.handleSubmit}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="oldPassword-login">
                {t("رمز عبور")}
              </InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(
                  formik.touched.oldPassword && formik.errors.oldPassword
                )}
                id="-oldPassword-login"
                type={showPassword ? "text" : "password"}
                value={formik.values.oldPassword}
                name="oldPassword"
                onBlur={formik.handleBlur}
                onChange={formik.oldPassword}
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
                placeholder={t("رمز عبور فعلی خود را وارد کنید")}
              />
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-oldPassword-login"
                >
                  {t(formik.errors.oldPassword)}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="newPassword-login">
                {t("رمز عبور جدید")}
              </InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(
                  formik.touched.newPassword && formik.errors.newPassword
                )}
                id="-newPassword-login"
                type={showNewPassword ? "text" : "password"}
                value={formik.values.newPassword}
                name="newPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                      size="large"
                    >
                      {showNewPassword ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder={t("رمز عبور جدید خود را وارد کنید")}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-newPassword-login"
                >
                  {t(formik.errors.newPassword)}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="confirmNewPass-login">
                {t("تایید رمز عبور جدید")}
              </InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(
                  formik.touched.confirmNewPassword &&
                    formik.errors.confirmNewPassword
                )}
                id="-confirmNewPassword-login"
                type={showconfirmNewPass ? "text" : "password"}
                value={formik.values.confirmNewPassword}
                name="confirmNewPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickshowconfirmNewPass}
                      onMouseDown={handleMouseDownconfirmNewPassword}
                      edge="end"
                      size="large"
                    >
                      {showconfirmNewPass ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder={t("رمز عبور جدید خود را دوباره وارد کنید")}
              />
              {formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-confirmNewPassword-login"
                  >
                    {t(formik.errors.confirmNewPassword)}
                  </FormHelperText>
                )}
            </Stack>
          </Grid>
          {formik.errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{t(formik.errors.submit)}</FormHelperText>
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
            {result.status == "Error" &&
                            <div style={{color: "red" , textAlign: "center"}}>{t(result.message)}</div>
                        }
          </Grid>
        </form>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} style={{ direction: "rtl" }}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="oldPassword-login">
                  {t("رمز عبور")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(
                    formik.touched.oldPassword && formik.errors.oldPassword
                  )}
                  id="-oldPassword-login"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.oldPassword}
                  name="oldPassword"
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
                  placeholder={t("رمز عبور فعلی خود را وارد کنید")}
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-oldPassword-login"
                  >
                    {t(formik.errors.oldPassword)}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="newPassword-login">
                  {t("رمز عبور جدید")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(
                    formik.touched.newPassword && formik.errors.newPassword
                  )}
                  id="-newPassword-login"
                  type={showNewPassword ? "text" : "password"}
                  value={formik.values.newPassword}
                  name="newPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownNewPassword}
                        edge="end"
                        size="large"
                      >
                        {showNewPassword ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder={t("رمز عبور جدید خود را وارد کنید")}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-newPassword-login"
                  >
                    {t(formik.errors.newPassword)}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirmNewPassword-login">
                  {t("تایید رمز عبور جدید")}
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(
                    formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword
                  )}
                  id="-confirmNewPass-login"
                  type={showconfirmNewPass ? "text" : "password"}
                  value={formik.values.confirmNewPassword}
                  name="confirmNewPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickshowconfirmNewPass}
                        onMouseDown={handleMouseDownconfirmNewPassword}
                        edge="end"
                        size="large"
                      >
                        {showconfirmNewPass ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder={t("رمز عبور جدید خود را دوباره وارد کنید")}
                />
                {formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-confirmNewPassword-login"
                    >
                      {t(formik.errors.confirmNewPassword)}
                    </FormHelperText>
                  )}
              </Stack>
            </Grid>
            {formik.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{t(formik.errors.submit)}</FormHelperText>
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
            {result.status == "Error" &&
                            <div style={{color: "red" , textAlign: "center"}}>{t(result.message)}</div>
                        }
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};

export default ChangePassword;
