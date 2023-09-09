import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import RKGrid, { FooterSome, TotalTitle,IndexCell,DateCell } from "rkgrid";
import { history } from '../../../../utils/history';
import ActionCellMainR from './ActionCellMainR';
import Data from './Data.json'

const Rycycle = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    /////////////////////RK Grid/////////////////
    const [excelData, setExcelData] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = Data.map((data) => {

            return {
                ...data,
                InsertDate: new Date(data.InsertDate),
                DeleteDate: new Date(data.DeleteDate),
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                OrderCode: data.OrderCode !== '' ? parseInt(data.OrderCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                VisitorCode: data.VisitorCode !== '' ? parseInt(data.VisitorCode) : '',

            }
        })

        setData(tempData)
        let excelData = Data.map((data) => {

            return {
                ...data,
                InsertDate: new Date(data.InsertDate),
                DeleteDate: new Date(data.DeleteDate),
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                OrderCode: data.OrderCode !== '' ? parseInt(data.OrderCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                VisitorCode: data.VisitorCode !== '' ? parseInt(data.VisitorCode) : '',

            }
        })
        setExcelData(excelData);
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: true,
            width: '50px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'OrderPreCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "پیش فاکتور",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'OrderCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "فاکتور",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'PartnerCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد طرف حساب",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'PartnerName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام",
            reorderable: true
        },
        {
            field: 'PartnerLegalName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام حقوقی طرف حساب",
            reorderable: true
        },
        {
            field: 'VisitorCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "کد فروشنده",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'VisitorName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نام فروشنده",
            reorderable: true
        },
        {
            field: 'Description',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "درج کننده",
            reorderable: true
        },
        {
            field: 'InsertDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ درج",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            reorderable: true
        },
        {
            field: "DeleteUser",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "حذف کننده",
            reorderable: true
        },
        {
            field: 'DeleteDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ حذف",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            reorderable: true
        },
        {
            field: "DeleterIp",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ادرس IP",
            reorderable: true
        },
        {
            field: 'actionCell',
            filterable: false,

            name: "عملیات",
            cell: ActionCellMainR,
            className: 'text-center',
            reorderable: false
        },

    ]

    

    function getSelectedRows(list) {
        console.log('selected row list to request:', list)
        setSelectedRow(list);
    }
    function cancel() {
        history.navigate("/Sell/Order")
    }

    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'SaleProformaـRecycle'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={false}
                    showExcelExport={true}
                    showPrint={false}
                    excelFileName={t("پیش فاکتورها")}
                    rowCount={10}
                    sortable={false}
                    pageable={true}
                    reorderable={false}
                    selectable={false}
                    showChart={false}
                    selectKeyField={'OrderId'}
                    getSelectedRows={getSelectedRows}
                    
                />
            </div >
            <div className='d-flex justify-content-end'>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={cancel}>{t("بازگشت")}</Button></div>

            </div>
        </>
    )

}
export default Rycycle;
