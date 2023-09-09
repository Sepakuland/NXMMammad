import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useGetAllCustomerChosenCodingsWithTotalAccountsForPrintQuery } from '../../../../../features/slices/customerChosenCodingSlice';
import Guid from "devextreme/core/guid";
import { CircularProgress } from '@mui/material';


const AccountReviewPrint_Level2 = () => {

  const level = JSON.parse(localStorage.getItem(`level`))
  const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
  const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')
  const [dataSource, setDataSource] = useState([])
  const dataRef = useRef()
  dataRef.current = dataSource
  let Remainder;
  const [content, setContent] = useState("")



  /* -------------------------------------------------------------------------- */
  /*                             Get Data For Print                             */
  /* -------------------------------------------------------------------------- */

  /* --------------------- Get Customer ChosenCoding Total -------------------- */
  const [totalSkip, setTotalSkip] = useState(false);
  const { data: customerTotalResult, isFetching: customersTotalIsFetching, error: customersTotalError,
  } = useGetAllCustomerChosenCodingsWithTotalAccountsForPrintQuery(querySearchParams, { skip: totalSkip });
  useEffect(() => {
    if (customersTotalIsFetching) {
      setContent(<CircularProgress />)
    } else if (customersTotalError) {
      setContent(t("خطایی رخ داده است"))
    } else {
      setContent("")

      let tempData = customerTotalResult?.data.map((data, index) => {
        Remainder = data?.debits - data?.credits
        return {
          "id": new Guid(),
          "AccountCodeGroup": "",
          "AccountNameGroup": "",
          "AccountCodeTotal": data?.code,
          "AccountNameTotal": data?.name,
          "AccountCodeSpecific": "",
          "AccountNameSpecific": "",
          "AccountCodeEntity4": "",
          "AccountNameEntity4": "",
          "AccountCodeEntity5": "",
          "AccountNameEntity5": "",
          "AccountCodeEntity6": "",
          "AccountNameEntity6": "",
          "formersNames": data?.formersNames,
          "CycleDebtor": data?.debits,
          "CycleCreditor": data?.credits,
          "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
          "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
          "AccountCompleteCode": data?.completeCode,
          "CodingId": data?.codingId,
        }
      })
      setDataSource(tempData);
      dataRef.current = tempData
    }
  }, [customersTotalIsFetching, customerTotalResult])
  /* ----------------------------- Request Manager ---------------------------- */
  useEffect(() => {
    if (!!dataSource?.length) {
      setTotalSkip(true)
    }
  }, [dataSource])
  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

  /* -------------------------------------------------------------------------- */
  let tempColumnTotal = [
    {
      field: 'CompleteCode',
      filterable: false,
      width: '90px',
      name: "کد",
      // cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false
    },
    {
      field: 'AccountNameTotal',
      filterable: false,
      name: "مرور کل",
    },
    {
      field: 'CycleDebtor',
      filterable: false,
      name: "جمع بدهکار",
      cell: CurrencyCell,
      className: "word-break",
      footerCell: CustomFooterSome,
    },
    {
      field: 'CycleCreditor',
      filterable: false,
      name: "جمع بستانکار",
      cell: CurrencyCell,
      className: "word-break",
      footerCell: CustomFooterSome,
    },
    {
      field: 'RemainderDebtor',
      filterable: false,
      name: "مانده بدهکار",
      cell: CurrencyCell,
      className: "word-break",
      footerCell: CustomFooterSome,
    },
    {
      field: 'RemainderCreditor',
      filterable: false,
      name: "مانده بستانکار",
      cell: CurrencyCell,
      className: "word-break",
      footerCell: CustomFooterSome,
    },
  ]
  return (
    <>
      <Print
        printData={dataSource}
        columnList={tempColumnTotal}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t('مرور کل')}
      >
        <div className="row betweens">
          <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
          <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")}: </div>
          <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
          <div className="col-lg-6 col-md-6 col-6">{t("مرور کل")} : </div>
        </div>
      </Print>
    </>
  )
}
export default AccountReviewPrint_Level2









