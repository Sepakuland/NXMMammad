import React, { useEffect, useState, useRef } from "react";
import Print from "sepakuland-component-print";
import { FooterSome, CurrencyCell,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useLocation } from "react-router-dom";
import { useGetAllAccountingDocumentTrialBalanceReportQuery } from "../../../../../features/slices/accountingDocumentSlice";
import { CreateQueryString } from "../../../../../utils/createQueryString";
import { CircularProgress } from "@mui/material";

const TrialBalanceFourRowPrint = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const [underData, setUnderData] = useState([]);
  const underDataRef = useRef();
  underDataRef.current = underData;

  const location = useLocation();
const data2 = location.state;

console.log("dataaaaaaaaaaaaaaaaa",data2)

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );

  const [querySearchParams, setQuerySearchParams] = useState("")
  const [content, setContent] = useState("")


  const [excelskip, setExcelSkip] = useState(true)
  const [excelData, setExcelData] = useState([])

  const { data: AccountDocumentResult, isFetching: AccountDocumentIsFetching, error: AccountDocumentError, currentData: AccountDocumentCurrentData
  } = useGetAllAccountingDocumentTrialBalanceReportQuery({ query: CreateQueryString(data2) });

  //  setExcelSkip(false)
  
  console.log("result",AccountDocumentResult)
  console.log("querySearchParams",querySearchParams)


  useEffect(() => {
    if (AccountDocumentIsFetching) {
        setContent(<CircularProgress />)
    } else if (AccountDocumentError) {
        setContent(t("خطایی رخ داده است"))
    } else {
        console.log("here")
        setContent("")
        let tempDebits;
        let tempCredits;
            let tempData = AccountDocumentResult.data.map((data) => {
                return {
                     ...data,
                    "completeCode": data.completeCode,
                    "title": data.title,
                    "debitsBefore": data.debitsBefore ,
                    "creditsBefore":data.creditsBefore,
                    "debitsDuration":data.debitsDuration,
                    "creditsDuration":data.creditsDuration,
                    "debitsNow":data.debitsNow,
                    "creditsNow":data.creditsNow,
                    "debitsRemain":data.debitsRemain,
                    "creditsRemain":data.creditsRemain
                }
            })
            setData(tempData)
            dataRef.current = tempData
    }
}, [AccountDocumentIsFetching,AccountDocumentResult])





  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      name: "ردیف",
      width:"100px",
      cell: IndexCell,
    },
    {
      name: "‌‌",
      field: "code",
      children: [
        {
          field: "completeCode",
          name: "کد حساب",
          className: "text-center",
        },
        {
          field: "title",
          name: "عنوان حساب",
          filter: "numeric",
        },
      ],
    },
    {
      name: "گردش طی دوره",
      field: "Duration",
      children: [
        {
          field: "debitsDuration",
          name: "بدهکار",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "creditsDuration",
          name: "بستانکار",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        }
      ],
    },
    {
      name: "مانده تا‌کنون",
      field: "Remain",
      children: [
        {
          field: "debitsRemain",
          name: "بدهکار",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        },
        {
          field: "creditsRemain",
          name: "بستانکار",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
        }
      ],
    },
  ];

  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("")}
        subTitle={t("گزارش تراز")}
      >
        <div className="row betweens">
          <div className="col-lg-2 col-md-6 col-6">
            {t("گزارش")} 
          </div>
          <div className="col-lg-2 col-md-6 col-6">
          {t("تراز چهار‌ستونی")}
          </div>
          <div className="col-lg-2 col-md-6 col-6">
           {
             data2.reportId===2 ? t("تراز معین"): data2.reportId===1 ? t("تراز کل") :t("تراز تفضیلی")
           }
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            {t("از تاریخ")} : {getLangDate("fa",data2.DocumentDate[0])}
          </div>
          <div className="col-lg-2 col-md-6 col-6">
            {t("تا تاریخ")} :  {getLangDate("fa",data2.DocumentDate[1])}
          </div>
        </div>
      </Print>
    </>
  );
};
export default TrialBalanceFourRowPrint;
