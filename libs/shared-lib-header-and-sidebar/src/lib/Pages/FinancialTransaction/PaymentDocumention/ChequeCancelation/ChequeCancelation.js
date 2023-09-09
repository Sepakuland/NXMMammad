import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import { useTheme, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SelectBox } from "devextreme-react";
import { history } from "../../../../utils/history";
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
      chequeCancelation: "",
      chequeBook: "",
      cancelReason: "",
    },
    validationSchema: Yup.object({
      chequeBook: Yup.string().required(() => {
        return "دسته چک الزامیست";
      }),
      chequeCancelation: Yup.string().required(() => {
        return "ابطال چک الزامیست";
      }),
      cancelReason: Yup.string().required(() => {
        return "دلیل ابطال الزامیست";
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

  const measurementUnits = [t("پیش نویس"), t("مذاکره"), t("ارسال شده")];
  const callComponent = () => {
    history.navigate(
      `/FinancialTransaction/PaymentDocument/ChequeCancelation/DisplayDetails`,
      "noopener,noreferrer"
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
                      {t("دسته چک")}
                      <span className="star">*</span>
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={measurementUnits}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        onValueChanged={(e) =>
                          formik.setFieldValue("chequeBook", e.value)
                        }
                        className="selectBox"
                        noDataText={t("اطلاعات یافت نشد")}
                        itemRender={null}
                        placeholder=""
                        name="chequeBook"
                        id="chequeBook"
                        searchEnabled
                      />

                      {formik.touched.chequeBook &&
                      formik.errors.chequeBook &&
                      !formik.values.chequeBook ? (
                        <div className="error-msg">
                          {t(formik.errors.chequeBook)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {t("ابطال چک")}
                      <span className="star">*</span>
                    </span>
                  </div>
                  <div className="wrapper">
                    <div>
                      <SelectBox
                        dataSource={measurementUnits}
                        rtlEnabled={i18n.dir() == "ltr" ? false : true}
                        onValueChanged={(e) =>
                          formik.setFieldValue("chequeCancelation", e.value)
                        }
                        className="selectBox"
                        noDataText={t("اطلاعات یافت نشد")}
                        itemRender={null}
                        placeholder=""
                        name="chequeCancelation"
                        id="chequeCancelation"
                        searchEnabled
                      />
                      {formik.touched.chequeCancelation &&
                      formik.errors.chequeCancelation &&
                      !formik.values.chequeCancelation ? (
                        <div className="error-msg">
                          {t(formik.errors.chequeCancelation)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="content col-lg-6 col-md-6 col-12">
                  <div className="title">
                    <span>
                      {t("دلیل ابطال")}
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

            <div className={`button-pos ${i18n.dir()=='ltr'?'ltr':'rtl'}`}>
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={formik.handleSubmit}
              >
                {t("ثبت تغییرات")}
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
