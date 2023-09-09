import React, { useEffect, useRef, useState } from 'react'

import { FooterSome,IndexCell, CurrencyCell, TotalTitle } from "rkgrid";
import Print from 'sepakuland-component-print';
import { useGetAllCustomerChosenCodingsWithMoeinAccountsForPrintQuery } from '../../../../../features/slices/customerChosenCodingSlice';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";


const AccountingReviewPrint_Level3 = () => {

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

    /* --------------------- Get Customer ChosenCoding Moein -------------------- */
    const [moeinSkip, setMoeinSkip] = useState(false);
    const { data: customerMoeinResult, isFetching: customersMoeinIsFetching, error: customersMoeinError,
    } = useGetAllCustomerChosenCodingsWithMoeinAccountsForPrintQuery(querySearchParams, { skip: moeinSkip });
    useEffect(() => {
        if (customersMoeinIsFetching) {
            setContent(<CircularProgress />)
        } else if (customersMoeinError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = customerMoeinResult?.data?.map((data, index) => {
                Remainder = data?.debits - data?.credits
                return {
                    "id": new Guid(),
                    "AccountCodeGroup": "",
                    "AccountNameGroup": "",
                    "AccountCodeTotal": "",
                    "AccountNameTotal": "",
                    "AccountCodeSpecific": data?.code,
                    "AccountNameSpecific": data?.name,
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
                    "CompleteCode": data?.completeCode,
                    "CodingId": data?.codingId,
                }
            })
            setDataSource(tempData);
            dataRef.current = tempData

        }
    }, [customersMoeinIsFetching, customerMoeinResult])
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        if (!!dataSource?.length) {
            setMoeinSkip(true)
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
            field: 'AccountNameSpecific',
            filterable: false,
            name: "مرور معین",
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
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور معین")} : </div>
                </div>
            </Print>
        </>
    )
}

export default AccountingReviewPrint_Level3
