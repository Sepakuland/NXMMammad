import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import { useGetAllCustomerChosenCodingDetailsMoeinQuery, useGetAllCustomerChosenCodingDetailsMoein_WithGroupQuery } from '../../../../../features/slices/customerChosenCodingSlice';


const AccountingReview_Level9 = ({ location, id, GetSelectedId, lastLevel, selectedAccountingReview = [], GetAccountingReview, querySearchParams, GetStatus }) => {
    const { t, i18n } = useTranslation();
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    let Remainder;
    const [selectedRow, setSelectedRow] = useState([])
    const params = new URLSearchParams(location)
    const obj = Object.fromEntries(params)
    const [content, setContent] = useState("")
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0);
    const dataRef = useRef()
    dataRef.current = datasource
    useEffect(() => {
        if ((lastLevel == 1 || lastLevel == 7 || lastLevel == 2 || lastLevel == 8)) { GetAccountingReview([]) }
        else {
            setData(selectedAccountingReview.map(item => ({
                ...item,
                selected: false
            })))
            localStorage.setItem(`selectedAccountingReview9`, JSON.stringify(selectedAccountingReview));
            localStorage.setItem(`id`, JSON.stringify(id));
        }
    }, [])


    useEffect(() => {
        if (data?.length > 0) {
            GetAccountingReview([])
        }
    }, [data])
    useEffect(() => {
        if ((lastLevel == 1 || lastLevel == 7)) {
            setTotalSkip(false)
        }
        else if ((lastLevel == 2 || lastLevel == 8)) {
            setMoeinSkip(false)
        }
    }, [lastLevel])
    /* --------- Get allCustomerChosenCoding_DetailsTotal & DetailsMoein -------- */
    const [moeinskip, setMoeinSkip] = useState(true)
    const [totalskip, setTotalSkip] = useState(true)
    const { data: CustomersDetailsMoeinResult, isFetching: customersDetailsMoeinIsFetching, error: customersDetailsMoeinError, currentData: customersDetailsMoeinCurrentData
        , isLoading: CustomerDetailsMoeinLoading } = useGetAllCustomerChosenCodingDetailsMoeinQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: moeinskip });
    const { data: CustomersDetailsTotalResult, isFetching: customersDetailsTotalIsFetching, error: customersDetailsTotalError, currentData: customersDetailsTotalCurrentData
        , isLoading: CustomersDetailedTotalLoading } = useGetAllCustomerChosenCodingDetailsMoein_WithGroupQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: totalskip });

    useEffect(() => {

        if ((lastLevel == 1 || lastLevel == 7) && !data.length) {
            if (customersDetailsTotalIsFetching) {
                setContent(<CircularProgress />)
            } else if (customersDetailsTotalError) {
                setContent(t("خطایی رخ داده است"))
            } else {
                setContent("")
                if (!!CustomersDetailsTotalResult?.header) {
                    let pagination = JSON.parse(CustomersDetailsTotalResult?.header);
                    setTotal(pagination.totalCount);
                }
                let tempData = CustomersDetailsTotalResult?.data?.map((data) => {

                    let accountingDocumentArticleCredits = data?.credits?.reduce(
                        (acc, current) => acc + current,
                        0
                    );
                    let accountingDocumentArticleDebits = data?.debits?.reduce(
                        (acc, current) => acc + current,
                        0
                    );

                    Remainder = data?.accountingDocumentArticleDebits - data?.accountingDocumentArticleCredits
                    return {
                        "id": new Guid(),
                        "formersNames": data?.formersNames,
                        "AccountCodeGroup": data?.codingParentParent?.code,
                        "AccountNameGroup": data?.codingParentParent?.name,
                        "AccountCodeTotal": data?.codingParent?.code,
                        "AccountNameTotal": data?.codingParent?.name,
                        "AccountCodeSpecific": data?.code,
                        "AccountNameSpecific": data?.name,
                        "AccountNameEntity4": "",
                        "AccountCodeEntity4": "",
                        "AccountCodeEntity5": "",
                        "AccountNameEntity5": "",
                        "AccountCodeEntity6": "",
                        "AccountNameEntity6": "",
                        "DetailedTypeGuid4": "",
                        "DetailedTypeGuid5": "",
                        "DetailedTypeGuid6": "",
                        "CycleDebtor": accountingDocumentArticleDebits,
                        "CycleCreditor": accountingDocumentArticleCredits,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingParentParent?.codingId,
                        "DetailedTypeIds4": data?.detailedType4Ids,
                        "DetailedTypeIds5": data?.detailedType5Ids,
                        "DetailedTypeIds6": data?.detailedType6Ids,
                        "AccountReviewLevel": 3
                    }
                })
                setDatasource(tempData);
                dataRef.current = tempData
            }

        }
        else if ((lastLevel == 2 || lastLevel == 8) && !data.length) {
            if (customersDetailsMoeinIsFetching) {
                setContent(<CircularProgress />)
            } else if (customersDetailsMoeinError) {
                setContent(t("خطایی رخ داده است"))
            } else if (!!CustomersDetailsMoeinResult?.data) {
                setContent("")
                if (!!CustomersDetailsMoeinResult?.header) {
                    let pagination = JSON.parse(CustomersDetailsMoeinResult?.header);
                    setTotal(pagination.totalCount);
                }

                let tempData = CustomersDetailsMoeinResult?.data?.map((data) => {

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
                        "AccountNameEntity4": "",
                        "AccountCodeEntity4": "",
                        "AccountCodeEntity5": "",
                        "AccountNameEntity5": "",
                        "AccountCodeEntity6": "",
                        "AccountNameEntity6": "",
                        "DetailedTypeGuid4": "",
                        "DetailedTypeGuid5": "",
                        "DetailedTypeGuid6": "",
                        "CycleDebtor": debitTotal,
                        "CycleCreditor": creditTotal,
                        "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                        "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                        "CompleteCode": data?.completeCode,
                        "CodingId": data?.codingId,
                        "DetailedTypeIds4": data?.detailedType4Ids,
                        "DetailedTypeIds5": data?.detailedType5Ids,
                        "DetailedTypeIds6": data?.detailedType6Ids,
                        "AccountReviewLevel": 3
                    }
                })
                setDatasource(tempData);
                dataRef.current = tempData
            }
            // setLoading(false)
        }

        else if (!CustomersDetailsMoeinResult?.data?.length && !CustomersDetailsTotalResult?.data?.length && !selectedRow.length && !!data.length) {
            setDatasource(data)

        }

        // if (!customersDetailsMoeinIsFetching && !customersDetailsTotalIsFetching) {
        //     setLoading(false)
        // }
        setLoading(false)
    }, [customersDetailsMoeinIsFetching, customersDetailsMoeinCurrentData, customersDetailsTotalCurrentData, customersDetailsTotalIsFetching, data, lastLevel])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    useEffect(() => {

        if ((lastLevel == 2 || lastLevel == 8) && querySearchParams?.length > 0) {
            setMoeinSkip(false)
        }
        else if ((lastLevel == 1 || lastLevel == 7) && querySearchParams?.length > 0) {
            setTotalSkip(false)
        }
    }, [querySearchParams])
    /* -------------------------------------------------------------------------- */
    /*                               export to excel                              */
    /* -------------------------------------------------------------------------- */
    const [excelData, setExcelData] = useState();

    useEffect(() => {
        if (!!datasource?.length) {
            setExcelData(datasource)
            if (lastLevel === 1 || lastLevel == 7) {
                setTotalSkip(true)
            }
            else if (lastLevel === 2 || lastLevel == 8) {
                setMoeinSkip(true)
            }
        }
    }, [datasource])

    let ReviewColumn = [
        {
            field: 'CompleteCode',
            filterable: false,
            width: '50px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameSpecific",
            name: "مرور معین",
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

    return (
        <RKGrid
            gridId={'AccountReview_Level9'}
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
            excelFileName={t("مرور ریز معین")}
            loading={lastLevel == 1 || lastLevel == 7 ? CustomersDetailedTotalLoading : lastLevel == 2 || lastLevel == 8 ?
                CustomerDetailsMoeinLoading : loading}
            total={total} />
    )
}

export default AccountingReview_Level9
