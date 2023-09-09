import React, { useEffect, useRef, useState } from 'react'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import Print from 'sepakuland-component-print';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useGetAllDetailedType4_WithTotalIdQuery, useGetAllDetailedType4_WithGroupIdQuery, useAllCustomerChosenCodingDetailedType4Query } from '../../../../../features/slices/detailedAccountSlice';
const AccountingReviewPrint_Level10 = () => {
    const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`))
    const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
    const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
    const selectedAccountingReview10 = JSON.parse(localStorage.getItem(`selectedAccountingReview10`))
    const id = JSON.parse(localStorage.getItem(`id`))
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const [dataSource, setDataSource] = useState([])
    const dataRef = useRef()
    dataRef.current = dataSource
    let Remainder;
    const [content, setContent] = useState("")
    /* ---------- Get Customer ChosenCoding detailed type with groupId ---------- */
    const [allDetailedType4_WithGroupIdSkip, setAllDetailedType4_WithGroupIdSkip] = useState(true);
    const { data: allDetailedType4_WithGroupIdResult, isFetching: allDetailedType4_WithGroupIdIsFetching, error: allDetailedType4_WithGroupIdError,
    } = useGetAllDetailedType4_WithGroupIdQuery({ id: id, querySearchParams: querySearchParams }, { skip: allDetailedType4_WithGroupIdSkip });
    /* ----------- Get Customer ChosenCoding detailed type with total ----------- */
    const [allDetailedType4_WithTotalIdSkip, setAllDetailedType4_WithTotalIdSkip] = useState(true);
    const { data: allDetailedType4_WithTotalIdResult, isFetching: allDetailedType4_WithTotalIdIsFetching, error: allDetailedType4_WithTotalIdError,
    } = useGetAllDetailedType4_WithTotalIdQuery({ id: id, querySearchParams: querySearchParams }, { skip: allDetailedType4_WithTotalIdSkip });
    /* ----------- Get Customer ChosenCoding detailed type with Moein ----------- */
    const [allDetailedType4_WithMoeinIdSkip, setAllDetailedType4_WithMoeinIdSkip] = useState(true);
    const { data: allDetailedType4_WithMoeinIdResult, isFetching: allDetailedType4_WithMoeinIdIsFetching, error: allDetailedType4_WithMoeinIdError,
    } = useAllCustomerChosenCodingDetailedType4Query({ id: id, querySearchParams: querySearchParams }, { skip: allDetailedType4_WithMoeinIdSkip });
    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level === 1) {
            if (allDetailedType4_WithGroupIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType4_WithGroupIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType4_WithGroupIdResult?.data?.map((data) => {
                    Remainder = data?.debits - data?.credits
                    return {
                        "id": new Guid(),
                        "AccountCodeGroup": data?.codingParentParent?.code,
                        "AccountNameGroup": data?.codingParentParent?.name,
                        "AccountCodeTotal": data?.codingParent?.code,
                        "AccountNameTotal": data?.codingParent?.name,
                        "AccountCodeSpecific": data?.code,
                        "AccountNameSpecific": data?.name,
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
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
        }
        else if (tempIndex[indexRef - 1]?.level === 2) {
            if (allDetailedType4_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType4_WithTotalIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType4_WithTotalIdResult?.data?.map((data) => {
                    Remainder = data?.debits - data?.credits
                    return {
                        "id": new Guid(),
                        "AccountCodeGroup": data?.codingParentParent?.code,
                        "AccountNameGroup": data?.codingParentParent?.name,
                        "AccountCodeTotal": data?.codingParent?.code,
                        "AccountNameTotal": data?.codingParent?.name,
                        "AccountCodeSpecific": data?.code,
                        "AccountNameSpecific": data?.name,
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
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
        }
        else if (tempIndex[indexRef - 1]?.level === 3) {
            if (allDetailedType4_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType4_WithMoeinIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType4_WithMoeinIdResult?.data?.map((data) => {
                    Remainder = data?.debits - data?.credits
                    return {
                        "id": new Guid(),
                        "AccountCodeGroup": data?.codingParentParent?.code,
                        "AccountNameGroup": data?.codingParentParent?.name,
                        "AccountCodeTotal": data?.codingParent?.code,
                        "AccountNameTotal": data?.codingParent?.name,
                        "AccountCodeSpecific": data?.code,
                        "AccountNameSpecific": data?.name,
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
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
        }

    }, [allDetailedType4_WithGroupIdIsFetching, allDetailedType4_WithGroupIdResult, allDetailedType4_WithTotalIdIsFetching, allDetailedType4_WithMoeinIdResult, allDetailedType4_WithTotalIdResult, allDetailedType4_WithTotalIdIsFetching])
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level === 1) {
            setAllDetailedType4_WithGroupIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 2) {
            setAllDetailedType4_WithTotalIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 3) {
            setAllDetailedType4_WithMoeinIdSkip(false)
        } else {
            setDataSource(selectedAccountingReview10)
        }

    }, [])
    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level === 1 && querySearchParams) {
            setAllDetailedType4_WithGroupIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 2 && querySearchParams) {
            setAllDetailedType4_WithTotalIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 3 && querySearchParams) {
            setAllDetailedType4_WithMoeinIdSkip(false)
        }
    }, [querySearchParams])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    /* -------------------------------------------------------------------------- */
    let tempColumn = [
        {
            field: 'AccountCodeEntity4',
            filterable: false,
            width: '90px',
            name: "کد",
            // cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'AccountNameEntity4',
            filterable: false,
            name: "مرور ریزتفضیلی4",
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
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور ریزتفضیلی4")} : </div>
                </div>
            </Print>
        </>
    )
}
export default AccountingReviewPrint_Level10
