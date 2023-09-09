import React, { useEffect, useRef, useState } from 'react'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import Print from 'sepakuland-component-print';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useAllCustomerChosenCodingDetailedType5Query } from '../../../../../features/slices/detailedAccountSlice';


const AccountingReviewPrint_Level5 = () => {
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
    const [AllCustomerChosenCodingDetailedType5Skip, setAllCustomerChosenCodingDetailedType5Skip] = useState(false);
    const { data: AllCustomerChosenCodingDetailedType5Result, isFetching: AllCustomerChosenCodingDetailedType5IsFetching, error: AllCustomerChosenCodingDetailedType5Error,
    } = useAllCustomerChosenCodingDetailedType5Query(querySearchParams, { skip: AllCustomerChosenCodingDetailedType5Skip });
    useEffect(() => {
        if (AllCustomerChosenCodingDetailedType5IsFetching) {
            setContent(<CircularProgress />)
        } else if (AllCustomerChosenCodingDetailedType5Error) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = AllCustomerChosenCodingDetailedType5Result?.data?.map((data) => {
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
                    "AccountNameEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                    "AccountCodeEntity4": data?.detailedTypes4[0]?.detailedTitle,
                    "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                    "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                    "AccountCodeEntity6": "",
                    "AccountNameEntity6": "",
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
    }, [AllCustomerChosenCodingDetailedType5IsFetching, AllCustomerChosenCodingDetailedType5Result])
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        if (querySearchParams?.length > 0) {
            setAllCustomerChosenCodingDetailedType5Skip(false)
        }
    }, [querySearchParams])
    useEffect(() => {
        if (!!dataSource?.length) {
            setAllCustomerChosenCodingDetailedType5Skip(true)
        }
    }, [dataSource])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    /* -------------------------------------------------------------------------- */
    let tempColumn = [
        {
            field: 'AccountCodeEntity5',
            filterable: false,
            width: '50px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity5",
            name: "مرور تفضیلی5",
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
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور تفضیلی5")} : </div>
                </div>
            </Print>
        </>
    )
}

export default AccountingReviewPrint_Level5
