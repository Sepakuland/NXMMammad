import React, { useEffect, useRef, useState } from 'react'
import Print from 'sepakuland-component-print'
import { useTranslation } from 'react-i18next'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useGetAllCustomerChosenCodingDetailsTotalForPrintQuery } from '../../../../../features/slices/customerChosenCodingSlice'
import Guid from "devextreme/core/guid";
import { CircularProgress } from '@mui/material'


const AccountingReviewPrint_Level8 = () => {
    const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`))
    const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
    const selectedAccountingReview8 = JSON.parse(localStorage.getItem(`selectedAccountingReview8`))
    const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
    const id = JSON.parse(localStorage.getItem(`id`))
    const [dataSource, setDataSource] = useState([])
    let Remainder;
    const [content, setContent] = useState("")
    const { t, i18n } = useTranslation();
    const dataRef = useRef()

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    /* -------------------------------------------------------------------------- */
    /*                  Get Customer chosenCoding detailed Total                  */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {

        if (tempIndex[indexRef - 1]?.level == 4 || tempIndex[indexRef - 1]?.level == 5 || tempIndex[indexRef - 1]?.level == 6 || tempIndex[indexRef - 1] == 7) {
            setAllCustomerChosenCodingDetailsTotalSkip(true)
            dataRef.current = selectedAccountingReview8;
        } else {
            setAllCustomerChosenCodingDetailsTotalSkip(false)
            dataRef.current = dataSource;
        }


    }, [tempIndex[indexRef], dataSource, selectedAccountingReview8])
    const [allCustomerChosenCodingDetailsTotalSkip, setAllCustomerChosenCodingDetailsTotalSkip] = useState(true);
    const { data: AllCustomerChosenCodingDetailsTotalResult, isFetching: AllCustomerChosenCodingDetailsTotalIsFetching, error: AllCustomerChosenCodingDetailsTotalError,
    } = useGetAllCustomerChosenCodingDetailsTotalForPrintQuery({ id: id, querySearchParams: querySearchParams }, { skip: allCustomerChosenCodingDetailsTotalSkip });
    useEffect(() => {
        if (AllCustomerChosenCodingDetailsTotalIsFetching) {
            setContent(<CircularProgress />)
        } else if (AllCustomerChosenCodingDetailsTotalError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = AllCustomerChosenCodingDetailsTotalResult?.data?.map((data, index) => {
                Remainder = data?.debits - data?.credits
                return {
                    "id": new Guid(),
                    "formersNames": data?.formersNames,
                    "AccountCodeGroup": "",
                    "AccountNameGroup": "",
                    "AccountCodeTotal": data?.code,
                    "AccountNameTotal": data?.name,
                    "AccountCodeSpecific": "",
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
            dataRef.current = tempData

        }
    }, [AllCustomerChosenCodingDetailsTotalIsFetching, AllCustomerChosenCodingDetailsTotalResult])

    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level == 4 || tempIndex[indexRef - 1]?.level == 5 || tempIndex[indexRef - 1]?.level == 6 || tempIndex[indexRef - 1] == 7 && querySearchParams?.length > 0) {
            setAllCustomerChosenCodingDetailsTotalSkip(false)
        }
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
            field: "AccountNameTotal",
            name: "مرور ریز کل",
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
                printData={tempIndex[indexRef - 1]?.level == 4 || tempIndex[indexRef - 1]?.level == 5 || tempIndex[indexRef - 1]?.level == 6
                    || tempIndex[indexRef - 1]?.level == 7 ? selectedAccountingReview8 : dataSource}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزییات")}
                subTitle={t('مرور حساب')}
            >
                <div className="row betweens">
                    <div className="col-lg-6 col-md-6 col-6">{t("تاریخ")} :  </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("تفضیلی")}: </div>
                    <div className="col-lg-6 col-md-6 col-6"> {t("همه اسناد")} : </div>
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور ریز کل")} : </div>
                </div>
            </Print>


        </>
    )
}

export default AccountingReviewPrint_Level8
