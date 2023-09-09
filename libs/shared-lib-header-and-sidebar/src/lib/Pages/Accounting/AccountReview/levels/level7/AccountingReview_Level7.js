import React, { useEffect, useRef, useState } from 'react'
import RKGrid, { FooterSome,CurrencyCell, TotalTitle } from "rkgrid";
import { useTranslation } from 'react-i18next';
import ActionCellMain from '../../ActionCellMain';

const AccountingReview_Level7 = ({ location, GetSelectedId,  selectedAccountingReview, GetAccountingReview = [],GetStatus }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const params = new URLSearchParams(location)
    const obj = Object.fromEntries(params)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0);
    const dataRef = useRef()
    const codingRefId = useRef()

    useEffect(() => {
        setLoading(true)
        let Temp = selectedAccountingReview?.map(item => ({
            ...item,
            AccountReviewLevel: 1,
            selected: false
        }))
        setData(Temp)
        dataRef.current = Temp
        localStorage.setItem(`selectedAccountingReview7`, JSON.stringify(selectedAccountingReview));

        setLoading(false)
    }, [])
    useEffect(() => {
        if (data?.length > 0) {
            GetAccountingReview([])
        }
    }, [data])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    const CustomActionCellMain = (props) => <ActionCellMain {...props} GetStatus={GetStatus} />

    /* -------------------------------------------------------------------------- */
    /*                               export to excel                              */
    /* -------------------------------------------------------------------------- */
    const [excelData, setExcelData] = useState();
    useEffect(() => {
        if (!!data?.length) {
            setExcelData(data)
        }
    }, [data])

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
            field: "AccountNameGroup",
            name: "مرور گروه",
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
            gridId={'AccountReview_Level7'}
            gridData={data}
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
            excelFileName={t("مرور ریزگروه")}
            loading={loading}
            total={total} />
    )
}

export default AccountingReview_Level7
