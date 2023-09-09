import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import { useGetAllCustomerChosenCodingDetailsTotalQuery } from '../../../../../features/slices/customerChosenCodingSlice';

const AccountingReview_Level8 = ({ location, id, GetSelectedId, selectedAccountingReview = [], GetAccountingReview, querySearchParams, GetStatus }) => {
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
    const [selectedRow, setSelectedRow] = useState([])
    const [data, setData] = useState([])
    useEffect(() => {
        setData(selectedAccountingReview?.map(item => ({
            ...item,
            selected: false
        })))
        GetAccountingReview([])
        localStorage.setItem(`selectedAccountingReview8`, JSON.stringify(selectedAccountingReview));
        localStorage.setItem(`id`, JSON.stringify(id));
    }, [])
    useEffect(() => {
        if (datasource?.length > 0) {
            GetAccountingReview([])
        }
    }, [datasource])
    /* --------- Get allCustomerChosenCoding_DetailsTotal & DetailsMoein -------- */
    const [skip, setSkip] = useState(false)
    const { data: CustomersDetailsTotalResult, isFetching: customersDetailsTotalIsFetching, error: customersDetailsTotalError, currentData: customersDetailsTotalCurrentData
    } = useGetAllCustomerChosenCodingDetailsTotalQuery({ obj: obj, id: id, querySearchParams: querySearchParams }, { skip: skip });

    useEffect(() => {
        setLoading(true)
        if (customersDetailsTotalIsFetching) {
            setContent(<CircularProgress />)
        } else if (customersDetailsTotalError) {
            setContent(t("خطایی رخ داده است"))
        } else if (CustomersDetailsTotalResult?.data?.length) {
            setContent("")
            if (!!CustomersDetailsTotalResult?.header) {
                let pagination = JSON.parse(CustomersDetailsTotalResult?.header);
                setTotal(pagination.totalCount);
            }
            let tempData = CustomersDetailsTotalResult?.data?.map((data) => {

                Remainder = data?.accountingDocumentArticleDebits - data?.accountingDocumentArticleCredits
                return {
                    "id": new Guid(),
                    "formersNames": data?.formersNames,
                    "AccountCodeGroup": "",
                    "AccountNameGroup": "",
                    "AccountCodeTotal": data?.code,
                    "AccountNameTotal": data?.name,
                    "AccountCodeSpecific": "",
                    "AccountNameSpecific": "",
                    "AccountNameEntity4": "",
                    "AccountCodeEntity4": "",
                    "AccountCodeEntity5": "",
                    "AccountNameEntity5": "",
                    "AccountCodeEntity6": "",
                    "AccountNameEntity6": "",
                    "DetailedTypeGuid4": "",
                    "DetailedTypeGuid5": "",
                    "DetailedTypeGuid6": "",
                    "CycleDebtor": data?.accountingDocumentArticleDebits,
                    "CycleCreditor": data?.accountingDocumentArticleCredits,
                    "RemainderDebtor": Remainder > 0 ? Math.abs(Remainder) : 0,
                    "RemainderCreditor": Remainder <= 0 ? Math.abs(Remainder) : 0,
                    "CompleteCode": data?.completeCode,
                    "CodingId": data?.codingParent?.codingId,
                    "DetailedTypeIds4": data?.detailedType4Ids,
                    "DetailedTypeIds5": data?.detailedType5Ids,
                    "DetailedTypeIds6": data?.detailedType6Ids,
                    "AccountReviewLevel": 2
                }
            })
            setDatasource(tempData);
            console.log("CustomersDetailsTotalResult", tempData)
            dataRef.current = tempData
        } else if (data?.AccountCodeEntity4 != "" && !selectedRow.length && !CustomersDetailsTotalResult?.data?.length) {
            setDatasource(data)
        }
        if (!customersDetailsTotalIsFetching) {
            setLoading(false)
        }
    }, [customersDetailsTotalIsFetching, customersDetailsTotalCurrentData, data])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    useEffect(() => {
        if (querySearchParams?.length > 0) {

            setSkip(false)
        }
    }, [querySearchParams])
    /* -------------------------------------------------------------------------- */
    /*                               export to excel                              */
    /* -------------------------------------------------------------------------- */
    const [excelData, setExcelData] = useState();
    useEffect(() => {
        if (!!datasource?.length) {
            // setLoading(false)
            setExcelData(datasource)
            setSkip(true)
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
            field: "AccountNameTotal",
            name: "مرور ریز کل",
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
        console.log("injaaaaa", list)
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
            gridId={'AccountReview_Level8'}
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
            excelFileName={t("مرور ریزکل")}
            loading={loading}
            total={total} />
    )
}

export default React.memo(AccountingReview_Level8)
