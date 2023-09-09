import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import {
    useGetAllCustomerChosenCodingsWithMoeinAccountsForPrintQuery,
    useGetAllCustomerChosenCodingsWithMoeinAccounts_MoeinQuery
} from '../../../../../features/slices/customerChosenCodingSlice';

const AccountingReview_Level3 = ({ location, GetSelectedId, GetAccountingReview = [], querySearchParams, GetStatus }) => {
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
    /* -------------------- Get allCustomerChosenCoding_Moein ------------------- */
    const { data: CustomersMoeinResult, isFetching: customersMoeinIsFetching, error: customersMoeinError,currentData: customersMoeinCurrentData
    } = useGetAllCustomerChosenCodingsWithMoeinAccounts_MoeinQuery({ obj: obj, querySearchParams: querySearchParams });
    useEffect(() => {
        setLoading(true)
        if (customersMoeinIsFetching) {
            setContent(<CircularProgress />)
        } else if (customersMoeinError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            if (!!CustomersMoeinResult?.header) {
                let pagination = JSON.parse(CustomersMoeinResult?.header);
                setTotal(pagination.totalCount);
            }

            let tempData = CustomersMoeinResult?.data.map((data, index) => {
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
                    "CycleDebtor": debitTotal,
                    "CycleCreditor": creditTotal,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
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
        if (!customersMoeinIsFetching) {

            setLoading(false)
        }
    }, [customersMoeinIsFetching, customersMoeinCurrentData])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    let ReviewColumn = [
        {
            field: 'CompleteCode',
            filterable: false,
            width: '50px',
            name: "کد",
            // cell: IndexCell,
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
    /* -------------------------------------------------------------------------- */
    /*                               export to excel                              */
    /* -------------------------------------------------------------------------- */
    const [excelData, setExcelData] = useState();
    const [moeinSkip, setMoeinSkip] = useState(true);
    const { data: customerMoeinResult, isFetching: customerMoeinIsFetching, error: customerMoeinError,
    } = useGetAllCustomerChosenCodingsWithMoeinAccountsForPrintQuery(querySearchParams, { skip: moeinSkip });
    useEffect(() => {
        if (customerMoeinIsFetching) {
            setContent(<CircularProgress />)
        } else if (customerMoeinError) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            let tempData = customerMoeinResult?.data?.map((data) => {
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
            setExcelData(tempData);
            dataRef.current = tempData
            setLoading(false)
        }
    }, [customerMoeinIsFetching, customerMoeinResult])
    /* ----------------------------- Request Manager ---------------------------- */
    useEffect(() => {
        setMoeinSkip(false)
    }, [])
    /* -------------------------------------------------------------------------- */
    return (
        <RKGrid
            gridId={'AccountReview_Level3'}
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
            excelFileName={t("مرور معین")}
            loading={loading}
            total={total} />
    )

}

export default AccountingReview_Level3
