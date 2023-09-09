import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell,getLangDate } from "rkgrid";
import { useTranslation } from "react-i18next";
import products from "../../CashCharge/DisplayDetails/product.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";

const PrintPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const [excelData, setExcelData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = products.map((data, index) => {
      let temp = (data.Amount).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      return {
        ...data,
        IndexCell: index + 1,
        Date: getLangDate(lang,new Date(data.Date)),
        Amount: cost,
        Code: parseInt(data.Code),
      }
    })
    setData(tempData)

  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  const CustomCurrency = (props) => <CurrencyCell {...props} cell={'Amount'} />

  let tempColumn = [
    {
      field: 'IndexCell',
      filterable: false,
      width: '60px',
      name: "ردیف",
      cell: IndexCell,
      footerCell: TotalTitle,
      sortable: false,
      reorderable: false
    },
    {
      field: 'Code',
      className: 'text-center break-line',
      filterable: false,
      name: "کد",
      width: '60px',
    },
    {
      field: 'FundName',
      filterable: false,
      name: "نام صندوق",
    },
    {
      field: 'ChargerType',
      filterable: false,
      name: "نوع شارژ کننده",
    },
    {
      field: 'Charger',
      filterable: false,
      name: "شارژ کننده",
    },
    {
      field: 'Amount',
      filterable: false,
      name: "مبلغ",
      cell: CustomCurrency,
      className:'break-line',
      footerCell: CustomFooterSome,
    },
    {
      field: 'Date',
      filterable: false,
      name: "تاریخ",
      className:'break-line',
      width: '80px',
    },
    {
      field: 'Description',
      filterable: false,
      width: '140px',
      name: "توضیحات",
    },

  ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("شارژ صندوق")}
    />
  )
}
export default PrintPage