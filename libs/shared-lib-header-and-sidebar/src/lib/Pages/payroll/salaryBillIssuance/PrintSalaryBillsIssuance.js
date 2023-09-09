import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import CashData from './salaryData.json'
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../assets/images/Logo/CoddingIcon.jpg";

const PrintSalaryBillsIssuance = () => {

  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang')
  const [data, setData] = useState([])
  const dataRef = useRef()
  dataRef.current = data


  useEffect(() => {
      let tempData = CashData.map((data) => {
        let temp = (data.Benefits).toString().replaceAll(',', '')
        let cost = parseFloat(temp, 2)
        let temp2 = (data.Deductions).toString().replaceAll(',', '')
        let cost2 = parseFloat(temp2, 2)
        let temp3 = (data.Loans).toString().replaceAll(',', '')
        let cost3 = parseFloat(temp3, 2)
        let temp4 = (data.PurePayment).toString().replaceAll(',', '')
        let cost4 = parseFloat(temp4, 2)
     
      return {
        ...data,
        Benefits:cost,
        Deductions:cost2,
        Loans:cost3,
        PurePayment:cost4,
        BillCode: parseInt(data.BillCode),
        PersonnelCode: parseInt(data.PersonnelCode),
      }
    })
    setData(tempData)
  }, [i18n==lang])


  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'BillCode',
            name: "شماره فیش",
        },
        {
            field: 'PersonnelCode',
            name: "کد پرسنل",
        },
        {
            field: 'PersonnelName',
            name: "نام پرسنل",
        },
        {
            field: 'Month',
            name: "ماه",
        },   
        {
            field: 'Benefits',
            name: "جمع مزایا",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'Deductions',
            name: "جمع کسورات",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'Loans',
            name: "اقساط وام",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'PurePayment',
            name: "خالص پرداختنی",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
      
    ]

  return (

    <Print
      printData={data}
      columnList={tempColumn}
      logo={CoddingIcon}
      title={t("نمایش جزییات")}
      subTitle={t("فیش‌های حقوق")}

    />
  )
}
export default PrintSalaryBillsIssuance









