import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import products from "../../Wasted-Cheque/DisplayDetails/product.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const ChequePrintPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const [excelData, setExcelData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = products.map((data, index) => {
      let temp = (data.ChequeAmount).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        IndexCell: index + 1,
        DocumentDate: getLangDate(lang, new Date(data.DocumentDate)),
        DueDate: getLangDate(lang, new Date(data.DueDate)),
        ChequeAmount: cost,
        Code: parseInt(data.Code),
      }
    })
    setData(tempData)

  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} className={'break-line'} data={dataRef.current} />

  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '60px',
      name: "ردیف",
      className:'break-line',
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false
    },
    {
      field: 'Code',
      className: 'break-line',
      filterable: false,
      name: "کد",
    },
    {
      field: 'AccountPartyCode',
      className: 'break-line',
      filterable: false,
      name: "کد طرف حساب",
    },
    {
      field: 'AccountPartyName',
      filterable: false,
      name: "نام طرف حساب",
    },
    {
      field: 'ChequeSerial',
      filterable: false,
      name: "سریال چک",
      className: 'break-line',
    },
    {
      field: 'ChequeAmount',
      filterable: false,
      name: "مبلغ چک",
      className: 'break-line',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: 'DocumentDate',
      filterable: false,
      name: "تاریخ سند",
      // format: "{0:d}",
      className: 'break-line',
    },
    {
      field: 'DueDate',
      filterable: false,
      name: "تاریخ سررسید",
      // format: "{0:d}",
      className: 'break-line',
    },
    {
      field: 'Reason',
      filterable: false,
      width: '120px',
      name: "دلیل",
    },

  ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("چک سوختی")}
    />
  )
}
export default ChequePrintPage