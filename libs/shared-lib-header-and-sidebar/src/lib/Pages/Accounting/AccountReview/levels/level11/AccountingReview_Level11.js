import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import { useAllCustomerChosenCodingDetailedType5Query, useCustomerChosenCodingDetailedType5Query, useGetAllDetailedType5_WithGroupIdQuery, useGetAllDetailedType5_WithTotalIdQuery, useGetDetailedType5_WithGroupIdQuery, useGetDetailedType5_WithTotalIdQuery } from '../../../../../features/slices/detailedAccountSlice';

const AccountingReview_Level11 = ({ location, id, GetSelectedId, lastLevel, selectedAccountingReview, GetAccountingReview, querySearchParams, GetStatus }) => {
    const { t, i18n } = useTranslation();
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    let Remainder;
    const params = new URLSearchParams(location)
    const obj = Object.fromEntries(params)
    const [content, setContent] = useState("")
    const [total, setTotal] = useState(0);
    const dataRef = useRef()
    dataRef.current = datasource


    /* -------------------------------------------------------------------------- */
    /*                           table Request Manager                            */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (lastLevel == 7 || lastLevel == 8 || lastLevel == 9 || lastLevel == 10 || lastLevel == 3) {
            setCustomerChosenCodingType5Skip(false)
        }
        else if (lastLevel == 1) {
            setGetDetailedType5_WithGroupIdSkip(false)
        }
        else if (lastLevel == 2) {
            setGetDetailedType5_WithTotalIdSkip(false)
        }
    }, [lastLevel])

    useEffect(() => {
        if (datasource?.length > 0) {
            GetAccountingReview([])
        }
    }, [datasource])
    /* -------------------------------------------------------------------------- */
    /*                      Get Customer Chosen Coding Type 5                     */
    /* -------------------------------------------------------------------------- */
    /* ----------------------- get detailed with coding id ---------------------- */
    const [customerChosenCodingType5Skip, setCustomerChosenCodingType5Skip] = useState(true);
    const { data: CustomerChosenCodingType5Result, isFetching: CustomerChosenCodingType5IsFetching, error: CustomerChosenCodingType5Error, currentData: CustomerChosenCodingType5CurrentData
    } = useCustomerChosenCodingDetailedType5Query({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: customerChosenCodingType5Skip });
    /* ----------------------- get detailed with group id ----------------------- */
    const [getDetailedType5_WithGroupIdSkip, setGetDetailedType5_WithGroupIdSkip] = useState(true);
    const { data: GetDetailedType5_WithGroupIdResult, isFetching: GetDetailedType5_WithGroupIdIsFetching, error: GetDetailedType5_WithGroupIdError, currentData: GetDetailedType5_WithGroupIdCurrentData
    } = useGetDetailedType5_WithGroupIdQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: getDetailedType5_WithGroupIdSkip });
    /* ----------------------- get detailed with total id ----------------------- */
    const [getDetailedType5_WithTotalIdSkip, setGetDetailedType5_WithTotalIdSkip] = useState(true);
    const { data: GetDetailedType5_WithTotalIdResult, isFetching: GetDetailedType5_WithTotalIdIsFetching, error: GetDetailedType5_WithTotalIdError, currentData: GetDetailedType5_WithTotalIdCurrentData
    } = useGetDetailedType5_WithTotalIdQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: getDetailedType5_WithTotalIdSkip });
    useEffect(() => {
        setLoading(true)

        if (lastLevel == 1 || lastLevel == 7) {
            if (GetDetailedType5_WithGroupIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (GetDetailedType5_WithGroupIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!GetDetailedType5_WithGroupIdResult?.header) {
                    let pagination = JSON.parse(GetDetailedType5_WithGroupIdResult?.header);
                    setTotal(pagination.totalCount);
                }
                if (lastLevel === 1) {
                    let tempData = GetDetailedType5_WithGroupIdResult?.data?.map((data) => {
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
                            "DetailedTypeGuid4": data?.detailedTypes4[0]?.detailedTypeGuid,
                            "DetailedTypeGuid5": data?.detailedTypes5[0]?.detailedTypeGuid,
                            "DetailedTypeGuid6": data?.detailedTypes6[0]?.detailedTypeGuid,
                            "CycleDebtor": debitTotal,
                            "CycleCreditor": creditTotal,
                            "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                            "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                            "CompleteCode": data?.completeCode,
                            "CodingId": data?.codingId,
                            "DetailedTypeIds4": data?.detailedType4Ids,
                            "DetailedTypeIds5": data?.detailedType5Ids,
                            "DetailedTypeIds6": data?.detailedType6Ids,
                            "AccountReviewLevel": 5
                        }
                    })
                    setDatasource(tempData);
                    dataRef.current = tempData
                }
            }
        }
        else if (lastLevel == 2 || lastLevel == 8) {

            if (GetDetailedType5_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (GetDetailedType5_WithTotalIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!GetDetailedType5_WithTotalIdResult?.header) {
                    let pagination = JSON.parse(GetDetailedType5_WithTotalIdResult?.header);
                    setTotal(pagination.totalCount);
                }


                let tempData = GetDetailedType5_WithTotalIdResult?.data?.map((data) => {
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
                        "DetailedTypeGuid4": data?.detailedTypes4[0]?.detailedTypeGuid,
                        "DetailedTypeGuid5": data?.detailedTypes5[0]?.detailedTypeGuid,
                        "DetailedTypeGuid6": data?.detailedTypes6[0]?.detailedTypeGuid,
                        "CycleDebtor": debitTotal,
                        "CycleCreditor": creditTotal,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                        "DetailedTypeIds4": data?.detailedType4Ids,
                        "DetailedTypeIds5": data?.detailedType5Ids,
                        "DetailedTypeIds6": data?.detailedType6Ids,
                        "AccountReviewLevel": 5
                    }
                })
                setDatasource(tempData);
                dataRef.current = tempData
                console.log("heeeeloooooo", tempData)
            }


        }
        if (lastLevel == 9 || lastLevel == 3) {
            console.log("CustomerChosenCodingType5Result", CustomerChosenCodingType5Result)
            if (CustomerChosenCodingType5IsFetching) {
                setContent(<CircularProgress />)
            } else if (CustomerChosenCodingType5Error) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!CustomerChosenCodingType5Result?.header) {
                    let pagination = JSON.parse(CustomerChosenCodingType5Result?.header);
                    setTotal(pagination.totalCount);
                }
                if (CustomerChosenCodingType5Result?.data[0]?.detailedTypes6?.length > 1) {

                    CustomerChosenCodingType5Result?.data?.map((data) => {
                        let creditTotal = data?.credits?.reduce(
                            (acc, current) => acc + current,
                            0
                        );
                        let debitTotal = data?.debits?.reduce(
                            (acc, current) => acc + current,
                            0
                        );
                        Remainder = debitTotal - creditTotal
                        let temp = data?.detailedTypes6?.map((item, index) => {
                            return {
                                "id": new Guid(),
                                "formersNames": data?.formersNames,
                                "AccountCodeGroup": data?.codingParentParent?.code,
                                "AccountNameGroup": data?.codingParentParent?.name,
                                "AccountCodeTotal": data?.codingParent?.code,
                                "AccountNameTotal": data?.codingParent?.name,
                                "AccountCodeSpecific": data?.code,
                                "AccountNameSpecific": data?.name,
                                "AccountNameEntity4": data?.detailedTypes4[index]?.definableAccountsNumber,
                                "AccountCodeEntity4": data?.detailedTypes4[index]?.detailedTitle,
                                "AccountCodeEntity5": data?.detailedTypes5[index]?.definableAccountsNumber,
                                "AccountNameEntity5": data?.detailedTypes5[index]?.detailedTitle,
                                "AccountCodeEntity6": data?.detailedTypes6[index]?.definableAccountsNumber,
                                "AccountNameEntity6": data?.detailedTypes6[index]?.detailedTitle,
                                "CycleDebtor": debitTotal,
                                "CycleCreditor": creditTotal,
                                "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                                "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                                "CompleteCode": data.completeCode,
                                "CodingId": data?.codingId,
                                "DetailedTypeIds4": [],
                                "DetailedTypeIds5": [],
                                "DetailedTypeIds6": [],
                                "AccountReviewLevel": 6
                            }
                        })
                        setDatasource(temp);
                        dataRef.current = temp
                    })
                } else {
                    let tempData = allDetailedType5_WithTotalIdResult?.data?.map((data) => {
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
                            "DetailedTypeIds4": [],
                            "DetailedTypeIds5": [],
                            "DetailedTypeIds6": [],
                            "AccountReviewLevel": 6
                        }
                    })
                    setDatasource(tempData);
                    dataRef.current = tempData
                }




            }
            setLoading(false)
        }
        else if ((lastLevel == 6 || lastLevel == 4 || lastLevel === 10 || lastLevel === 12) && selectedAccountingReview?.length > 0) {
            let tempData = selectedAccountingReview?.map((data) => {
                console.log("data", data)
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
                    "AccountNameEntity5": data?.AccountNameEntity5,
                    "AccountCodeEntity5": data?.AccountCodeEntity5,
                    "AccountNameEntity6": data?.AccountNameEntity6,
                    "AccountCodeEntity6": data?.AccountCodeEntity6,
                    "DetailedTypeGuid4": data?.DetailedTypeGuid4,
                    "DetailedTypeGuid5": data?.DetailedTypeGuid5,
                    "DetailedTypeGuid6": data?.DetailedTypeGuid6,
                    "CycleDebtor": data?.CycleDebtor,
                    "CycleCreditor": data?.CycleCreditor,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "CompleteCode": data?.CompleteCode,
                    "CodingId": data?.CodingId,
                    "DetailedTypeIds4": [],
                    "DetailedTypeIds5": [],
                    "DetailedTypeIds6": [],
                    "AccountReviewLevel": 5
                }
            })

            setDatasource(tempData);
            dataRef.current = tempData

        }
        if (!CustomerChosenCodingType5IsFetching && !GetDetailedType5_WithTotalIdIsFetching && !GetDetailedType5_WithGroupIdIsFetching) {
            setLoading(false)
        }
    }, [CustomerChosenCodingType5IsFetching, GetDetailedType5_WithGroupIdIsFetching, GetDetailedType5_WithTotalIdCurrentData,
        GetDetailedType5_WithTotalIdIsFetching, lastLevel, location?.search, GetDetailedType5_WithGroupIdCurrentData, CustomerChosenCodingType5CurrentData])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    let ReviewColumn = [
        {
            field: 'AccountCodeEntity5',
            filterable: false,
            width: '50px',
            name: "کد",
            // cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity5",
            name: "مرور ریز تفضیلی5",
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
        {
            field: 'actionCell',
            filterable: false,
            width: '80px',
            name: "گردش حساب",
            cell: CustomActionCellMain,
            className: 'text-center',
            reorderable: false
        }
    ]
    function getSelectedRows(list) {
        console.log("seleeee",list)
        if (list?.length) {
            if (!!list[0]?.CodingId) {
                GetSelectedId(list[0]?.CodingId)
                GetAccountingReview(list)
            }
            else {
                GetAccountingReview([])
            }
        }

    }
    /* -------------------------------------------------------------------------- */
    /*                               export to excel                              */
    /* -------------------------------------------------------------------------- */
    const [excelData, setExcelData] = useState();
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
        if (lastLevel === 1 || lastLevel === 7) {
            if (allDetailedType5_WithGroupIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType5_WithGroupIdError) {
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
                        "AccountCodeEntity6": data?.detailedTypes5[0]?.firstDetailedCode,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "DetailedTypeGuid4": data?.detailedTypes4[0]?.detailedTypeGuid,
                        "DetailedTypeGuid5": data?.detailedTypes5[0]?.detailedTypeGuid,
                        "DetailedTypeGuid6": data?.detailedTypes6[0]?.detailedTypeGuid,
                        "formersNames": data?.formersNames,
                        "CycleDebtor": debitTotal,
                        "CycleCreditor": creditTotal,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                    }
                })
                setExcelData(tempData);
                // dataRef.current = tempData

            }
        }
        else if (lastLevel === 2 || lastLevel === 8) {
            if (allDetailedType5_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType5_WithTotalIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = allDetailedType5_WithTotalIdResult?.data?.map((data) => {

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
                        "AccountCodeEntity6": data?.detailedTypes6[0]?.firstDetailedCode,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "DetailedTypeGuid4": data?.detailedTypes4[0]?.detailedTypeGuid,
                        "DetailedTypeGuid5": data?.detailedTypes5[0]?.detailedTypeGuid,
                        "DetailedTypeGuid6": data?.detailedTypes6[0]?.detailedTypeGuid,
                        "formersNames": data?.formersNames,
                        "CycleDebtor": debitTotal,
                        "CycleCreditor": creditTotal,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                    }
                })
                setExcelData(tempData);
                // dataRef.current = tempData


            }
        }
        if (lastLevel == 9 || lastLevel == 3) {
            console.log("allDetailedType5_WithTotalIdResult", allDetailedType5_WithTotalIdResult)
            if (allDetailedType5_WithTotalIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (allDetailedType5_WithTotalIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!allDetailedType5_WithTotalIdResult?.header) {
                    let pagination = JSON.parse(allDetailedType5_WithTotalIdResult?.header);
                    setTotal(pagination.totalCount);
                }
                if (allDetailedType5_WithTotalIdResult?.data[0]?.detailedTypes6?.length > 1) {

                    allDetailedType5_WithTotalIdResult?.data?.map((data) => {
                        let creditTotal = data?.credits?.reduce(
                            (acc, current) => acc + current,
                            0
                        );
                        let debitTotal = data?.debits?.reduce(
                            (acc, current) => acc + current,
                            0
                        );
                        Remainder = debitTotal - creditTotal
                        let temp = data?.detailedTypes6?.map((item, index) => {
                            return {
                                "id": new Guid(),
                                "formersNames": data?.formersNames,
                                "AccountCodeGroup": data?.codingParentParent?.code,
                                "AccountNameGroup": data?.codingParentParent?.name,
                                "AccountCodeTotal": data?.codingParent?.code,
                                "AccountNameTotal": data?.codingParent?.name,
                                "AccountCodeSpecific": data?.code,
                                "AccountNameSpecific": data?.name,
                                "AccountNameEntity4": data?.detailedTypes4[index]?.definableAccountsNumber,
                                "AccountCodeEntity4": data?.detailedTypes4[index]?.detailedTitle,
                                "AccountCodeEntity5": data?.detailedTypes5[index]?.definableAccountsNumber,
                                "AccountNameEntity5": data?.detailedTypes5[index]?.detailedTitle,
                                "AccountCodeEntity6": data?.detailedTypes6[index]?.definableAccountsNumber,
                                "AccountNameEntity6": data?.detailedTypes6[index]?.detailedTitle,
                                "CycleDebtor": debitTotal,
                                "CycleCreditor": creditTotal,
                                "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                                "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                                "CompleteCode": data.completeCode,
                                "CodingId": data?.codingId,
                                "DetailedTypeIds4": [],
                                "DetailedTypeIds5": [],
                                "DetailedTypeIds6": [],
                                "AccountReviewLevel": 6
                            }
                        })
                        setDatasource(temp);
                        dataRef.current = temp
                    })
                } else {
                    let tempData = allDetailedType5_WithTotalIdResult?.data?.map((data) => {
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
                            "DetailedTypeIds4": [],
                            "DetailedTypeIds5": [],
                            "DetailedTypeIds6": [],
                            "AccountReviewLevel": 6
                        }
                    })
                    setDatasource(tempData);
                    dataRef.current = tempData
                }




            }
            setLoading(false)
        }
        else if ((lastLevel == 4 || lastLevel == 6 || lastLevel === 10 || lastLevel === 12) && selectedAccountingReview?.length > 0) {
            let tempData = selectedAccountingReview?.map((data) => {

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
                    "DetailedTypeGuid4": data?.detailedTypeGuid,
                    "DetailedTypeGuid5": data?.detailedTypeGuid,
                    "DetailedTypeGuid6": data?.detailedTypeGuid,
                    "CycleDebtor": data?.CycleDebtor,
                    "CycleCreditor": data?.CycleCreditor,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "CompleteCode": data.CompleteCode,
                    "CodingId": data?.CodingId,
                    "DetailedTypeIds4": data?.detailedType4Ids,
                    "DetailedTypeIds5": data?.detailedType5Ids,
                    "DetailedTypeIds6": data?.detailedType6Ids,
                }
            })
            setExcelData(tempData);
            dataRef.current = tempData
        }
    }, [allDetailedType5_WithGroupIdIsFetching, allDetailedType5_WithMoeinIdIsFetching,
        allDetailedType5_WithGroupIdResult, allDetailedType5_WithTotalIdIsFetching,
        allDetailedType5_WithMoeinIdResult, allDetailedType5_WithTotalIdResult, allDetailedType5_WithTotalIdIsFetching, selectedAccountingReview])
    /* --------------------------excel Request Manager ------------------------- */
    useEffect(() => {
        localStorage.setItem(`id`, JSON.stringify(id));
        if (lastLevel === 1 || lastLevel === 7) {
            setAllDetailedType5_WithGroupIdSkip(false)
        }
        else if (lastLevel === 2 || lastLevel === 8) {
            setAllDetailedType5_WithTotalIdSkip(true)
        }
        else if (lastLevel === 3 || lastLevel === 9) {
            setAllDetailedType5_WithMoeinIdSkip(false)
        }
    }, [])
    useEffect(() => {
        if (lastLevel === 1 && querySearchParams) {
            setAllDetailedType5_WithGroupIdSkip(false)
        }
        else if (lastLevel === 2 && querySearchParams) {
            setAllDetailedType5_WithTotalIdSkip(false)
        }
        else if (lastLevel === 3 && querySearchParams) {
            setAllDetailedType5_WithMoeinIdSkip(false)
        }
    }, [querySearchParams])
    return (
        <RKGrid
            gridId={'AccountReview_Level11'}
            gridData={datasource}
            excelData={excelData}
            columnList={ReviewColumn}
            showSetting={true}
            showChart={false}
            showExcelExport={true}
            showPrint={true}
            showFilter={false}
            rowCount={5}
            sortable={true}
            pageable={true}
            reorderable={true}
            selectable={true}
            selectKeyField={'id'}
            selectionMode={'single'}
            getSelectedRows={getSelectedRows}
            excelFileName={t("مرور ریزتفضیلی5")}
            loading={loading}
            total={total} />
    )
}

export default AccountingReview_Level11
