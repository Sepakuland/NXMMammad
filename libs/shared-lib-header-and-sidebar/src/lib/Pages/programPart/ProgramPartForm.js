import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import swal from "sweetalert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Accordion, AccordionDetails, AccordionSummary, Button, Tooltip, Typography, useTheme, } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "devextreme/dist/css/dx.light.css";
import data from "./Data";
import axios from "axios";

import { SelectBox } from "devextreme-react/select-box";

const Factor = [];
export const ProgramPartForm = () => {
  const { t, i18n } = useTranslation();
  const appConfig = window.globalConfig;
  const [Data, setData] = React.useState([]);
  const [datasource, setDataSource] = useState([]);
  const [types, setType] = React.useState(data.getType());
  const [result, setResult] = React.useState([]);
  const [panel1, setPanel1] = useState(true);
  const handlePanel1 = () => (event, newExpanded) => {
    setPanel1(newExpanded);
  };

  const theme = useTheme();
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      parentID: 0,
      systemName: "",
      displayName: "",
      icon: "FormOutlined",
      active: true,
      priority: "",
      type: "",
      routeName: "",
      roleID: 0,
      breadCrumbs: false,
    },
    validationSchema: Yup.object({
      systemName: Yup.string()
        .required(() => {
          return "نام لاتین منو الزامیست";
        })
        .nullable(true),
      displayName: Yup.string()
        .required(() => {
          return "نام منو الزامیست";
        })
        .nullable(true),
      priority: Yup.string()
        .required(() => {
          return "اولویت در منو الزامیست";
        })
        .nullable(true),
      roleID: Yup.number()
        .required(() => {
          return "نام نقش الزامیست";
        })
        .nullable(true),
    }),
    onSubmit: (values) => {
      // setFactor([...factor, values]);
      console.log("herere", values);
      axios
        .post(`https://localhost:44324/api/ProgramPart`, values)
        .then((res) => setResult(res.data))
        .catch((error) => error);
      factorSub();
    },
  });
  const factorSub = () => {
    swal({
      title: t("منو با موفقیت ثبت شد"),
      icon: "success",
      button: t("باشه"),
    });
  };
  useEffect(() => {
    if (formik.isSubmitting) {
      let condition1 = !!(
        (formik.touched.parentID && formik.errors.parentID) ||
        (formik.touched.systemName && formik.errors.systemName) ||
        (formik.touched.displayName && formik.errors.displayName) ||
        (formik.touched.priority && formik.errors.priority) ||
        (formik.touched.type && formik.errors.type) ||
        (formik.touched.routeName && formik.errors.routeName) ||
        (formik.touched.roleID && formik.errors.roleID)
      );

      setPanel1(condition1 || panel1);
    }
  }, [formik]);
  useEffect(() => {
    axios
      .get(`https://localhost:44324/api/ProgramPart`)
      .then((res) => setData(res.data.data));
  }, []);
  useEffect(() => {
    axios
      .get(`https://localhost:44324/api/ApplicationRole`)
      .then((res) => setDataSource(res.data.data));
  }, []);
  const Parent = Data.filter((item) => item.parentID == 0);
  console.log(Parent);
  const measurementUnits = [
    t("جعبه"),
    t("دستگاه"),
    t("ساعت"),
    t("شاخه"),
    t("عدد"),
    t("کارتن"),
    t("کیلوگرم"),
    t("لیتر"),
    t("متر"),
    t("متر مربع"),
    t("ورقه"),
    t("ماه"),
  ];
  return (
    <>
      <div id="form" style={{ display: "block", marginRight: "10px" }}>
        {/*<h1 className='main-title'>*/}
        {/*    {t("ایجاد منو")}*/}
        {/*</h1>*/}
        <form onSubmit={formik.handleSubmit}>
          <div
            className="form-template"
            style={{
              border: "none",
            }}
          >
            <Accordion expanded={panel1} onChange={handlePanel1()}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  <span>{t("ایجاد منو")}</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="form-design">
                  <div className="row">
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>{t("زیرمجموعه")}</span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            dataSource={Data}
                            displayExpr="displayName"
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            onValueChanged={(e) =>
                              formik.setFieldValue("parentID", e.value.id)
                            }
                            className="selectBox"
                            noDataText={t("اطلاعات یافت نشد")}
                            itemRender={null}
                            placeholder=""
                            name="displayName"
                            id="displayName"
                            searchEnabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>
                          {t("نام منو")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            type="text"
                            id="displayName"
                            name="displayName"
                            style={{ width: "100%" }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.displayName}
                          />
                          {formik.touched.displayName &&
                            formik.errors.displayName ? (
                            <div className="error-msg">
                              {t(formik.errors.displayName)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>
                          {t("نام منو (لاتین)")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            type="text"
                            id="systemName"
                            name="systemName"
                            style={{ width: "100%" }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.systemName}
                          />
                          {formik.touched.systemName &&
                            formik.errors.systemName ? (
                            <div className="error-msg">
                              {t(formik.errors.systemName)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>
                          {t("نوع منو")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            dataSource={types}
                            displayExpr="type"
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            onValueChanged={(e) =>
                              formik.setFieldValue("type", e.value.type)
                            }
                            className="selectBox"
                            noDataText="اطلاعات یافت نشد"
                            itemRender={null}
                            placeholder=""
                            name="type"
                            id="type"
                            searchEnabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>{t("آیکون")}</span>
                      </div>
                      <div className="wrapper">
                        <div
                          className="d-flex"
                          style={{ position: "relative" }}
                        >
                          <input
                            className={`form-input modal-input ${i18n.dir() === "ltr" ? "ltr" : ""
                              }`}
                            type="text"
                            id="icon"
                            name="icon"
                            style={{ width: "100%" }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.icon}
                          />
                          <div
                            className={`modal-action-button ${i18n.dir() == "ltr" ? "action-ltr" : ""
                              }`}
                          >
                            <Tooltip
                              title={
                                "آیکون انتخابی باید از وبسایت زیر باشد https://ant.design/components/icon "
                              }
                              placement="top"
                              arrow
                            >
                              <Button>
                                <InfoOutlinedIcon style={{ color: "coral" }} />
                              </Button>
                            </Tooltip>
                          </div>
                          {formik.touched.conditionAmount &&
                            formik.errors.conditionAmount ? (
                            <div className="error-msg">
                              {t(formik.errors.conditionAmount)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>
                          {t("آدرس منو")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            type="text"
                            id="routeName"
                            name="routeName"
                            style={{ width: "100%" }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.routeName}
                          />
                          {formik.touched.routeName &&
                            formik.errors.routeName ? (
                            <div className="error-msg">
                              {t(formik.errors.routeName)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>
                          {t("اولویت در منو")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <input
                            className="form-input"
                            type="number"
                            id="priority"
                            name="priority"
                            style={{ width: "100%" }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.priority}
                          />
                          {formik.touched.priority && formik.errors.priority ? (
                            <div className="error-msg">
                              {t(formik.errors.priority)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>
                          {t("دسترسی")}
                          <span className="star">*</span>
                        </span>
                      </div>
                      <div className="wrapper">
                        <div>
                          <SelectBox
                            dataSource={datasource}
                            rtlEnabled={i18n.dir() == "ltr" ? false : true}
                            onValueChanged={(e) =>
                              formik.setFieldValue("roleID", e.value)
                            }
                            className="selectBox"
                            valueExpr="roleID"
                            displayExpr="roleName"
                            noDataText="اطلاعات یافت نشد"
                            itemRender={null}
                            placeholder=""
                            name="roleID"
                            id="roleID"
                            searchEnabled
                            showClearButton
                          //defaultValue={nickName[0]}       نشان دادن مقدار اولیه
                          />
                          {formik.touched.roleID && formik.errors.roleID ? (
                            <div className="error-msg">
                              {t(formik.errors.roleID)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="content col-lg-6 col-md-6 col-xs-12">
                      <div className="title">
                        <span>‌</span>
                      </div>
                      <div className="checkbox-label">
                        <input
                          type="checkbox"
                          className="form-input"
                          id="breadCrumbs"
                          name="breadCrumbs"
                          value={formik.values.breadCrumbs}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label
                          htmlFor="breadCrumbs"
                          style={{ marginRight: "5px" }}
                        >
                          {t("بردکرامب")}{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <div>
              <div className="button-pos">
                <button
                  id="submit"
                  type="button"
                  onClick={formik.handleSubmit}
                  className="btn btn-success"
                >
                  {t("ثبت")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProgramPartForm;
