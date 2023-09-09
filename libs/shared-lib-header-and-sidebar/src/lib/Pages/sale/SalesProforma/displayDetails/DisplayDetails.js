import { useTheme } from '@emotion/react';
import { Button, Fade, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { history } from '../../../../utils/history';
import ActionCellMainSP from './ActionCellMainSP';
import Data from './Data.json'
import Swal from 'sweetalert2';
import RKGrid, { FooterSome, CurrencyCell, TotalTitle,IndexCell,DateCell } from "rkgrid";


const DisplayDetails = () => {
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
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                OrderInsertDate: new Date(data.OrderInsertDate),
                FinalOrderDate: new Date(data.FinalOrderDate),
                ValidateDate1: new Date(data.ValidateDate1),
                ValidateDate2: new Date(data.ValidateDate2),
                ValidateDate3: new Date(data.ValidateDate3),
                ValidateDate4: new Date(data.ValidateDate4),
                ValidateDate5: new Date(data.ValidateDate5),
                OrderPrice: cost,
                OrderCode: data.OrderCode !== '' ? parseInt(data.OrderCode) : '',
                OrderPreCode: data.OrderPreCode !== '' ? parseInt(data.OrderPreCode) : '',
                PartnerCode: data.PartnerCode !== '' ? parseInt(data.PartnerCode) : '',
                PartnerPhones: data.PartnerPhones !== '' ? parseInt(data.PartnerPhones) : '',
                PartnerNationalCode: data.PartnerNationalCode !== '' ? parseInt(data.PartnerNationalCode) : '',
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                SettlementDay: data.SettlementDay !== '' ? parseInt(data.SettlementDay) : '',
            }
        })
        setData(tempData)
        let tempExcel = Data?.map((data, index) => {
            let temp = (data.OrderPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,

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
            field: "number",
            name: "شماره",
            children: [
                {
                    field: 'OrderCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "فاکتور",
                    filter: 'numeric',
                    reorderable: true
                },
                {
                    field: 'OrderPreCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "پیش فاکتور",
                    filter: 'numeric',
                    reorderable: true
                },
            ]
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
                    field: 'PartnerAddress',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "آدرس",
                    reorderable: true
                },
                {
                    field: 'PartnerPhones',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "تلفن",
                    filter: 'numeric',
                    reorderable: true
                },
                {
                    field: 'PartnerEconomicCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "کد اقتصادی",
                    filter: 'numeric',
                    reorderable: true
                },
                {
                    field: 'PartnerNationalCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "کد/شناسه ملی",
                    filter: 'numeric',
                    reorderable: true
                },
                {
                    field: 'PartnerZuneAndPath',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "منطقه/مسیر",
                    reorderable: true
                },
            ]
        },
        {
            field: "salesPerson",
            name: "فروشنده",
            children: [
                {
                    field: 'PersonnelCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "کد",
                    filter: 'numeric',
                    reorderable: true
                },
                {
                    field: 'PersonnelName',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "نام",
                    reorderable: true
                },

            ]



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
            field: 'OrderInsertDateTime',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ساعت",
            reorderable: true
        },
        {
            field: 'FinalOrderDate',
            // columnMenu: DateMenu,
            filterable: true,
            name: "تاریخ فاکتور",
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            reorderable: true
        },
        {
            field: "State",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "وضعیت",
            reorderable: true
        },
        {
            field: "LastValidDate",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "زمان تایید",
            reorderable: true
        },
        {
            field: 'TotalCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "سرجمع",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'InsertUserName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "درج کننده",
            reorderable: true
        },
        {
            field: 'ConfirmUser',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "تایید کننده",
            reorderable: true
        },
        {
            field: 'OrderPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            filter: 'numeric',
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'SettlementType',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نحوه تسویه",
            // width: '70px',
            reorderable: true
        },
        {
            field: 'SettlementDay',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مهلت تسویه (روز)",
            filter: 'numeric',
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'Description',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
            reorderable: true
        },
        {
            field: 'CalculationMethod',
            name: "نحوه محاسبه",
            children: [
                {
                    field: 'WarehouseName',
                    filterable: true,
                    // columnMenu: ColumnMenu,
                    name: "انبار",
                    className: 'text-center',
                    reorderable: true
                },
                {
                    field: 'PriceCalculation',
                    filterable: true,
                    // columnMenu: ColumnMenu,
                    name: "قیمت ها",
                    className: 'text-center',
                    reorderable: true
                },
                {
                    field: 'DiscountCalculation',
                    filterable: true,
                    // columnMenu: ColumnMenu,
                    name: "تخفیفات",
                    className: 'text-center',
                    reorderable: true
                },
            ]
        },
        {
            field: 'VATCalculation',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "مالیات",
            // width: '50px',
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'Description2',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "توضیحات 2",
            // width: '50px',
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'NeedsToBeMeasuredBeforeShipment',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "توزینی",
            // width: '50px',
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'MeasurementDone',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "وزن شده",
            // width: '50px',
            className: 'text-center',
            reorderable: true
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '150px',
            name: "عملیات",
            cell: ActionCellMainSP,
            className: 'text-center',
            reorderable: false
        },

    ]

    function AddNew() {
        history.navigate("/Sell/Order/AddSaleProforma")
    }

    function getSelectedRows(list) {
        console.log('selected row list to request:', list)
        setSelectedRow(list);
    }
    function recycle() {
        history.navigate("/Sell/Order/Recycle")
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    function RejectedInvoices() {
        history.navigate("/Sell/Order/RejectedInvoices")
    }
    const UnFormalPrint = () => {
        if (!selectedRow.length) {
            Swal.fire({
                icon: 'error',
                text: t('شما می بایست حداقل یک مورد را انتخاب کنید'),
                confirmButtonColor: "#1890ff"
            })
        }
        else {
            window.open(`/Sell/Order/Recycle/UnofficialRecycleInvoicePrint`, '_blank')
        }

    }
    const FormalPrint = () => {
        if (!selectedRow.length) {
            Swal.fire({
                icon: 'error',
                text: t('شما می بایست حداقل یک مورد را انتخاب کنید'),
                confirmButtonColor: "#1890ff"
            })
        }
        else {
            window.open(`/Sell/Order/Recycle/OfficialRecycleInvoicePrint`, '_blank')
        }
    }
    const FormalPrint2 = () => {
        window.open(`/Sell/Order/Recycle/OfficialRecycleInvoicePrint`, '_blank')
    }
    const TotalPrint = () => {

        if (!selectedRow.length) {
            Swal.fire({
                icon: 'error',
                text: t('شما می بایست حداقل یک مورد را انتخاب کنید'),
                confirmButtonColor: "#1890ff"
            })
        }
        else {
            window.open(`/Sell/Order/RejectedInvoices/UnofficialRejectedInvoicePrint`)
        }

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
                    gridId={'SaleProformaـSale'}
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
            <div className='d-flex'>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={AddNew}>{t("جدید")}</Button></div>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={recycle}>{t("بازیافت")}</Button></div>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={RejectedInvoices}>{t("پیش فاکتورهای رد شده")}</Button></div>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={FormalPrint2}>{t("تمپلیت فاکتور رسمی")}</Button></div>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={handleClick}>{t("چاپ")}</Button></div>
                <div><Button color='primary' variant="contained" style={{ margin: "5px" }} onClick={TotalPrint}>{t("چاپ تجمیعی")}</Button></div>
            </div>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={FormalPrint}>{t("فاکتور رسمی")}</MenuItem>
                <MenuItem onClick={UnFormalPrint}>{t("فاکتور غیررسمی")}</MenuItem>
            </Menu>

        </>
    )

}
export default DisplayDetails;
