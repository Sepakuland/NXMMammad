import React, { useEffect, useRef, useState } from 'react'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import Print from 'sepakuland-component-print';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useAllCustomerChosenCodingDetailedType6Query } from '../../../../../features/slices/detailedAccountSlice';


const AccountingReviewPrint_Level6 = () => {
    const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
    const { t, i18n } = useTranslation();
    const [dataSource, setDataSource] = useState([])
    const dataRef = useRef()
    dataRef.current = dataSource
    let Remainder;
    const [content, setContent] = useState("")


    /* --------------------- Get Customer ChosenCoding Detailed Type 6 -------------------- */
    const [AllCustomerChosenCodingDetailedType6Skip, setAllCustomerChosenCodingDetailedType6Skip] = useState(false);
    const { data: AllCustomerChosenCodingDetailedType6Result, isFetching: AllCustomerChosenCodingDetailedType6IsFetching, error: AllCustomerChosenCodingDetailedType6Error,
    } = useAllCustomerChosenCodingDetailedType6Query(querySearchParams, { skip: AllCustomerChosenCodingDetailedType6Skip });
    useEffect(() => {
        if (AllCustomerChosenCodingDetailedType6IsFetching) {
            setContent(<CircularProgress />)
        } else if (AllCustomerChosenCodingDetailedType6Error) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = AllCustomerChosenCodingDetailedType6Result?.data?.map((data) => {
        
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
                    "AccountCodeEntity6": data?.detailedTypes6[0]?.firstDetailedCode,
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
    }, [AllCustomerChosenCodingDetailedType6IsFetching, AllCustomerChosenCodingDetailedType6Result])
    /* ----------------------------- Request Manager ---------------------------- */

    useEffect(() => {
        if (!!dataSource?.length) {
            setAllCustomerChosenCodingDetailedType6Skip(true)
        }
    }, [dataSource])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    useEffect(() => {
        if (querySearchParams?.length > 0) {
            setAllCustomerChosenCodingDetailedType6Skip(false)
        }
    }, [querySearchParams])
    /* -------------------------------------------------------------------------- */
    let tempColumn = [
        {
            field: 'AccountCodeEntity6',
            filterable: false,
            width: '60px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity6",
            name: "مرور تفضیلی6",
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
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور تفضیلی6")} : </div>
                </div>
            </Print>
        </>
    )
}

export default AccountingReviewPrint_Level6
