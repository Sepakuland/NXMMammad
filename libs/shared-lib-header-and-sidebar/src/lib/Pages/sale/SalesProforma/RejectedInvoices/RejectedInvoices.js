import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { history } from '../../../../utils/history';
import ActionCellMainR from './ActionCellMainR';
import Data from './Data.json'
import Swal from 'sweetalert2';
import RKGrid, { FooterSome, CurrencyCell, TotalTitle,IndexCell,DateCell } from "rkgrid";

const RejectedInvoices = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    /////////////////////RK Grid/////////////////
    const [excelData, setExcelData] = useState([])
    const [selectedRow, setSelectedRow] = useState([])
    const dataRef = useRef()
    dataRef.current = data
    useEffect(() => {
        let tempData = Data.map((data) => {
            let temp = data.OrderPrice !== '' ? (data.OrderPrice).toString().replaceAll(',', '') : 0;
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                PartnerInsertDate: new Date(data.PartnerInsertDate),
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,


                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',


            }
        })
        setData(tempData)
        let tempExcel = Data?.map((data, index) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                PartnerInsertDate: new Date(data.PartnerInsertDate),
                OrderInsertDate: new Date(data.OrderInsertDate),
                OrderPrice: cost,
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',

                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
            }
        })
        setExcelData(tempExcel)

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
            className: "word-break",
            reorderable: true
        },
        {
            field: "AccountParty",
            name: "طرف حساب",
            children: [
                {
                    field: 'PartnerCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "کد",
                    filter: 'numeric',
                    className: "word-break",
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
                    name: "نام حقوقی",
                    reorderable: true
                },
                {
                    field: 'PartnerInsertDate',
                    // columnMenu: DateMenu,
                    filterable: true,
                    name: "تاریخ",
                    // format: "{0:d}",
                    filter: 'date',
                    cell: DateCell,
                    reorderable: true
                },
                {
                    field: "PartnerAddress",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "آدرس",
                    reorderable: true
                },
                {
                    field: "PartnerZuneAndPath",
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "منطقه/مسیر",
                    reorderable: true
                },
                {
                    field: 'Remainder',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "مانده حساب",
                    width: '100px',
                    filter: 'numeric',
                    className: "word-break",
                    cell: CurrencyCell,
                    reorderable: true
                },
                {
                    field: 'OrderDiscountPercent',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "درصد تخفیف",
                    className: "word-break",
                    filter: 'numeric',
                    reorderable: true
                },


            ]
        },
        {
            field: "FreeProducts",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "اشانتیون ها",
            reorderable: true
        },
        {
            field: 'OrderPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            filter: 'numeric',
            className: "word-break",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'WeightSum',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وزن (KG)",
            filter: 'numeric',
            className: "word-break",
            reorderable: true
        },
        {
            field: 'VolumeSum',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "حجم (لیتر)",
            filter: 'numeric',
            className: "word-break",
            reorderable: true
        },
        {
            field: "SettlementType",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نحوه تسویه",
            reorderable: true
        },
        {
            field: "PersonnelName",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "فروشنده",
            reorderable: true
        },
        {
            field: 'OrderInsertDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ سفارش",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            reorderable: true
        },
        {
            field: "OrderInsertDateTime",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ساعت",
            reorderable: true
        },
        {
            field: "Description",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
            reorderable: true
        },
        {
            field: "RejectReason",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "دلیل عدم تأیید",
            reorderable: true
        },
        {
            field: "WarehouseName",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "انبار",
            reorderable: true
        },
        {
            field: "NeedsToBeMeasuredBeforeShipment",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توزینی",
            reorderable: true
        },
        {
            field: "MeasurementDone",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وزن شده",
            reorderable: true
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '200px',
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

    function confrimed() {

        if (!selectedRow.length) {
            Swal.fire({
                icon: 'error',
                text: t('شما می بایست حداقل یک مورد را انتخاب کنید'),
                confirmButtonColor: "#1890ff"
            })
        }
        else {
            console.log("Confrim", selectedRow)
            history.navigate("/Sell/Order")
        }


    }

    return (

        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'SaleProformaـRejectInvoices'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("پیش فاکتورها")}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={false}
                    selectable={true}
                    showChart={false}
                    selectKeyField={'OrderId'}
                    getSelectedRows={getSelectedRows}
                    
                />
            </div >
            <div className='d-flex justify-content-end m-2'>
                <Button
                    variant="contained"
                    color={'primary'}
                    style={{ margin: '0 2px' }}
                    onClick={confrimed}
                >
                    {t('تایید')}
                </Button>
            </div>



        </>


    )
}

export default RejectedInvoices
