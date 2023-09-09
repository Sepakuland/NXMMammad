import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import StringFooterSome from "./StringFooterSum";
import { useGetAccountingDocumentsPrintQuery } from "../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../utils/createQueryString";
import { useLocation } from "react-router-dom";


const PrintDocument = () => {

  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const obj = Object.fromEntries(params);
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState([]);

  const {
    data: accountingDocumentPrintData,
    isFetching: accountingDocumentPrintIsFetching,
    error: accountingDocumentPrintError,
  } = useGetAccountingDocumentsPrintQuery(
    CreateQueryString({ DocumentId: obj.id.split(",") })
  );
  console.log("objMammad",obj)

  console.log("obj.id.split(",")",obj.id.split(","))

  console.log("accountingDocumentPrintData", accountingDocumentPrintData?.[0]);
  

  useEffect(() => {
    let arr = [];
    let tempData = accountingDocumentPrintData?.[0]?.documentArticles?.map(
      (data) => {
        console.log("dataMammad", data);
        arr = [];
        let splittedFormersNames = data?.moeinAccountFormersNames?.split(" / ");
        arr.push(`${splittedFormersNames?.[1]} / ${splittedFormersNames?.[2]}`);
        data.detailed6Name !== null
          ? arr.push(
              `${data.detailed4Name} / ${data.detailed5Name} / ${data.detailed6Name}`
            )
          : data.detailed5Name !== null
          ? arr.push(`${data.detailed4Name} / ${data.detailed5Name} `)
          : data.detailed4Name !== null
          ? arr.push(`${data.detailed4Name}`)
          : arr.push("---");
        data.notes === null || data.notes === ""
          ? arr.push("---")
          : arr.push(data.notes);
        return {
          ...data,
          documentDescription: arr.join("\n"),
        };
      }
    );
    setData({ ...data, documentArticles: tempData });
  }, [accountingDocumentPrintData?.[0]]);

  const dataRef = useRef();
  dataRef.current = data;

  const CustomFooterSome = (props) => (
    <FooterSome
      {...props}
      data={accountingDocumentPrintData?.[0]?.documentArticles}
    />
  );
  const CustomStringFooterSome = (props) => (
    <StringFooterSome {...props} fieldSome={"Debits"} data={dataRef.current} />
  );

  const NoneFooter = (props) => <></>;

  let tempColumn = [
    {
      field: "IndexCell",
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
    },
    {
      field: "moeinAccountCompleteCode",
      name: "معین",
    },
    {
      field: "detailed4Name",
      name: "تفضیلی سطح4",
    },
    {
      field: "detailed5Name",
      name: "تفضیلی سطح5",
    },
    {
      field: "detailed6Name",
      name: "تفضیلی سطح6",
    },
    {
      field: "documentDescription",
      width: "600px",
      name: "توضیحات",
    },
    {
      field: "debits",
      name: "بدهکار",
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: "credits",
      name: "بستانکار",
      footerCell: CustomFooterSome,
      cell: CurrencyCell,
    },
  ];

    return (
      <>
      <Print
        printData={data?.documentArticles}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("سند حسابداری")}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-4 col-4">
            {t("شماره سند")}: {accountingDocumentPrintData?.[0]?.documentNumber}
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("شماره پیگیری")}:12312
          </div>
          <div className="col-lg-4 col-md-4 col-4">
            {t("تاریخ سند")}:{" "}
            {getLangDate(
              i18n.language,
              accountingDocumentPrintData?.[0]?.documentDate
            )}
          </div>
          <div className="col-lg-6 col-md-6 col-6">
            {t("شرح سند")}:
            {accountingDocumentPrintData?.[0]?.documentDescription}
          </div>
        </div>
      </Print>
      <div className="p-3" style={{ direction: i18n.dir() }}>
        <div className="row justify-content-center">
          <div className="col-lg-11 col-md-12 col-sm-12 col-12 Signature">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="up">{t("تنظیم‌کننده")}:</div>
                <div className="down"></div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                <div className="up">{t("تایید‌کننده")}:</div>
                <div className="down"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
}

export default PrintDocument