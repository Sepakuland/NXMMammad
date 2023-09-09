import React, { useEffect, useRef, useState } from 'react'
import Print from 'sepakuland-component-print'
import { useTranslation } from 'react-i18next'
import  { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useGetAllCustomerChosenCodingDetailsMoein_WithGroupForPrintQuery } from '../../../../../features/slices/customerChosenCodingSlice'
import Guid from "devextreme/core/guid";
import { CircularProgress } from '@mui/material'


const AccountingReviewPrint_Level9 = () => {
    const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`))
    const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
    const selectedAccountingReview9 = JSON.parse(localStorage.getItem(`selectedAccountingReview9`))
    const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
    const id = JSON.parse(localStorage.getItem(`id`))
    const [dataSource, setDataSource] = useState([])
    let Remainder;
    const [content, setContent] = useState("")
    const { t, i18n } = useTranslation();
    const dataRef = useRef()
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    /* -------------------------------------------------------------------------- */
    /*                  Get Customer chosenCoding detailed Moein                  */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level == 4 || tempIndex[indexRef - 1]?.level == 5 || tempIndex[indexRef - 1]?.level == 6 || tempIndex[indexRef - 1] == 7 || tempIndex[indexRef - 1] == 9) {
            setAllCustomerChosenCodingDetailsMoeinSkip(true)
            dataRef.current = selectedAccountingReview9;
        } else {
            setAllCustomerChosenCodingDetailsMoeinSkip(false)
            dataRef.current = dataSource;
        }
    }, [tempIndex[indexRef], dataSource, selectedAccountingReview9])
    const [allCustomerChosenCodingDetailsMoeinSkip, setAllCustomerChosenCodingDetailsMoeinSkip] = useState(true);
    const { data: AllCustomerChosenCodingDetailsMoeinResult, isFetching: AllCustomerChosenCodingDetailsMoeinIsFetching, error: AllCustomerChosenCodingDetailsMoeinError,
    } = useGetAllCustomerChosenCodingDetailsMoein_WithGroupForPrintQuery({ id: id, querySearchParams: querySearchParams }, { skip: allCustomerChosenCodingDetailsMoeinSkip });

    useEffect(() => {
        if (AllCustomerChosenCodingDetailsMoeinIsFetching) {
            setContent(<CircularProgress />)
        } else if (AllCustomerChosenCodingDetailsMoeinError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = AllCustomerChosenCodingDetailsMoeinResult?.data?.map((data, index) => {
                let accountingDocumentArticleCredits = data?.credits?.reduce(
                    (acc, current) => acc + current,
                    0
                );
                let accountingDocumentArticleDebits = data?.debits?.reduce(
                    (acc, current) => acc + current,
                    0
                );

                Remainder = accountingDocumentArticleDebits - accountingDocumentArticleCredits
                return {
                    "id": new Guid(),
                    "formersNames": data?.formersNames,
                    "AccountCodeGroup": "",
                    "AccountNameGroup": "",
                    "AccountCodeTotal": "",
                    "AccountNameTotal": "",
                    "AccountCodeSpecific": data?.code,
                    "AccountNameSpecific": data?.name,
                    "AccountCodeEntity4": "",
                    "AccountCodeEntity5": "",
                    "AccountCodeEntity6": "",
                    "CycleDebtor": accountingDocumentArticleDebits,
                    "CycleCreditor": accountingDocumentArticleCredits,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "CompleteCode": data?.completeCode,
                    "CodingId": data?.codingId,
                }
            })
            setDataSource(tempData);
            dataRef.current = tempData

        }
    }, [AllCustomerChosenCodingDetailsMoeinIsFetching, AllCustomerChosenCodingDetailsMoeinResult])

    useEffect(() => {
        setAllCustomerChosenCodingDetailsMoeinSkip(false)
    }, [querySearchParams])
    let tempColumn = [
        {
            field: 'CompleteCode',
            filterable: false,
            width: '60px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameSpecific",
            name: "مرور ریز معین",
            filterable: true,
            width: '80px',
        },
        {
            field: 'CycleDebtor',
            filterable: true,
            name: "جمع بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'CycleCreditor',
            filterable: true,
            name: "جمع بستانکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'RemainderDebtor',
            filterable: true,
            name: "مانده بدهکار",
            filter: 'numeric',
            width: '100px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
        {
            field: 'RemainderCreditor',
            filterable: true,
            name: "مانده بستانکار",
            filter: 'numeric',
            width: '90px',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        },
    ]
    return (
        <>
            <Print
                printData={
                    tempIndex[indexRef - 1]?.level == 4 ||
                        tempIndex[indexRef - 1]?.level == 5 ||
                        tempIndex[indexRef - 1]?.level == 6 ||
                        tempIndex[indexRef - 1]?.level == 7 ||
                        tempIndex[indexRef - 1]?.level == 8 ||
                        tempIndex[indexRef - 1]?.level == 9
                        ? selectedAccountingReview9 : dataSource}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t('مرور حساب')}
            >
                <div className="row betweens">
                    <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")}: </div>
                    <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور ریز معین")} : </div>
                </div>
            </Print>


        </>
    )
}

export default AccountingReviewPrint_Level9
