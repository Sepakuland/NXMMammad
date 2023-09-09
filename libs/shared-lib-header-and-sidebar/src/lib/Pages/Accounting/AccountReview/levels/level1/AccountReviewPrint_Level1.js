import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import { FooterSome, CurrencyCell, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useGetAllCustomerChosenCodingsWithMoeinAccounts_GroupQuery } from '../../../../../features/slices/customerChosenCodingSlice';
import Guid from "devextreme/core/guid";
import { CircularProgress } from '@mui/material';


const AccountReviewPrint_Level1 = () => {

  const level = JSON.parse(localStorage.getItem(`level`))
  const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
  const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')
  const [data, setData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const dataRef = useRef()
  const dataRef1 = useRef()
  const dataRef2 = useRef()
  dataRef.current = data
  let Remainder;
  const [content, setContent] = useState("")

  /* -------------------------------------------------------------------------- */
  /*                             Get Data For Print                             */
  /* -------------------------------------------------------------------------- */
  /* --------------------- Get Customer chosenCoding Group -------------------- */
  const [groupSkip, setGroupSkip] = useState(false);
  const { data: customerGroupResult, isFetching: customersGroupIsFetching, error: customersGroupError, isLoading: customerGroupLoading
  } = useGetAllCustomerChosenCodingsWithMoeinAccounts_GroupQuery(querySearchParams, { skip: groupSkip });
  useEffect(() => {
    if (customersGroupIsFetching) {
      setContent(<CircularProgress />)
    } else if (customersGroupError) {
      setContent(t("خطایی رخ داده است"))
    } else {
      setContent("")
      let tempData = customerGroupResult?.data.map((data) => {
        Remainder = data?.accountingDocumentArticleDebits - data?.accountingDocumentArticleCredits
        return {
          "id": new Guid(),
          "formersNames": data?.formersNames,
          "AccountCodeSpecific": "",
          "AccountCodeTotal": "",
          "AccountCodeGroup": data?.code,
          "AccountNameGroup": data?.name,
          "AccountNameTotal": "",
          "AccountNameSpecific": "",
          "AccountCodeEntity4": "",
          "AccountCodeEntity5": "",
          "AccountCodeEntity6": "",
          "CycleDebtor": data?.accountingDocumentArticleDebits,
          "CycleCreditor": data?.accountingDocumentArticleCredits,
          "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
          "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
          "CompleteCode": data?.completeCode,
          "CodingId": data?.codingId,
        }
      })
      setDataSource(tempData);
      dataRef.current = tempData;

    }
  }, [customersGroupIsFetching, customerGroupResult])

  /* ----------------------------- Request Manager ---------------------------- */
  useEffect(() => {
    if (!!dataSource?.length) {
      setGroupSkip(true)
    }
  }, [dataSource])

  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  /* -------------------------------------------------------------------------- */
  let tempColumn = [
    {
      field: 'CompleteCode',
      filterable: false,
      width: '90px',
      name: "کد",
      cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false
    },
    {
      field: 'AccountNameGroup',
      filterable: false,
      name: "مرور گروه",
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

      {customerGroupLoading ? <CircularProgress style={{
        width: "80px",
        height: "80px",
        margin: "200px 825px"
      }} /> : <Print
        printData={dataSource}
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t('مرور حساب')}

      >
        <div className="row betweens">
          <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
          <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")}: </div>
          <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
          <div className="col-lg-6 col-md-6 col-6">{t("مرور گروه")} : </div>
        </div>

      </Print>}

    </>
  )
}
export default AccountReviewPrint_Level1









