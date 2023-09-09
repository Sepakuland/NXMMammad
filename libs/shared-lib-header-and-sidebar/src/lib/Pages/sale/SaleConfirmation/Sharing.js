import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { history } from "../../../utils/history";
const Factor = [];

export const ChequeCancelation = () => {
  const { t, i18n } = useTranslation();
  const [alignment, setAlignment] = React.useState("");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const theme = useTheme();
  const [factor, setFactor] = React.useState(Factor);
  const formik = useFormik({
    initialValues: {
      id: Math.floor(Math.random() * 1000),
      cancelReason: "",
    },
    validationSchema: Yup.object({
      cancelReason: Yup.string().required(() => {
        return "دلیل عدم تایید الزامیست";
      }),
    }),

    onSubmit: (values) => {
      console.log("here", values);
      factorSub();
    },
  });
  const factorSub = () => {
    swal({
      title: t("فاکتور با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };

  const callComponent = () => {
    history.navigate(
      `/Sell/saleConfirmation`,
    );
  };
  return (
    <>
      <div
        className="form-template"
        style={{
          backgroundColor: `${theme.palette.background.paper}`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="row ">
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {t("دلیل عدم تایید")}
                      <span className="star">*</span>
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <textarea
                        rows="8"
                        className="form-input"
                        id="cancelReason"
                        name="cancelReason"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cancelReason}
                      />
                      {formik.touched.cancelReason &&
                      formik.errors.cancelReason &&
                      !formik.values.cancelReason ? (
                        <div className="error-msg">
                          {t(formik.errors.cancelReason)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`button-pos ${i18n.dir() == "ltr" ? "ltr" : "rtl"}`}
            >
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={formik.handleSubmit}
              >
                {t("تایید")}
              </Button>

              <div className="Issuance">
                <Button
                  style={{ marginRight: "10px" }}
                  variant="contained"
                  color="error"
                  onClick={callComponent}
                >
                  {t("انصراف")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChequeCancelation;
