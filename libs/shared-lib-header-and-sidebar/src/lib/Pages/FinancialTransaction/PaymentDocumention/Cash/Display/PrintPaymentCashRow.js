import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { CurrencyCell,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import Cash from './CashData.json'
import Data from './PrintSelectedData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPaymentCashRow = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const id = searchParams.get('id')
  const [data, setData] = useState([])
  const [cashData, setcashDAta] = useState()
  const dataRef = useRef()
  dataRef.current = data

  


  useEffect(() => {
    let tempData = Data.map((data) => {
      let temp = data.Price.toString().replaceAll(",", "");
      let temp2 = data.ComplyWithReceipt.toString().replaceAll(",", "");
      let cost = parseFloat(temp, 2);
      let cost2 = parseFloat(temp2, 2);
      return {
        ...data,
        DocumentDate: new Date(data.DocumentDate),
        Price: cost,
        ComplyWithReceipt: cost2,
      };
    });
    setData(tempData);

    let i = Cash.filter((data) => data.DocumentCode== id)[0]
    console.log('i',i)
    setcashDAta(i)



     
  }, [lang])



  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      width: "60px",
      name: "ردیف",
      cell: IndexCell,
    },
    {
      field: "type",
      className: "text-center",
      name: "نوع",
    },
    {
      field: "number",
      className: "text-center",
      name: "شماره",
    },
    {
      field: "Price",
      filterable: false,
      name: "مبلغ",
      cell:CurrencyCell,
    },
    {
      field: "ComplyWithReceipt",
      filterable: false,
      cell:CurrencyCell,
      name: "تطبیق با این دریافت",
    },
  ];

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("واریز به بانک")}

    >

 <div className="row betweens">
        <div className="col-lg-6 col-md-6 col-6">{t("کد پرداخت")}: {cashData?.DocumentCode}</div>
        <div className="col-lg-6 col-md-6 col-6">{t("تاریخ پرداخت")} : {getLangDate(lang,cashData?.DocumentDate)} </div>
          
       
        <div className="col-lg-6 col-md-6 col-6"> {t("طرف حساب")} :{cashData?.PartnerName} </div>
         
       
        <div className="col-lg-6 col-md-6 col-6">{t("صندوق")} :{cashData?.CashAccountName}</div>
        <div className="col-lg-6 col-md-6 col-6">  {t("مبلغ")} : {cashData?.Price}</div>
        <div className="col-lg-6 col-md-6 col-6">{t("شرح")} : {cashData?.DocumentDescription}</div>
      </div> 
      </Print>
  )
}
export default PrintPaymentCashRow









