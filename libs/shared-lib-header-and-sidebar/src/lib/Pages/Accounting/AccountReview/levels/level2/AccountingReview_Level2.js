import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { CircularProgress } from '@mui/material';
import ActionCellMain from '../../ActionCellMain';
import Guid from "devextreme/core/guid";
import { useGetAllCustomerChosenCodingsWithMoeinAccounts_TotalQuery, useGetAllCustomerChosenCodingsWithTotalAccountsForPrintQuery } from '../../../../../features/slices/customerChosenCodingSlice';



const AccountingReview_Level2 = ({ location, GetSelectedId, GetAccountingReview, querySearchParams, GetStatus }) => {

    const { t, i18n } = useTranslation();
    const [rowData, setRowData] = useState([]);
    const [datasource, setDatasource] = useState([]);
    const [loading, setLoading] = useState(true);
    let Remainder;
    const params = new URLSearchParams(location)
    const obj = Object.fromEntries(params)
    const [content, setContent] = useState("")
    const [total, setTotal] = useState(0);
    const dataRef = useRef()
    dataRef.current = datasource
    const [skip, setSkip] = useState(true)
    useEffect(() => { setSkip(false) }, [])
    /* -------------------- Get allCustomerChosenCoding_Total ------------------- */
    const { data: CustomersTotalResult, isFetching: customersTotalIsFetching, error: customersTotalError, currentData: customersTotalCurrentData
    } = useGetAllCustomerChosenCodingsWithMoeinAccounts_TotalQuery(querySearchParams, { skip: skip });
    useEffect(() => {
        setLoading(true)
        if (customersTotalIsFetching) {
            setContent(<CircularProgress />)
        } else if (customersTotalError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = CustomersTotalResult?.data.map((data, index) => {
                Remainder = data?.accountingDocumentArticleDebits - data?.accountingDocumentArticleCredits
                return {
                    "id": new Guid(),
                    "formersNames": data?.formersNames,
                    "CompleteCode": data?.completeCode,
                    "AccountCodeGroup": data?.codingParentParent?.code,
                    "AccountNameGroup": data?.codingParentParent?.name,
                    "AccountCodeTotal": data?.codingParent?.code,
                    "AccountNameTotal": data?.codingParent?.name,
                    "AccountNameSpecific": data?.name,
                    "AccountCodeSpecific": data?.code,
                    "AccountCodeEntity4": "",
                    "AccountCodeEntity5": "",
                    "AccountCodeEntity6": "",
                    "CycleDebtor": data?.accountingDocumentArticleDebits,
                    "CycleCreditor": data?.accountingDocumentArticleCredits,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "CodingId": data?.codingId,
                    "DetailedTypeIds4": data?.detailedType4Ids,
                    "DetailedTypeIds5": data?.detailedType5Ids,
                    "DetailedTypeIds6": data?.detailedType6Ids,
                    "AccountReviewLevel": 2
                }
            })

            setRowData(tempData);
            dataRef.current = tempData

        }
        if (!customersTotalIsFetching) {

            setLoading(false)
        }
    }, [customersTotalIsFetching, location, customersTotalCurrentData])
    useEffect(() => {
        let PageSize = parseInt(obj?.PageSize)
        let PageNumber = parseInt(obj?.PageNumber)
        setTotal(rowData?.length)
        var rec = rowData?.slice((PageSize * (PageNumber - 1)), PageSize * (PageNumber - 1) + PageSize)
        setDatasource(rec)
    }, [location, rowData])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
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
            field: "AccountNameTotal",
            name: "مرور کل",
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
    const [excelData, setExcelData] = useState();
    const { data: AllcustomerTotalResult, isFetching: AllcustomersTotalIsFetching, error: AllcustomersTotalError,
    } = useGetAllCustomerChosenCodingsWithTotalAccountsForPrintQuery(querySearchParams, { skip: skip });
    useEffect(() => {
        if (AllcustomersTotalIsFetching) {
            setContent(<CircularProgress />)
        } else if (AllcustomersTotalError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")

            let tempData = AllcustomerTotalResult?.data.map((data, index) => {


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
                    "AccountCodeGroup": "",
                    "AccountNameGroup": "",
                    "AccountCodeTotal": data?.code,
                    "AccountNameTotal": data?.name,
                    "AccountCodeSpecific": "",
                    "AccountNameSpecific": "",
                    "AccountCodeEntity4": "",
                    "AccountNameEntity4": "",
                    "AccountCodeEntity5": "",
                    "AccountNameEntity5": "",
                    "AccountCodeEntity6": "",
                    "AccountNameEntity6": "",
                    "formersNames": data?.formersNames,
                    "CycleDebtor": debitTotal,
                    "CycleCreditor": creditTotal,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "AccountCompleteCode": data?.completeCode,
                    "CodingId": data?.codingId,
                    "DetailedTypeIds4": data?.detailedType4Ids,
                    "DetailedTypeIds5": data?.detailedType5Ids,
                    "DetailedTypeIds6": data?.detailedType6Ids,
                }
            })
            setExcelData(tempData);
            dataRef.current = tempData

        }

    }, [AllcustomersTotalIsFetching, AllcustomerTotalResult])
    // this is my swagger as you know i have a detailedAccount that has some entity on it with one to one relation ship and everything is work but when i want to update it i will have error that says there is conflict with foreign keys then i need get the id that come into facade from main and i have a delete action that i delete every dto that hane that id and then request the put in my code 

    return (
        <RKGrid
            gridId={'AccountReview_Level2'}
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
            excelFileName={t("مرور کل")}
            loading={loading}
            total={total} />
    )
}

export default AccountingReview_Level2
