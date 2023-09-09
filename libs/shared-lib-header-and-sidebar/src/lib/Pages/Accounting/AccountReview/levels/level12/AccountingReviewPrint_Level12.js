import React, { useEffect, useRef, useState } from 'react'
import {FooterSome, TotalTitle,CurrencyCell } from "rkgrid";
import Print from 'sepakuland-component-print';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useAllCustomerChosenCodingDetailedType6Query, useGetAllDetailedType6_WithGroupIdQuery, useGetAllDetailedType6_WithTotalIdQuery } from '../../../../../features/slices/detailedAccountSlice';
const AccountingReviewPrint_Level12 = () => {

  const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`))
  const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
  const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
  const selectedAccountingReview = JSON.parse(localStorage.getItem(`selectedAccountingReview`))
  const id = JSON.parse(localStorage.getItem(`id`))
  const { t, i18n } = useTranslation();
  const [dataSource, setDataSource] = useState([])
  const dataRef = useRef()
  dataRef.current = dataSource
  let Remainder;
  const [content, setContent] = useState("")
  /* ----------------------------- Request Manager ---------------------------- */
  useEffect(() => {
    if (tempIndex[indexRef - 1]?.level == 7 || tempIndex[indexRef - 1]?.level == 8 || tempIndex[indexRef - 1]?.level == 9 || tempIndex[indexRef - 1]?.level == 3) {
      setCustomerChosenCodingType6Skip(false)
    }
    else if (tempIndex[indexRef - 1]?.level == 1) {
      setGetDetailedType6_WithGroupIdSkip(false)
    }
    else if (tempIndex[indexRef - 1]?.level === 2) {
      setGetDetailedType6_WithTotalIdSkip(false)
    }
  }, [])

  useEffect(() => {
    if ((tempIndex[indexRef - 1]?.level == 7 || tempIndex[indexRef - 1]?.level == 8 || tempIndex[indexRef - 1]?.level == 9 || tempIndex[indexRef - 1]?.level == 3) && querySearchParams) {
      setCustomerChosenCodingType6Skip(false)
    }
    else if (tempIndex[indexRef - 1]?.level == 1 && querySearchParams) {
      setGetDetailedType6_WithGroupIdSkip(false)
    }
    else if (tempIndex[indexRef - 1]?.level === 2 && querySearchParams) {
      setGetDetailedType6_WithTotalIdSkip(false)
    }
  }, [querySearchParams])
  /* -------------------------------------------------------------------------- */
  /*                      Get Customer Chosen Coding Type 6                     */
  /* -------------------------------------------------------------------------- */

  /* ----------------------- get detailed with moein id ----------------------- */
  const [customerChosenCodingType6Skip, setCustomerChosenCodingType6Skip] = useState(true);
  const { data: CustomerChosenCodingType6Result, isFetching: CustomerChosenCodingType6IsFetching, error: CustomerChosenCodingType6Error
  } = useAllCustomerChosenCodingDetailedType6Query({ id: id, querySearchParams: querySearchParams }, { skip: customerChosenCodingType6Skip });
  /* ----------------------- get detailed with group id ----------------------- */
  const [GetDetailedType6_WithGroupIdSkip, setGetDetailedType6_WithGroupIdSkip] = useState(true);
  const { data: GetDetailedType6_WithGroupIdResult, isFetching: GetDetailedType6_WithGroupIdIsFetching, error: GetDetailedType6_WithGroupIdError
  } = useGetAllDetailedType6_WithGroupIdQuery({ id: id, querySearchParams: querySearchParams }, { skip: GetDetailedType6_WithGroupIdSkip });
  /* ----------------------- get detailed with total id ----------------------- */

  const [GetDetailedType6_WithTotalIdSkip, setGetDetailedType6_WithTotalIdSkip] = useState(true);
  const { data: GetDetailedType6_WithTotalIdResult, isFetching: GetDetailedType6_WithTotalIdIsFetching, error: GetDetailedType6_WithTotalIdError
  } = useGetAllDetailedType6_WithTotalIdQuery({ id: id, querySearchParams: querySearchParams }, { skip: GetDetailedType6_WithTotalIdSkip });

  useEffect(() => {
    if (tempIndex[indexRef - 1]?.level == 7 || tempIndex[indexRef - 1]?.level == 8 || tempIndex[indexRef - 1]?.level == 9 || tempIndex[indexRef - 1]?.level == 3) {

      if (CustomerChosenCodingType6IsFetching) {
        setContent(<CircularProgress />)
      } else if (CustomerChosenCodingType6Error) {
        setContent(t("خطایی رخ داده است"))
      } else {
        setContent("")

        if (tempIndex[indexRef - 1]?.level === 7) {
          let tempData = CustomerChosenCodingType6Result?.data?.map((data) => {
            let creditTotal = data?.credits?.reduce(
              (acc, current) => acc + current,
              0
            );
            let debitTotal = data?.debits?.reduce(
              (acc, current) => acc + current,
              0
            );
            Remainder = debitTotal - creditTotal
            return {
              "id": new Guid(),
              "formersNames": data?.formersNames,
              "AccountCodeGroup": data?.codingParentParent?.code,
              "AccountNameGroup": data?.codingParentParent?.name,
              "AccountCodeTotal": data?.codingParent?.code,
              "AccountNameTotal": data?.codingParent?.name,
              "AccountCodeSpecific": data?.code,
              "AccountNameSpecific": data?.name,
              "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
              "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
              "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
              "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
              "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
              "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
              "CycleDebtor": debitTotal,
              "CycleCreditor": creditTotal,
              "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
              "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
              "CompleteCode": data?.completeCode,
              "CodingId": data?.codingId,
            }
          })
          setDataSource(tempData);
          dataRef.current = tempData
        }
        else if (tempIndex[indexRef - 1]?.level === 8) {
          let tempData = CustomerChosenCodingType6Result?.data?.map((data) => {
            let creditTotal = data?.credits?.reduce(
              (acc, current) => acc + current,
              0
            );
            let debitTotal = data?.debits?.reduce(
              (acc, current) => acc + current,
              0
            );
            Remainder = debitTotal - creditTotal
            return {
              "id": new Guid(),
              "formersNames": "",
              "AccountCodeGroup": data?.codingParentParent?.code,
              "AccountNameGroup": data?.codingParentParent?.name,
              "AccountCodeTotal": data?.codingParent?.code,
              "AccountNameTotal": data?.codingParent?.name,
              "AccountCodeSpecific": "",
              "AccountNameSpecific": "",
              "AccountNameEntity4": "",
              "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
              "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
              "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
              "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
              "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
              "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
              "CycleDebtor": debitTotal,
              "CycleCreditor": creditTotal,
              "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
              "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
              "AccountCompleteCode": "",
              "CodingId": data?.codingId,
            }
          })
          setDataSource(tempData);
          dataRef.current = tempData
        }
        else if (tempIndex[indexRef - 1]?.level === 9) {
          let tempData = CustomerChosenCodingType6Result?.data?.map((data) => {
            let creditTotal = data?.credits?.reduce(
              (acc, current) => acc + current,
              0
            );
            let debitTotal = data?.debits?.reduce(
              (acc, current) => acc + current,
              0
            );
            Remainder = debitTotal - creditTotal
            return {
              "id": new Guid(),
              "formersNames": "",
              "AccountCodeGroup": data?.codingParentParent?.code,
              "AccountNameGroup": data?.codingParentParent?.name,
              "AccountCodeTotal": data?.codingParent?.code,
              "AccountNameTotal": data?.codingParent?.name,
              "AccountCodeSpecific": data?.code,
              "AccountNameSpecific": data?.name,
              "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
              "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
              "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
              "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
              "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
              "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
              "CycleDebtor": debitTotal,
              "CycleCreditor": creditTotal,
              "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
              "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
              "AccountCompleteCode": "",
              "CodingId": data?.codingId,
            }
          })
          setDataSource(tempData);
          dataRef.current = tempData
        }
        else if (tempIndex[indexRef - 1]?.level === 10) {

          let tempData = CustomerChosenCodingType6Result?.data?.map((data) => {
            let creditTotal = data?.credits?.reduce(
              (acc, current) => acc + current,
              0
            );
            let debitTotal = data?.debits?.reduce(
              (acc, current) => acc + current,
              0
            );
            Remainder = debitTotal - creditTotal
            return {
              "id": new Guid(),
              "formersNames": "",
              "AccountCodeGroup": data?.codingParentParent?.code,
              "AccountNameGroup": data?.codingParentParent?.name,
              "AccountCodeTotal": data?.codingParent?.code,
              "AccountNameTotal": data?.codingParent?.name,
              "AccountCodeSpecific": data?.code,
              "AccountNameSpecific": data?.name,
              "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
              "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
              "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
              "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
              "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
              "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
              "CycleDebtor": debitTotal,
              "CycleCreditor": creditTotal,
              "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
              "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
              "AccountCompleteCode": "",
              "CodingId": data?.codingId,
            }
          })
          setDataSource(tempData);
          dataRef.current = tempData
        }
        else if (tempIndex[indexRef - 1]?.level === 11) {

          let tempData = CustomerChosenCodingType6Result?.data?.map((data) => {
            let creditTotal = data?.credits?.reduce(
              (acc, current) => acc + current,
              0
            );
            let debitTotal = data?.debits?.reduce(
              (acc, current) => acc + current,
              0
            );
            Remainder = debitTotal - creditTotal
            return {
              "id": new Guid(),
              "formersNames": "",
              "AccountCodeGroup": data?.codingParentParent?.code,
              "AccountNameGroup": data?.codingParentParent?.name,
              "AccountCodeTotal": data?.codingParent?.code,
              "AccountNameTotal": data?.codingParent?.name,
              "AccountCodeSpecific": data?.code,
              "AccountNameSpecific": data?.name,
              "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
              "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
              "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
              "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
              "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
              "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
              "CycleDebtor": debitTotal,
              "CycleCreditor": creditTotal,
              "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
              "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
              "AccountCompleteCode": "",
              "CodingId": data?.codingId,
            }
          })
          setDataSource(tempData);
          dataRef.current = tempData
        }
        else if (tempIndex[indexRef - 1]?.level === 3) {
          let tempData = CustomerChosenCodingType6Result?.data?.map((data) => {
            let creditTotal = data?.credits?.reduce(
              (acc, current) => acc + current,
              0
            );
            let debitTotal = data?.debits?.reduce(
              (acc, current) => acc + current,
              0
            );
            Remainder = debitTotal - creditTotal
            return {
              "id": new Guid(),
              "formersNames": data?.formersNames,
              "AccountCodeGroup": data?.codingParentParent?.code,
              "AccountNameGroup": data?.codingParentParent?.name,
              "AccountCodeTotal": data?.codingParent?.code,
              "AccountNameTotal": data?.codingParent?.name,
              "AccountCodeSpecific": data?.code,
              "AccountNameSpecific": data?.name,
              "AccountNameEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
              "AccountCodeEntity4": data?.detailedTypes4[0]?.detailedTitle,
              "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
              "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
              "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
              "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
              "CycleDebtor": debitTotal,
              "CycleCreditor": creditTotal,
              "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
              "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
              "CompleteCode": data.completeCode,
              "CodingId": data?.codingId,
            }
          })
          setDataSource(tempData);
          dataRef.current = tempData
        }
      }

    } else if (tempIndex[indexRef - 1]?.level == 1) {

      if (GetDetailedType6_WithGroupIdIsFetching) {
        setContent(<CircularProgress />)
      } else if (GetDetailedType6_WithGroupIdError) {
        setContent(t("خطایی رخ داده است"))
      } else {
        setContent("")
        let tempData = GetDetailedType6_WithGroupIdResult?.data?.map((data) => {
          let creditTotal = data?.credits?.reduce(
            (acc, current) => acc + current,
            0
          );
          let debitTotal = data?.debits?.reduce(
            (acc, current) => acc + current,
            0
          );
          Remainder = debitTotal - creditTotal
          return {
            "id": new Guid(),
            "formersNames": data?.formersNames,
            "AccountCodeGroup": data?.codingParentParent?.code,
            "AccountNameGroup": data?.codingParentParent?.name,
            "AccountCodeTotal": data?.codingParent?.code,
            "AccountNameTotal": data?.codingParent?.name,
            "AccountCodeSpecific": data?.code,
            "AccountNameSpecific": data?.name,
            "AccountNameEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
            "AccountCodeEntity4": data?.detailedTypes4[0]?.detailedTitle,
            "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
            "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
            "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
            "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
            "CycleDebtor": debitTotal,
            "CycleCreditor": creditTotal,
            "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
            "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
            "CompleteCode": data.completeCode,
            "CodingId": data?.codingId,
          }
        })
        setDataSource(tempData);
        dataRef.current = tempData


      }


    }
    else if (tempIndex[indexRef - 1]?.level === 2) {
      let tempData = GetDetailedType6_WithTotalIdResult?.data?.map((data) => {
        let creditTotal = data?.credits?.reduce(
          (acc, current) => acc + current,
          0
        );
        let debitTotal = data?.debits?.reduce(
          (acc, current) => acc + current,
          0
        );
        Remainder = debitTotal - creditTotal
        return {
          "id": new Guid(),
          "formersNames": data?.formersNames,
          "AccountCodeGroup": data?.codingParentParent?.code,
          "AccountNameGroup": data?.codingParentParent?.name,
          "AccountCodeTotal": data?.codingParent?.code,
          "AccountNameTotal": data?.codingParent?.name,
          "AccountCodeSpecific": data?.code,
          "AccountNameSpecific": data?.name,
          "AccountNameEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
          "AccountCodeEntity4": data?.detailedTypes4[0]?.detailedTitle,
          "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
          "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
          "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
          "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
          "CycleDebtor": debitTotal,
          "CycleCreditor": creditTotal,
          "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
          "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
          "CompleteCode": data.completeCode,
          "CodingId": data?.codingId,
        }
      })
      setDataSource(tempData);
      dataRef.current = tempData

    }
    else if ((tempIndex[indexRef - 1]?.level == 4 || tempIndex[indexRef - 1]?.level == 5) && selectedAccountingReview?.length > 0) {
      let tempData = selectedAccountingReview?.data?.map((data) => {

        Remainder = data?.CycleDebtor - data?.CycleCreditor
        return {
          "id": new Guid(),
          "formersNames": data?.formersNames,
          "AccountCodeGroup": data?.AccountCodeGroup,
          "AccountNameGroup": data?.AccountNameGroup,
          "AccountCodeTotal": data?.AccountCodeTotal,
          "AccountNameTotal": data?.AccountNameTotal,
          "AccountCodeSpecific": data?.AccountCodeSpecific,
          "AccountNameSpecific": data?.AccountNameSpecific,
          "AccountNameEntity4": data?.AccountNameEntity4,
          "AccountCodeEntity4": data?.AccountCodeEntity4,
          "AccountCodeEntity5": data?.AccountCodeEntity5,
          "AccountNameEntity5": data?.AccountNameEntity5,
          "AccountCodeEntity6": data?.AccountCodeEntity6,
          "AccountNameEntity6": data?.AccountNameEntity6,
          "CycleDebtor": data?.CycleDebtor,
          "CycleCreditor": data?.CycleCreditor,
          "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
          "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
          "CompleteCode": data.CompleteCode,
          "CodingId": data?.CodingId,
        }
      })
      setDataSource(tempData);
      dataRef.current = tempData
    }
  }, [CustomerChosenCodingType6IsFetching, GetDetailedType6_WithTotalIdResult, GetDetailedType6_WithTotalIdIsFetching, selectedAccountingReview
    , GetDetailedType6_WithGroupIdIsFetching, CustomerChosenCodingType6Result, GetDetailedType6_WithGroupIdResult, selectedAccountingReview])

  const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
  let tempColumn = [
    {
      field: 'AccountCodeEntity6',
      filterable: false,
      width: '90px',
      name: "کد",
      // cell: IndexCell,
      sortable: false,
      footerCell: TotalTitle,
      reorderable: false
    },
    {
      field: 'AccountNameEntity6',
      filterable: false,
      name: "مرور ریزتفضیلی5",
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
        columnList={tempColumn}
        logo={CoddingIcon}
        title={t("نمایش جزییات")}
        subTitle={t('مرور حساب')}
      >
        <div className="row betweens">
          <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
          <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")}: </div>
          <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
          <div className="col-lg-6 col-md-6 col-6">{t("مرور ریز تفضیلی6")} : </div>
        </div>
      </Print>
    </>
  )
}

export default AccountingReviewPrint_Level12
