import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import { useAllCustomerChosenCodingDetailedType4Query, useCustomerChosenCodingDetailedType4Query, useGetAllDetailedType4_WithGroupIdQuery, useGetAllDetailedType4_WithTotalIdQuery, useGetDetailedType4_WithGroupIdQuery, useGetDetailedType4_WithTotalIdQuery } from '../../../../../features/slices/detailedAccountSlice';
const AccountingReview_Level10 = ({ location, id, selectedAccountingReview, GetSelectedId, GetAccountingReview, lastLevel, querySearchParams, GetStatus }) => {


    const { t, i18n } = useTranslation();
    const [rowData, setRowData] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    let Remainder;
    const [selectedRow, setSelectedRow] = useState([])
    const params = new URLSearchParams(location)
    const obj = Object.fromEntries(params)
    const [content, setContent] = useState("")
    const [total, setTotal] = useState(0);
    const dataRef = useRef()
    dataRef.current = datasource
    const codingRefId = useRef()

    useEffect(() => {
        if ((lastLevel == 1 || lastLevel == 7 || lastLevel == 2 || lastLevel == 8 || lastLevel == 3 || lastLevel == 9)) { GetAccountingReview([]) }
        localStorage.setItem(`id`, JSON.stringify(id));
        localStorage.setItem(`selectedAccountingReview10`, JSON.stringify(selectedAccountingReview));

    }, [])
    useEffect(() => {
        if (datasource?.length > 0) {
            GetAccountingReview([])
        }
    }, [datasource])
    /* -------------------------------------------------------------------------- */
    /*                               manage Request                               */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (lastLevel === 4 || lastLevel === 5 || lastLevel == 11 || lastLevel == 12 || lastLevel === 6 || lastLevel === 3 || lastLevel === 9) {
            setCustomerChosenCodingType4Skip(false)
        }
        else if (lastLevel === 1 || lastLevel === 7) {
            setGetDetailedType4_WithGroupIdSkip(false)
        }
        else if (lastLevel === 2 || lastLevel === 8) {
            setGetDetailedType4_WithTotalIdSkip(false)
        }
    }, [lastLevel])
    /* -------------------- Get Customer Chosen Coding Type4 -------------------- */
    /* -------------------- get detailed type 4 with codingId ------------------- */
    const [customerChosenCodingType4Skip, setCustomerChosenCodingType4Skip] = useState(true);
    const { data: CustomerChosenCodingType4Result, isFetching: CustomerChosenCodingType4IsFetching, error: CustomerChosenCodingType4Error, currentData: CustomerChosenCodingType4CurrentData
        , isLoading: customerChosenCodingType4Loading } = useCustomerChosenCodingDetailedType4Query({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: customerChosenCodingType4Skip });
    /* --------------------- get detailed type with groupId --------------------- */
    const [GetDetailedType4_WithGroupIdSkip, setGetDetailedType4_WithGroupIdSkip] = useState(true);
    const { data: GetDetailedType4_WithGroupIdResult, isFetching: GetDetailedType4_WithGroupIdIsFetching, error: GetDetailedType4_WithGroupIdError, currentData: GetDetailedType4_WithGroupIdCurrentData
        , isLoading: GetDetailedType4_WithGroupIdLoading } = useGetDetailedType4_WithGroupIdQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: GetDetailedType4_WithGroupIdSkip });
    /* ---------------------- get detaled type with totalId --------------------- */
    const [GetDetailedType4_WithTotalIdSkip, setGetDetailedType4_WithTotalIdSkip] = useState(true);
    const { data: GetDetailedType4_WithTotalIdResult, isFetching: GetDetailedType4_WithTotalIdIsFetching, error: GetDetailedType4_WithTotalIdError, currentData: GetDetailedType4_WithTotalIdCurrentData
        , isLoading: GetDetailedType4_WithTotalIdLoading } = useGetDetailedType4_WithTotalIdQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: GetDetailedType4_WithTotalIdSkip });
    useEffect(() => {
        setLoading(true)
        if (lastLevel == 4 || lastLevel == 5 || lastLevel == 6 || lastLevel == 9 || lastLevel == 3 || lastLevel == 11 || lastLevel == 12) {
            if (CustomerChosenCodingType4IsFetching) {
                setContent(<CircularProgress />)
            } else if (CustomerChosenCodingType4Error) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!CustomerChosenCodingType4Result?.header) {
                    let pagination = JSON.parse(CustomerChosenCodingType4Result?.header);
                    setTotal(pagination.totalCount);
                }
                if (lastLevel == 4 || lastLevel == 5 || lastLevel == 6 || lastLevel === 9 || lastLevel === 3 || lastLevel == 11 || lastLevel == 12) {

                    CustomerChosenCodingType4Result?.data?.map((data) => {
                        let creditTotal = data?.credits?.reduce(
                            (acc, current) => acc + current,
                            0
                        );
                        let debitTotal = data?.debits?.reduce(
                            (acc, current) => acc + current,
                            0
                        );
                        Remainder = debitTotal - creditTotal
                        if (data?.detailedTypes4?.length > 1) {
                            let temp = data?.detailedTypes4?.map((item, index) => {
                                return {
                                    "id": new Guid(),
                                    "formersNames": data?.formersNames,
                                    "AccountCodeGroup": data?.codingParentParent?.code,
                                    "AccountNameGroup": data?.codingParentParent?.name,
                                    "AccountCodeTotal": data?.codingParent?.code,
                                    "AccountNameTotal": data?.codingParent?.name,
                                    "AccountCodeSpecific": data?.code,
                                    "AccountNameSpecific": data?.name,
                                    "AccountNameEntity4": data?.detailedTypes4[index]?.detailedTitle,
                                    "AccountCodeEntity4": data?.detailedTypes4[index]?.firstDetailedCode,
                                    "AccountCodeEntity5": data?.detailedTypes5[index]?.firstDetailedCode,
                                    "AccountNameEntity5": data?.detailedTypes5[index]?.detailedTitle,
                                    "AccountCodeEntity6": data?.detailedTypes6[index]?.firstDetailedCode,
                                    "AccountNameEntity6": data?.detailedTypes6[index]?.detailedTitle,
                                    "DetailedTypeGuid4": data?.detailedTypes4[index]?.detailedTypeGuid,
                                    "DetailedTypeGuid5": data?.detailedTypes5[index]?.detailedTypeGuid,
                                    "DetailedTypeGuid6": data?.detailedTypes6[index]?.detailedTypeGuid,
                                    "CycleDebtor": debitTotal,
                                    "CycleCreditor": creditTotal,
                                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                                    "CompleteCode": data?.completeCode,
                                    "CodingId": data?.codingId,
                                    "DetailedTypeIds4": data?.detailedType4Ids,
                                    "DetailedTypeIds5": data?.detailedType5Ids,
                                    "DetailedTypeIds6": data?.detailedType6Ids,
                                    "AccountReviewLevel": 4
                                }
                            })
                            setDatasource(temp);
                            dataRef.current = temp
                        }
                        else {
                            let tempData = {
                                "id": new Guid(),
                                "formersNames": data?.formersNames,
                                "AccountCodeGroup": data?.codingParentParent?.code,
                                "AccountNameGroup": data?.codingParentParent?.name,
                                "AccountCodeTotal": data?.codingParent?.code,
                                "AccountNameTotal": data?.codingParent?.name,
                                "AccountCodeSpecific": data?.code,
                                "AccountNameSpecific": data?.name,
                                "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                                "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
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
                                "AccountReviewLevel": 4
                            }
                            setDatasource(tempData);
                            dataRef.current = tempData
                        }

                    })

                }
            }
        }
        else if (lastLevel == 1 || lastLevel == 7) {
            if (lastLevel === 1) {
                console.log("injaaaaaaaaaaaaaaaaaaaaa2", GetDetailedType4_WithGroupIdResult)
                if (GetDetailedType4_WithGroupIdIsFetching) {
                    setContent(<CircularProgress />)
                } else if (GetDetailedType4_WithGroupIdError) {
                    setContent(t("خطایی رخ داده است"))
                } else {
                    setContent("")
                    if (!!GetDetailedType4_WithGroupIdResult?.header) {
                        let pagination = JSON.parse(GetDetailedType4_WithGroupIdResult?.header);
                        setTotal(pagination.totalCount);
                    }

                    let tempData = GetDetailedType4_WithGroupIdResult?.data?.map((data) => {

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
                            "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                            "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
                            "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                            "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
                            "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                            "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
                            "CycleDebtor": debitTotal,
                            "CycleCreditor": creditTotal,
                            "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                            "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                            "CompleteCode": data?.completeCode,
                            "CodingId": data?.codingParentParent?.codingId,
                            "AccountReviewLevel": 4
                        }
                    })
                    setDatasource(tempData);
                    dataRef.current = tempData
                }
            }
            else {
                console.log("injaaaaaaaaaaaaaaaaaaaaa")
                let tempData = CustomerChosenCodingType4Result?.data?.map((data) => {
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
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
                        "CycleDebtor": debitTotal,
                        "CycleCreditor": creditTotal,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                        "AccountReviewLevel": 4
                    }
                })
                setDatasource(tempData);
                dataRef.current = tempData
            }

        }
        else if (lastLevel == 2 || lastLevel == 8) {
            if (lastLevel == 2) {
                if (GetDetailedType4_WithTotalIdIsFetching) {
                    setContent(<CircularProgress />)
                } else if (GetDetailedType4_WithTotalIdError) {
                    setContent(t("خطایی رخ داده است"))
                } else {
                    setContent("")
                    if (!!GetDetailedType4_WithTotalIdResult?.header) {
                        let pagination = JSON.parse(GetDetailedType4_WithTotalIdResult?.header);
                        setTotal(pagination.totalCount);
                    }
                    let tempData = GetDetailedType4_WithTotalIdResult?.data?.map((data) => {
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
                            "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                            "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
                            "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                            "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
                            "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                            "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
                            "CycleDebtor": debitTotal,
                            "CycleCreditor": creditTotal,
                            "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                            "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                            "CompleteCode": data?.completeCode,
                            "CodingId": data?.codingId,
                            "AccountReviewLevel": 4
                        }
                    })
                    setDatasource(tempData);
                    dataRef.current = tempData

                }
            }
            else {

                let tempData = GetDetailedType4_WithTotalIdResult?.data?.map((data) => {
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
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.definableAccountsNumber,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.definableAccountsNumber,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "AccountCodeEntity6": data?.detailedTypes6[0]?.definableAccountsNumber,
                        "CycleDebtor": debitTotal,
                        "CycleCreditor": creditTotal,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                        "AccountReviewLevel": 4
                    }
                })
                setDatasource(tempData);
                dataRef.current = tempData
            }
        }
        if (!GetDetailedType4_WithGroupIdIsFetching && !GetDetailedType4_WithTotalIdIsFetching && !CustomerChosenCodingType4IsFetching) {
            setLoading(false)
        }

    }, [GetDetailedType4_WithGroupIdIsFetching, GetDetailedType4_WithTotalIdIsFetching,
        GetDetailedType4_WithTotalIdCurrentData, CustomerChosenCodingType4IsFetching,
        CustomerChosenCodingType4CurrentData, lastLevel, GetDetailedType4_WithGroupIdCurrentData, location])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    let ReviewColumn = [
        {
            field: 'AccountCodeEntity4',
            filterable: false,
            width: '50px',
            name: "کد",
            // cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity4",
            name: "مرور ریز تفضیلی4",
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
        if (list.length) {
            if (!!list[0]?.CodingId) {
                GetAccountingReview(list)
                GetSelectedId(list[0]?.CodingId)
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
        if (lastLevel === 1) {
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
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                        "AccountCodeEntity6": data?.detailedTypes6[0]?.firstDetailedCode,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "formersNames": data?.formersNames,
                        "CycleDebtor": data?.debits,
                        "CycleCreditor": data?.credits,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                        "DetailedTypeIds4": [],
                        "DetailedTypeIds5": [],
                        "DetailedTypeIds6": [],
                    }
                })
                setExcelData(tempData);
                dataRef.current = tempData

            }
        }
        else if (lastLevel === 2) {
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
                        "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                        "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                        "AccountCodeEntity6": data?.detailedTypes6[0]?.firstDetailedCode,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "formersNames": data?.formersNames,
                        "CycleDebtor": data?.debits,
                        "CycleCreditor": data?.credits,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                    }
                })
                setExcelData(tempData);
                dataRef.current = tempData

            }
        }
        else if (lastLevel === 3) {
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
                        "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                        "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                        "AccountCodeEntity6": data?.detailedTypes6[0]?.firstDetailedCode,
                        "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                        "formersNames": data?.formersNames,
                        "CycleDebtor": data?.debits,
                        "CycleCreditor": data?.credits,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                    }
                })
                setExcelData(tempData);
                dataRef.current = tempData

            }
        }
        // if (!allDetailedType4_WithGroupIdIsFetching && !allDetailedType4_WithTotalIdIsFetching&&!allDetailedType4_WithMoeinIdIsFetching) {
        //     setLoading(false)
        // }
    }, [allDetailedType4_WithGroupIdIsFetching, allDetailedType4_WithGroupIdResult, allDetailedType4_WithTotalIdIsFetching, allDetailedType4_WithMoeinIdResult, allDetailedType4_WithTotalIdResult, allDetailedType4_WithTotalIdIsFetching])
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        if (lastLevel === 1) {
            setAllDetailedType4_WithGroupIdSkip(false)
        }
        else if (lastLevel === 2) {
            setAllDetailedType4_WithTotalIdSkip(false)
        }
        else if (lastLevel === 3) {
            setAllDetailedType4_WithMoeinIdSkip(false)
        }
    }, [])

    useEffect(() => {
        if (lastLevel === 1 && querySearchParams) {
            setAllDetailedType4_WithGroupIdSkip(false)
        }
        else if (lastLevel === 2 && querySearchParams) {
            setAllDetailedType4_WithTotalIdSkip(false)
        }
        else if (lastLevel === 3 && querySearchParams) {
            setAllDetailedType4_WithMoeinIdSkip(false)
        }
    }, [querySearchParams])

    useEffect(() => {
        if (!!datasource?.length) {
            setExcelData(datasource)
            setCustomerChosenCodingType4Skip(true)
            setGetDetailedType4_WithTotalIdSkip(true)
        }
    }, [datasource])
    return (
        <RKGrid
            gridId={'AccountReview_Level10'}
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
            excelFileName={t("مرور ریزتفضیلی4")}
            loading={(lastLevel === 4 || lastLevel === 5 || lastLevel == 11 || lastLevel == 12 || lastLevel === 6 || lastLevel === 3 || lastLevel === 9) ?
                customerChosenCodingType4Loading : (lastLevel === 1 || lastLevel === 7) ? GetDetailedType4_WithGroupIdLoading : GetDetailedType4_WithTotalIdLoading}
            total={total} />
    )
}

export default AccountingReview_Level10
