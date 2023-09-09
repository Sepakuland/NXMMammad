import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import RKGrid, { FooterSome, CurrencyCell, TotalTitle } from "rkgrid";
import { CircularProgress } from "@mui/material";
import Guid from "devextreme/core/guid";
import ActionCellMain from "../../ActionCellMain";
import {
  useAllCustomerChosenCodingDetailedType6Query,
  useCustomerChosenCodingDetailedType6Query,
  useGetAllDetailedType6_WithGroupIdQuery,
  useGetAllDetailedType6_WithTotalIdQuery,
  useGetDetailedType6_WithGroupIdQuery,
  useGetDetailedType6_WithTotalIdQuery,
} from "../../../../../features/slices/detailedAccountSlice";

const AccountingReview_Level12 = ({
  location,
  id,
  GetSelectedId,
  lastLevel,
  GetAccountingReview,
  querySearchParams,
  selectedAccountingReview,
  GetStatus,
}) => {
  const { t, i18n } = useTranslation();
  const [datasource, setDatasource] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [loading, setLoading] = useState(true);
  let Remainder;
  const params = new URLSearchParams(location);
  const obj = Object.fromEntries(params);
  const [content, setContent] = useState("");
  const [total, setTotal] = useState(0);
  const dataRef = useRef();
  dataRef.current = datasource;

    useEffect(() => {
        localStorage.setItem(`id`, JSON.stringify(id));
    }, [])
    useEffect(() => {
        if (datasource?.length > 0) {
            GetAccountingReview([])
        }
    }, [datasource])
    /* -------------------------------------------------------------------------- */
    /*                               request manager                              */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        if (lastLevel == 9 || lastLevel == 3) {
            setCustomerChosenCodingType6Skip(false)
        }
        else if (lastLevel == 1 || lastLevel == 7) {
            setGetDetailedType6_WithGroupIdSkip(false)
        }
        else if (lastLevel == 2 || lastLevel == 8) {
            setGetDetailedType6_WithTotalIdSkip(false)
        }
    }, [lastLevel])
    /* -------------------------------------------------------------------------- */
    /*                      Get Customer Chosen Coding Type 6                     */
    /* -------------------------------------------------------------------------- */

  /* ----------------------- get detailed with moein id ----------------------- */
  const [customerChosenCodingType6Skip, setCustomerChosenCodingType6Skip] =
    useState(true);
  const {
    data: CustomerChosenCodingType6Result,
    isFetching: CustomerChosenCodingType6IsFetching,
    error: CustomerChosenCodingType6Error,
    currentData: CustomerChosenCodingType6CurrentData,
  } = useCustomerChosenCodingDetailedType6Query(
    { obj: obj, id: id, querySearchParams: querySearchParams },
    { skip: customerChosenCodingType6Skip }
  );
  /* ----------------------- get detailed with group id ----------------------- */
  const [
    GetDetailedType6_WithGroupIdSkip,
    setGetDetailedType6_WithGroupIdSkip,
  ] = useState(true);
  const {
    data: GetDetailedType6_WithGroupIdResult,
    isFetching: GetDetailedType6_WithGroupIdIsFetching,
    error: GetDetailedType6_WithGroupIdError,
    currentData: GetDetailedType6_WithGroupIdCurrentData,
  } = useGetDetailedType6_WithGroupIdQuery(
    { obj: obj, id: id, querySearchParams: querySearchParams },
    { skip: GetDetailedType6_WithGroupIdSkip }
  );
  /* ----------------------- get detailed with total id ----------------------- */

  const [
    GetDetailedType6_WithTotalIdSkip,
    setGetDetailedType6_WithTotalIdSkip,
  ] = useState(true);
  const {
    data: GetDetailedType6_WithTotalIdResult,
    isFetching: GetDetailedType6_WithTotalIdIsFetching,
    error: GetDetailedType6_WithTotalIdError,
    currentData: GetDetailedType6_WithTotalIdCurrentData,
  } = useGetDetailedType6_WithTotalIdQuery(
    { obj: obj, id: id, querySearchParams: querySearchParams },
    { skip: GetDetailedType6_WithTotalIdSkip }
  );

    useEffect(() => {
        if (lastLevel == 9 || lastLevel == 3) {
            if (CustomerChosenCodingType6IsFetching) {
                setContent(<CircularProgress />)
            } else if (CustomerChosenCodingType6Error) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!CustomerChosenCodingType6Result?.header) {
                    let pagination = JSON.parse(CustomerChosenCodingType6Result?.header);
                    setTotal(pagination.totalCount);
                }



                if (CustomerChosenCodingType6Result?.data[0]?.detailedTypes6?.length > 1) {

                    CustomerChosenCodingType6Result?.data?.map((data) => {
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
        } else if (lastLevel == 1 || lastLevel == 7) {

            if (GetDetailedType6_WithGroupIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (GetDetailedType6_WithGroupIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!GetDetailedType6_WithGroupIdResult?.header) {
                    let pagination = JSON?.parse(GetDetailedType6_WithGroupIdResult?.header);
                    setTotal(pagination?.totalCount);
                }

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
                        "CodingId": data?.codingParentParent?.codingId,
                        "DetailedTypeIds4": [],
                        "DetailedTypeIds5": [],
                        "DetailedTypeIds6": [],
                        "AccountReviewLevel": 6
                    }
                })
                setDatasource(tempData);
                dataRef.current = tempData


            }
            setLoading(false)

        }
        else if (lastLevel === 2 || lastLevel == 8) {
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
                    "AccountReviewLevel": 6
                }
            })
            setDatasource(tempData);
            dataRef.current = tempData
            setLoading(false)
        }
        else if ((lastLevel == 4 || lastLevel == 5 || lastLevel === 11 || lastLevel === 10) && selectedAccountingReview?.length > 0) {
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
                    "CycleDebtor": data?.CycleDebtor,
                    "CycleCreditor": data?.CycleCreditor,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "CompleteCode": data.CompleteCode,
                    "CodingId": data?.CodingId,
                    "AccountReviewLevel": 6
                }
            })
            setDatasource(tempData);
            dataRef.current = tempData
        }
        if (!CustomerChosenCodingType6IsFetching && !GetDetailedType6_WithTotalIdIsFetching && !GetDetailedType6_WithGroupIdIsFetching && !!dataRef.current) {
            setLoading(false)
        }
    }, [CustomerChosenCodingType6IsFetching, GetDetailedType6_WithTotalIdCurrentData, GetDetailedType6_WithTotalIdIsFetching
        , GetDetailedType6_WithGroupIdIsFetching, CustomerChosenCodingType6CurrentData, GetDetailedType6_WithGroupIdCurrentData, location])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    let ReviewColumn = [
        {
            field: 'AccountCodeEntity6',
            filterable: false,
            width: '50px',
            name: "کد",
            // cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity6",
            name: "مرور ریز تفضیلی6",
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
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        if (lastLevel == 9 || lastLevel == 3) {
            setAllCustomerChosenCodingType6Skip(false)
        }
        else if (lastLevel == 1 || lastLevel == 7) {

            setGetAllDetailedType6_WithGroupIdSkip(false)
        }
        else if (lastLevel === 2 || lastLevel == 8) {
            setAllGetDetailedType6_WithTotalIdSkip(false)
        }
    }, [])
    useEffect(() => {
        if ((lastLevel == 9 || lastLevel == 3) && querySearchParams) {

            setAllCustomerChosenCodingType6Skip(false)
        }
        else if ((lastLevel == 1 || lastLevel == 7) && querySearchParams) {

            setGetAllDetailedType6_WithGroupIdSkip(false)
        }
        else if ((lastLevel === 2 || lastLevel == 8) && querySearchParams) {

            setAllGetDetailedType6_WithTotalIdSkip(false)
        }
    }, [querySearchParams])
    /* -------------------------------------------------------------------------- */
    /*                    Get Al Customer Chosen Coding Type 6                    */
    /* -------------------------------------------------------------------------- */

  /* ----------------------- get detailed with moein id ----------------------- */
  const [
    AllcustomerChosenCodingType6Skip,
    setAllCustomerChosenCodingType6Skip,
  ] = useState(true);
  const {
    data: AllCustomerChosenCodingType6Result,
    isFetching: AllCustomerChosenCodingType6IsFetching,
    error: AllCustomerChosenCodingType6Error,
  } = useAllCustomerChosenCodingDetailedType6Query(
    { id: id, querySearchParams: querySearchParams },
    { skip: AllcustomerChosenCodingType6Skip }
  );
  /* ----------------------- get detailed with group id ----------------------- */
  const [
    GetAllDetailedType6_WithGroupIdSkip,
    setGetAllDetailedType6_WithGroupIdSkip,
  ] = useState(true);
  const {
    data: GetAllDetailedType6_WithGroupIdResult,
    isFetching: GetAllDetailedType6_WithGroupIdIsFetching,
    error: GetAllDetailedType6_WithGroupIdError,
  } = useGetAllDetailedType6_WithGroupIdQuery(
    { id: id, querySearchParams: querySearchParams },
    { skip: GetAllDetailedType6_WithGroupIdSkip }
  );
  /* ----------------------- get detailed with total id ----------------------- */

  const [
    GetAllDetailedType6_WithTotalIdSkip,
    setAllGetDetailedType6_WithTotalIdSkip,
  ] = useState(true);
  const {
    data: GetAllDetailedType6_WithTotalIdResult,
    isFetching: GetAllDetailedType6_WithTotalIdIsFetching,
    error: GetAllDetailedType6_WithTotalIdError,
  } = useGetAllDetailedType6_WithTotalIdQuery(
    { id: id, querySearchParams: querySearchParams },
    { skip: GetAllDetailedType6_WithTotalIdSkip }
  );

    useEffect(() => {
        if (lastLevel == 9 || lastLevel == 3) {

            if (AllCustomerChosenCodingType6IsFetching) {
                setContent(<CircularProgress />)
            } else if (AllCustomerChosenCodingType6Error) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")

                let tempData = AllCustomerChosenCodingType6Result?.data?.map((data) => {
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
                setExcelData(tempData);
                dataRef.current = tempData


            }

        } else if (lastLevel == 1 || lastLevel == 7) {

            if (GetAllDetailedType6_WithGroupIdIsFetching) {
                setContent(<CircularProgress />)
            } else if (GetAllDetailedType6_WithGroupIdError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                let tempData = GetAllDetailedType6_WithGroupIdResult?.data?.map((data) => {
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
                setExcelData(tempData);
                dataRef.current = tempData
            }

        }

        else if (lastLevel === 2 || lastLevel == 8) {
            let tempData = GetAllDetailedType6_WithTotalIdResult?.data?.map((data) => {
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
            setExcelData(tempData);
            dataRef.current = tempData

        }
        else if ((lastLevel == 4 || lastLevel == 5) && selectedAccountingReview?.length > 0) {
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
            setExcelData(tempData);
        }
    }, [GetAllDetailedType6_WithTotalIdResult, GetAllDetailedType6_WithTotalIdIsFetching, GetAllDetailedType6_WithGroupIdResult, GetAllDetailedType6_WithGroupIdIsFetching
        , AllCustomerChosenCodingType6Result, AllCustomerChosenCodingType6IsFetching])




  return (
    <RKGrid
      gridId={"AccountReview_Level12"}
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
      selectKeyField={"id"}
      selectionMode={"single"}
      getSelectedRows={getSelectedRows}
      excelFileName={t("مرور تفضیلی6")}
      loading={loading}
      total={total}
    />
  );
};

export default AccountingReview_Level12;
