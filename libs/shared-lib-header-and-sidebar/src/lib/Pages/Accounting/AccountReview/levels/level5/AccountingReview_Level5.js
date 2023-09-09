import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import { useGetDetailedAccount5Query } from '../../../../../features/slices/detailedAccountSlice';

const AccountingReview_Level5 = ({ location, GetSelectedId, GetAccountingReview = [], querySearchParams, GetStatus }) => {
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
    /* -------------------------- Get DetailedAccount5 -------------------------- */
    const [detailedAccount5Skip, setDetailedAccount5Skip] = useState(false);
    useEffect(() => {
        if (querySearchParams?.length > 0) {
            setDetailedAccount5Skip(false)
        }
    }, [querySearchParams])
    const { data: DetailedAccount5Result, isFetching: DetailedAccount5IsFetching, error: DetailedAccount5Error, currentData: DetailedAccount5CurrentData
    } = useGetDetailedAccount5Query({ obj: obj, querySearchParams: querySearchParams }, { skip: detailedAccount5Skip });
    useEffect(() => {
        setLoading(true)
        if (DetailedAccount5IsFetching) {
            setContent(<CircularProgress />)
        } else if (DetailedAccount5Error) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")

            if (!!DetailedAccount5Result?.header) {
                let pagination = JSON.parse(DetailedAccount5Result?.header);
                setTotal(pagination.totalCount);
            }
            let tempData = DetailedAccount5Result?.data?.map((data) => {
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
                    "DetailedTypeIds4": [],
                    "DetailedTypeIds5": [],
                    "DetailedTypeIds6": [],
                    "AccountReviewLevel": 5
                }
            })
            setDatasource(tempData);
            dataRef.current = tempData
        }
        if (!DetailedAccount5IsFetching) {

            setLoading(false)
        }

    }, [DetailedAccount5IsFetching, DetailedAccount5CurrentData, location])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />
    /* -------------------------------------------------------------------------- */
    /*                               export to excel                              */
    /* -------------------------------------------------------------------------- */
    const [excelData, setExcelData] = useState();
    useEffect(() => {
        if (!!datasource?.length) {
            setLoading(false)
            setExcelData(datasource)
            setDetailedAccount5Skip(true)
        }
    }, [datasource])
    let ReviewColumn = [
        {
            field: 'AccountCodeEntity5',
            filterable: false,
            width: '50px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity5",
            name: "مرور تفضیلی5",
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
            gridId={'AccountReview_Level5'}
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
            excelFileName={t("مرور تفصیلی 5")}
            loading={loading}
            total={total} />
    )
}

export default AccountingReview_Level5
