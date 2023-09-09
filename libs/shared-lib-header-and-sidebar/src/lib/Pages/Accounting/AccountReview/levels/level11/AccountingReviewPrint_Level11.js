import React, { useEffect, useRef, useState } from 'react'
import {CurrencyCell, FooterSome,TotalTitle } from "rkgrid";
import Print from 'sepakuland-component-print';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoddingIcon from "../../../../../assets/images/Logo/CoddingIcon.jpg";
import { useAllCustomerChosenCodingDetailedType5Query, useGetAllDetailedType5_WithGroupIdQuery, useGetAllDetailedType5_WithTotalIdQuery } from '../../../../../features/slices/detailedAccountSlice';
const AccountingReviewPrint_Level11 = () => {

    const tempIndex = JSON.parse(localStorage.getItem(`tempIndex`))
    const indexRef = JSON.parse(localStorage.getItem(`indexRef`))
    const querySearchParams = JSON.parse(localStorage.getItem(`querySearchParams`))
    const selectedAccountingReview = JSON.parse(localStorage.getItem(`selectedAccountingReview`))
    const id = JSON.parse(localStorage.getItem(`id`))
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const [dataSource, setDataSource] = useState([])
    const dataRef = useRef()
    dataRef.current = dataSource
    let Remainder;
    const [content, setContent] = useState("")

    /* ---------- Get Customer ChosenCoding detailed type with groupId ---------- */
    const [allDetailedType5_WithGroupIdSkip, setAllDetailedType5_WithGroupIdSkip] = useState(true);
    const { data: allDetailedType5_WithGroupIdResult, isFetching: allDetailedType5_WithGroupIdIsFetching, error: allDetailedType5_WithGroupIdError,
    } = useGetAllDetailedType5_WithGroupIdQuery({ id: id, querySearchParams: querySearchParams }, { skip: allDetailedType5_WithGroupIdSkip });
    /* ----------- Get Customer ChosenCoding detailed type with total ----------- */
    const [allDetailedType5_WithTotalIdSkip, setAllDetailedType5_WithTotalIdSkip] = useState(true);
    const { data: allDetailedType5_WithTotalIdResult, isFetching: allDetailedType5_WithTotalIdIsFetching, error: allDetailedType5_WithTotalIdError,
    } = useGetAllDetailedType5_WithTotalIdQuery({ id: id, querySearchParams: querySearchParams }, { skip: allDetailedType5_WithTotalIdSkip });
    /* ----------- Get Customer ChosenCoding detailed type with Moein ----------- */
    const [allDetailedType5_WithMoeinIdSkip, setAllDetailedType5_WithMoeinIdSkip] = useState(true);
    const { data: allDetailedType5_WithMoeinIdResult, isFetching: allDetailedType5_WithMoeinIdIsFetching, error: allDetailedType5_WithMoeinIdError,
    } = useAllCustomerChosenCodingDetailedType5Query({ id: id, querySearchParams: querySearchParams }, { skip: allDetailedType5_WithMoeinIdSkip });
    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level === 1) {
            if (allDetailedType5_WithGroupIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType5_WithGroupIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType5_WithGroupIdResult?.data?.map((data) => {
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
            if (allDetailedType5_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType5_WithTotalIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType5_WithTotalIdResult?.data?.map((data) => {
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
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
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
            if (allDetailedType5_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType5_WithMoeinIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType5_WithMoeinIdResult?.data?.map((data) => {
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
                        "AccountCodeGroup": data?.codingParentParent?.code,
                        "AccountNameGroup": data?.codingParentParent?.name,
                        "AccountCodeTotal": data?.codingParent?.code,
                        "AccountNameTotal": data?.codingParent?.name,
                        "AccountCodeSpecific": data?.code,
                        "AccountNameSpecific": data?.name,
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                        "AccountCodeEntity6": "",
                        "AccountNameEntity6": "",
                        "formersNames": data?.formersNames,
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
        }
        else if ((tempIndex[indexRef - 1]?.level == 4 || tempIndex[indexRef - 1]?.level == 5 || tempIndex[indexRef - 1]?.level == 10 || tempIndex[indexRef - 1]?.level == 11) && selectedAccountingReview?.length > 0) {
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
    }, [allDetailedType5_WithGroupIdIsFetching, allDetailedType5_WithMoeinIdIsFetching,
        allDetailedType5_WithGroupIdResult, allDetailedType5_WithTotalIdIsFetching,
        allDetailedType5_WithMoeinIdResult, allDetailedType5_WithTotalIdResult, allDetailedType5_WithTotalIdIsFetching, selectedAccountingReview])
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level === 1) {
            setAllDetailedType5_WithGroupIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 2) {
            setAllDetailedType5_WithTotalIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 3) {
            setAllDetailedType5_WithMoeinIdSkip(false)
        }
    }, [])

    useEffect(() => {
        if (tempIndex[indexRef - 1]?.level === 1 && querySearchParams) {
            setAllDetailedType5_WithGroupIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 2 && querySearchParams) {
            setAllDetailedType5_WithTotalIdSkip(false)
        }
        else if (tempIndex[indexRef - 1]?.level === 3 && querySearchParams) {
            setAllDetailedType5_WithMoeinIdSkip(false)
        }
    }, [querySearchParams])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    /* -------------------------------------------------------------------------- */
    let tempColumn = [
        {
            field: 'AccountCodeEntity5',
            filterable: false,
            width: '90px',
            name: "کد",
            // cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'AccountNameEntity5',
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
                    <div className="col-lg-6 col-md-6 col-6">{t("مرور ریز تفضیلی5")} : </div>
                </div>
            </Print>
        </>
    )
}
export default AccountingReviewPrint_Level11
