import React, { useEffect, useState, useRef } from "react";
import Print,{PrintGrid} from "sepakuland-component-print";
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import PrintReceiptRowUnderData from "./PrintReceiptRowUnderData.json";
import PrintReceiptRowData from "./PrintReceiptRowData.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintReceiptRow = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");
  const [data, setData] = useState([]);
  const dataRef = useRef();
  dataRef.current = data;
  const [underData, setUnderData] = useState([]);
  const underDataRef = useRef();
  underDataRef.current = underData;

  useEffect(() => {
    let tempUnderData = PrintReceiptRowUnderData.map((data) => {

        let temp = (data.Price).toString().replaceAll(',','')
        let price = data.Price !== '' ? parseFloat(temp, 2) : 0

        temp = (data.ComplyWithReceipt).toString().replaceAll(',','')
        let complyWithReceipt = data.ComplyWithReceipt !== '' ? parseFloat(temp, 2) : 0
      return {
        ...data,
         Price: price,
        ComplyWithReceipt: complyWithReceipt,
      };
    });
    setUnderData(tempUnderData);

    let tempData = PrintReceiptRowData.map((data) => {
      let temp = data.ChequePrice.toString().replaceAll(",", "");
      let chequePrice = temp!==''? parseFloat(temp, 2):0

      temp = data.CashPrice.toString().replaceAll(",", "");
      let cashPrice = temp!==''? parseFloat(temp, 2):0

      temp = data.BankPrice.toString().replaceAll(",", "");
      let bankPrice = temp!==''? parseFloat(temp, 2):0

      return {
        ...data,
        ChequePrice: chequePrice,
        CashPrice: cashPrice,
        BankPrice: bankPrice,
        ChequeSerial: data.ChequeSerial !=='' ? parseInt(data.ChequeSerial) : '',
      };
    });
    setData(tempData);
  }, [lang]);

  const CustomFooterSome = (props) => (
    <FooterSome {...props} data={dataRef.current} />
  );

  let tempColumn = [
    {
      field: "IndexCell",
      filterable: false,
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle
    },
    {
      name: "نقد",
      field: "Cash",
      children: [
        {
          field: "CashCashAccount",
          name: "صندوق",
          className: "text-center",
        },
        {
          field: "CashPrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    },
    {
      name: "بانک",
      field: "Bank",
      children: [
        {
          field: "BankAccount",
          width: "100px",
          name: "حساب",
        },
        {
          field: "BankBillCode",
          name: "شماره فیش",
          filter: "numeric",
          className: "word-break"
        },
        {
          field: "BankPrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
          className: "word-break"
        }
      ],
    },
    {
      name: "چک",
      field: "Cheque",
      children: [
        {
          field: "ChequeSerial",
          name: "سریال",
          filter: "numeric",
          className: "word-break"
        },
        {
          field: "ChequeMaturityDate",
          name: "سررسید",
          // format: "{0:d}",
          filter: "date",
          className: "word-break"
        },
        {
          field: "ChequePrice",
          name: "مبلغ",
          filter: "numeric",
          cell: CurrencyCell,
          footerCell: CustomFooterSome,
          className: "word-break"
        },
      ],
    },
  ];
  let tempColumn2 = [
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
      name: "شماره",
      className: "word-break"
    },
    {
      field: "Price",
      filterable: false,
      name: "مبلغ",
      className: "word-break"
    },
    {
      field: "ComplyWithReceipt",
      filterable: false,
      name: "تطبیق با این دریافت",
      className: "word-break"
    },
  ];

  return (
    <>
      <Print
        printData={data}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t("دریافت")}
      >
        <div className="row betweens">
          <div className="col-lg-4 col-md-6 col-6">
            {t("کد دریاقت")}:  10
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("تاریخ دریافت")} :  1400/02/08
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("جمع مبلغ")} : 78,530,000 
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("کد طرف حساب")} : 10130003
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("نام طرف حساب")} :  مرتضی مرادی(مانده: 0) 
          </div>
          <div className="col-lg-4 col-md-6 col-6">
            {t("نام حقوقی")} : تنها
          </div>
          <div className="col-lg-4 col-md-6 col-6">{t("توضیحات")} :  دریافت نقدی از امینی زاده 1400/02/11</div>
        </div>
      </Print>
      <PrintGrid printData={underData} columnList={tempColumn2}></PrintGrid>
    </>
  );
};
export default PrintReceiptRow;
