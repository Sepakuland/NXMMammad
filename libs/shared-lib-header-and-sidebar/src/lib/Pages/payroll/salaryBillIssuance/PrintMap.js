import React, { useEffect, useState } from "react";
import { TotalTitle,IndexCell } from "rkgrid";
import {PrintGridEmpty} from "sepakuland-component-print";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import CurrencyInput from "react-currency-input-field";
import n2words from "n2words";

const PrintMap = ({ printData }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language
  const [searchParams] = useSearchParams();
  //   const [data, setData] = useState([]);
  //   const dataRef = useRef();
  //   dataRef.current = data;
  const [fullTotal, setFullTotal] = useState(0);

  useEffect(() => {
    if (Object.keys(printData).length) {
      let deductionTotal = printData?.Data.reduce((acc, current) => {
        return (
          acc +
          (parseFloat(
            current.Deductions?.value.toString().replaceAll(",", "")
          ) || 0)
        );
      }, 0);
      let benefitsTotal = printData?.Data.reduce((acc, current) => {
        return (
          acc +
          (parseFloat(current.Benefits?.value.toString().replaceAll(",", "")) ||
            0)
        );
      }, 0);

      let fullTotal = benefitsTotal - deductionTotal;
      setFullTotal(fullTotal);
    }
  }, [i18n.language]);

  console.log("fullTotal", fullTotal);

  const CustomFooterSome = (props) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
      if (Object.keys(printData).length) {
        let tempTotal = printData?.Data.reduce((acc, current) => {
          return (
            acc +
            (parseFloat(
              current[props.field]?.value.toString().replaceAll(",", "")
            ) || 0)
          );
        }, 0);

        setTotal(tempTotal);
      }
    }, [printData,i18n.language]);

    return (
      <td
        colSpan={props.colSpan}
        className={` word-break ${props?.className ? props?.className : ""}`}
        style={props.style}
      >
        {total?.toLocaleString()}
      </td>
    );
  };

  const CustomCell = (props) => {
    return (
      <td style={{ padding: "20px" }}>
        <div className="d-flex justify-content-between">
          <div style={{ padding: "10px" }}>
            {props.dataItem[props.field].name}
          </div>
          <div style={{ padding: "10px" }}>
            {props.dataItem[props.field].value}
          </div>
        </div>
      </td>
    );
  };

  let tempColumn = [
    {
      field: "IndexCell",
      width: "50px",
      filterable: false,
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false,
    },
    {
      field: "Functuality",
      name: "کارکرد",
      cell: CustomCell,
    },
    {
      field: "Benefits",
      name: "حقوق و مزایا",
      cell: CustomCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "Deductions",
      name: "کسورات",
      cell: CustomCell,
      footerCell: CustomFooterSome,
    },
  ];

  return (
    <>
      <div className="p-3 print-page">
        <div className="mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-md-12 col-sm-12 col-12">
              <section
                style={{
                  border: "1px solid rgb(0,0,0,0.1)",
                  marginBottom: "-5px",
                }}
                className="printTicketSalaryBillsIssuanceMain"
              >
                <div>
                  <div>
                    <img src={CoddingIcon} alt="logPic" />
                  </div>
                  <div style={{ fontSize: "1.5rem" }}>{t("تست و دمو")}</div>
                </div>
                <div>
                  <div>{t("شماره حساب")}: {printData.AccountNumber}</div>
                  <div>{t("نام خانوادگی")}: {printData.LastName}</div>
                  <div>{t("نام")}: {printData.FirstName}</div>

                  <div>{t("کد پرسنل")}: {printData.PerssonelCode}</div>
                  <div>{printData.Month + " " + printData.Year}</div>
                </div>
              </section>
            </div>
          </div>

          <PrintGridEmpty printData={printData.Data} columnList={tempColumn} />

          <div className="row justify-content-center">
            <div className="col-lg-11 col-md-12 col-sm-12 col-12">
              <div
                style={{
                  border: "1px solid rgb(0,0,0,0.1)",
                  marginTop: "-5px",
                  borderTop: "none",
                  direction: "rtl",
                  padding: "10px 100px",
                }}
              >
                <span>{t("خالص پرداختنی")}:</span>
                <span>
                  <CurrencyInput
                    style={{ direction: "ltr" }}
                    className={`form-input text-center`}
                    id="amount"
                    name={`amount`}
                    value={fullTotal}
                    decimalsLimit={2}
                    disabled
                  />
                  ریال
                </span>
                <span style={{marginRight:"100px"}}>
                  {" "}
                  {t("مبلغ نهایی به حروف")}:{" "}
                  {n2words(fullTotal, { lang: lang })}
                  {" ریال"}
                </span>
              </div>
            </div>
          </div>

          <div className="col-12 d-flex">
            <span className="d-flex col-6 justify-content-end me-5 mt-3">
              {t("امضا تحویل گیرنده")}
            </span>
            <span className="d-flex col-6 mt-3">{t("امضا تحویل دهنده")}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default PrintMap;
