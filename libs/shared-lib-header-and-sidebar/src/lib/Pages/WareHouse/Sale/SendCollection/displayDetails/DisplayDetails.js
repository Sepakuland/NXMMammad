import { React, useEffect, useRef, useState } from "react";
import { Button, Menu, MenuItem, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Data from './Data.json'
import ActionCellMainSC from "./ActionCellMainSC";
import swal from "sweetalert";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import RKGrid, { FooterSome, CurrencyCell, IndexCell,getLangDate,DateCell } from "rkgrid";

const Factor = [];
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
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                TotalPriceTotalDate: new Date(data.TotalPriceTotalDate),
                PossibleShipmentDate: new Date(data.PossibleShipmentDate),
                TotalPrice: cost,
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
            }
        })
        setData(tempData)

        let tempExcel = Data?.map((data, index) => {
            let temp = (data.TotalPrice).toString().replaceAll(',', '')
            let cost = parseFloat(temp, 2)
            return {
                ...data,
                IndexCell: index + 1,
                TotalPriceTotalDate: getLangDate(i18n.language, new Date(data.TotalPriceTotalDate)),
                PossibleShipmentDate: getLangDate(i18n.language, new Date(data.PossibleShipmentDate)),
                TotalPrice: cost,
                TotalCode: data.TotalCode !== '' ? parseInt(data.TotalCode) : '',
                OrdersCount: data.OrdersCount !== '' ? parseInt(data.OrdersCount) : '',
                VolumeSum: data.VolumeSum !== '' ? parseInt(data.VolumeSum) : '',
                WeightSum: data.WeightSum !== '' ? parseInt(data.WeightSum) : '',
            }
        })
        setExcelData(tempExcel)
    }, [i18n.language])
    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: true,
            width: '40px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            // footerCell: TotalTitle,
            reorderable: false
        },
        {
            field: 'TotalCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            width: '70px',
            name: "شماره سرجمع",
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'TotalDate',
            filterable: true,
            // columnMenu: DateMenu,
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            name: "تاریخ سرجمع",
            reorderable: true
        },
        {
            field: 'PossibleShipmentDate',
            // columnMenu: DateMenu,
            // format: "{0:d}",
            filter: 'date',
            cell: DateCell,
            filterable: true,
            name: "تاریخ پیشنهادی ارسال",
            reorderable: true
        },
        {
            field: "PayeeName",
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "موزع",
            reorderable: true
        },
        {
            field: 'DriverName',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "راننده",
            reorderable: true
        },
        {
            field: 'Machine',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "خودرو",
            reorderable: true
        },
        {
            field: 'OrdersCount',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "تعداد پیش فاکتور",
            width: '70px',
            filter: 'numeric',
            reorderable: true
        },
        {
            field: 'TotalPrice',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "مبلغ",
            filter: 'numeric',
            width: '60px',
            cell: CurrencyCell,
            // footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'VolumeSum',
            filterable: true,
            // columnMenu: ColumnMenu,
            filter: 'numeric',
            name: "حجم (لیتر)",
            width: '60px',
            className: 'text-center',
            // footerCell: CustomFooterSome,
            reorderable: true
        },
        {
            field: 'WeightSum',
            filterable: true,
            // columnMenu: ColumnMenu,
            name: "وزن (Kg)",
            filter: 'numeric',
            width: '60px',
            className: 'text-center',
            // footerCell: CustomFooterSome,
            reorderable: true
        },

        {
            field: 'TotalDescription',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "توضیحات",
            reorderable: true
        },

        {
            field: 'actionCell',
            filterable: false,
            width: '205px',
            name: "عملیات",
            cell: ActionCellMainSC,
            className: 'text-center',
            reorderable: false
        },

    ]


    const chartObj = [
        { value: "TotalCode", title: t("شماره سرجمع") },
        { value: "TotalDate", title: t("تاریخ سرجمع") },
        { value: "PossibleShipmentDate", title: t("تاریخ پیشنهادی ارسال") },
        { value: "Machine", title: t("خودرو") },
        { value: "OrdersCount", title: t("تعداد پیش فاکتور") },
        { value: "TotalPrice", title: t("مبلغ") },
        { value: "VolumeSum", title: t("حجم (لیتر)") },
        { value: "WeightSum", title: t("وزن (Kg)") },
    ]

    let savedCharts = [
        { title: 'تست 1', dashboard: false },
        { title: 'تست 2', dashboard: true },
    ]
    function getSavedCharts(list) {
        console.log('save charts list to request and save:', list)
    }
    function getSelectedRows(list) {
        console.log('selected row list to request:', list)
        setSelectedRow(list);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const location = useLocation()
    const { pathname, search } = location
    ///////////////////Buttons///////////////////////////
    const PrintWithPriceButton = () => {
        if (selectedRow.length <= 0) {
            swal({
                title: t("حداقل یک سرجمع باید انتخاب شود."),
                icon: "error",
                button: t("تایید"),
            });

        } else {
            window.open(`/WareHouse/Sale/SendCollection/PrintSendTotalWC?id=${selectedRow[0].TotalId}`, '_blank')
        }
    }
    const PrintWithOutPriceButton = () => {
        if (selectedRow.length <= 0) {
            swal({
                title: t("حداقل یک سرجمع باید انتخاب شود."),
                icon: "error",
                button: t("تایید"),
            });

        } else {
            window.open(`/WareHouse/Sale/SendCollection/PrintSendTotalWOC?id=${selectedRow[0].TotalId}`, '_blank')

        }
    }
    const PrintWithDescButton = () => {
        if (selectedRow.length <= 0) {
            swal({
                title: t("حداقل یک سرجمع باید انتخاب شود."),
                icon: "error",
                button: t("تایید"),
            });

        } else {
            window.open(`/WareHouse/Sale/SendCollection/PrintSendTotalDesc?id=${selectedRow[0].TotalId}`, '_blank')
        }
    }
    /////////////////////////////////////////////////////
    return (
        <>
            <div style={{ backgroundColor: `${theme.palette.background.paper}`, padding: '20px' }} >
                <RKGrid
                    gridId={'SendCollection'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    excelFileName={t("ارسال سرجمع")}
                    rowCount={10}
                    chartDependent={chartObj}
                    savedChartsList={savedCharts}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={true}
                    selectKeyField={'TotalId'}
                    getSelectedRows={getSelectedRows}
                    
                />
                <div className="col-lg-12 col-md-12 col-12 d-flex align-content-end">
                    <div className="col-lg-6 col-md-6 col-6 "></div>
                    <div className="col-lg-6 col-md-6 col-6 d-flex justify-content-end">
                        <Button className="Send_Collection" color="primary" variant="contained" style={{ marginLeft: "5px", marginRight: "5px" }}
                        ><Link to={`/WareHouse/sale/approvedInvoices/unsentTotal?id=${Data[0].TotalId}`} state={{ prevPath: pathname + search }}>{t("ویرایش سرجمع ها")}</Link></Button>
                        <Button className="Send_Collection" color="primary" variant="contained" onClick={handleClick}>{t("چاپ تجمیعی")}</Button>
                    </div>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => PrintWithPriceButton()}>{t("همراه با قیمت")}</MenuItem>
                        <MenuItem onClick={() => PrintWithOutPriceButton()}>{t("بدون قیمت")}</MenuItem>
                        <MenuItem onClick={() => PrintWithDescButton()}>{t("همراه با فضای توضیحات")}</MenuItem>
                    </Menu>

                </div>
            </div >

        </>
    )
}

export default DisplayDetails
