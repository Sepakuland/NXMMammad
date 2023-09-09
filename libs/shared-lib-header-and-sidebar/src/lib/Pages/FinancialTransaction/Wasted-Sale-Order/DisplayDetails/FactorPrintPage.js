import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import products from "../../Wasted-Sale-Order/DisplayDetails/product.json";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";

const FactorPrintPage = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const [excelData, setExcelData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
    let tempData = products.map((data, index) => {
      let temp = (data.InvoiceAmount).toString().replaceAll(',', '')
      let cost = parseFloat(temp, 2)
      let temp2 = (data.SettledAmount).toString().replaceAll(',', '')
      let cost2 = parseFloat(temp2, 2)
      let temp3 = (data.WastedAmount).toString().replaceAll(',', '')
      let cost3 = parseFloat(temp3, 2)
      return {
        ...data,
        IndexCell: index + 1,
        InvoiceAmount: cost,
        SettledAmount: cost2,
        WastedAmount: cost3,
        Code: parseInt(data.Code),
      }
    })
    setData(tempData)

  }, [lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

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
      className: 'text-center break-line',
      filterable: false,
      name: "کد",
      width: '60px',
    },
    {
      field: 'AccountPartyCode',
      className: 'text-center break-line',
      filterable: false,
      name: "کد طرف حساب",
      width: '60px',
    },
    {
      field: 'AccountPartyName',
      filterable: false,
      name: "نام طرف حساب",
      width: '100px',
    },
    {
      field: 'InvoiceNumber',
      filterable: false,
      name: "شماره فاکتور",
      className:'break-line',
      width: '120px',
    },
    {
      field: 'InvoiceAmount',
      filterable: false,
      name: "مبلغ فاکتور",
      className:'break-line',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: 'SettledAmount',
      filterable: false,
      name: "مبلغ تسویه شده",
      className:'break-line',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: 'WastedAmount',
      filterable: false,
      name: "مبلغ سوختی",
      className:'break-line',
      cell: CurrencyCell,
      footerCell: CustomFooterSome,
    },
    {
      field: 'Reason',
      filterable: false,
      width: '140px',
      name: "دلیل",
    },

  ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("فاکتور سوختی")}
    />
  )
}
export default FactorPrintPage