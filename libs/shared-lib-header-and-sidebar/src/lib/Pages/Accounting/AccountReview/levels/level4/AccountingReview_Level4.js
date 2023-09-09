import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Guid from "devextreme/core/guid";
import ActionCellMain from '../../ActionCellMain';
import { useGetDetailedAccount4Query } from '../../../../../features/slices/detailedAccountSlice';


const AccountingReview_Level4 = ({ location, GetSelectedId, GetAccountingReview = [], querySearchParams, GetStatus }) => {
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
    /* -------------------------- Get DetailedAccount4 -------------------------- */
    const [detailedAccount4Skip, setDetailedAccount4Skip] = useState(false);
    const { data: DetailedAccount4Result, isFetching: DetailedAccount4IsFetching, error: DetailedAccount4Error,currentData: DetailedAccount4CurrentData
    } = useGetDetailedAccount4Query({ obj: obj, querySearchParams: querySearchParams }, { skip: detailedAccount4Skip });
    useEffect(() => {
        setLoading(true)
        if (DetailedAccount4IsFetching) {
            setContent(<CircularProgress />)
        } else if (DetailedAccount4Error) {
            setContent(t("خطایی رخ داده است"))
        } else {
            setContent("")
            if (!!DetailedAccount4Result?.header) {
                let pagination = JSON.parse(DetailedAccount4Result?.header);
                setTotal(pagination.totalCount);
            }
            let tempData = DetailedAccount4Result?.data?.map((data) => {
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
                    "AccountCodeEntity4": data?.detailedTypes4[0]?.firstDetailedCode,
                    "DetailedTypeGuid4": data?.detailedTypes4[0]?.detailedTypeGuid,
                    "AccountNameEntity4": data?.detailedTypes4[0]?.detailedTitle,
                    "AccountNameEntity5": data?.detailedTypes5[0]?.detailedTitle,
                    "AccountCodeEntity5": data?.detailedTypes5[0]?.firstDetailedCode,
                    "DetailedTypeGuid5": data?.detailedTypes5[0]?.detailedTypeGuid,
                    "AccountNameEntity6": data?.detailedTypes6[0]?.detailedTitle,
                    "AccountCodeEntity6": data?.detailedTypes6[0]?.firstDetailedCode,
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
                    "AccountReviewLevel": 4

                }
            })
            setDatasource(tempData);
        }
        if (!DetailedAccount4IsFetching) {
            setLoading(false)
        }
    }, [DetailedAccount4IsFetching, DetailedAccount4CurrentData, location])
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
            setDetailedAccount4Skip(true)
        }
    }, [datasource])
    useEffect(() => {
        if (querySearchParams?.length > 0) {
            setDetailedAccount4Skip(false)
        }
    }, [querySearchParams])

    let ReviewColumn = [
        {
            field: 'AccountCodeEntity4',
            filterable: false,
            width: '50px',
            name: "کد",
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: "AccountNameEntity4",
            name: "مرور تفضیلی4",
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
            gridId={'AccountReview_Level4'}
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
            excelFileName={t("مرور تفضیلی 4")}
            loading={loading}
            total={total} />
    )
}

export default AccountingReview_Level4
