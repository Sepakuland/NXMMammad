import React, {useEffect, useRef, useState} from "react";
import RKGrid, { FooterSome, IndexCell,DateCell,getLangDate } from "rkgrid";
import {Button, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import gData from './gData.json';
import ActionCell from './ActionCell'
import EditCell from './EditCell'
import SearchBtn from "./SearchBtn";





const SalePhone = () => {

    const theme = useTheme();
    const {t, i18n} = useTranslation();
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = gData.map((data) => {
            return {
                ...data,
                LastOrderDate: data.LastOrderDate !== '' ? new Date(data.LastOrderDate) : '',
                UpdateDate: data.UpdateDate !== '' ? new Date(data.UpdateDate) : '',
                PartnerCode: parseInt(data.PartnerCode),
            }
        })
        setData(tempData)

        let tempExcel = gData?.map((data, index) => {
            return {
                ...data,
                IndexCell: index + 1,
                LastOrderDate: data.LastOrderDate !== '' ? getLangDate(i18n.language, new Date(data.LastOrderDate)) : '',
                UpdateDate: data.UpdateDate !== '' ? getLangDate(i18n.language, new Date(data.UpdateDate)) : '',
            }
        })
        setExcelData(tempExcel)

    }, [i18n.language])


    const CustomCell = (props) => {
        return (
            <td colSpan="1" className={'dir-ltr'}>
                <Button variant="outlined" color='primary' className='edit-btn'
                        style={{direction: i18n.dir()}}>
                    {/*<Link to={`/Report/PartnerSpecifics?id=${props?.dataItem.PartnerId}`} target={"_blank"}>*/}
                        {props?.dataItem?.PartnerDebt}
                    {/*</Link>*/}
                </Button>
            </td>

        )
    }

    const chartObj = [
        {value: "PartnerCode", title: t('کد')},
    ]

    const CustomFooterSome=(props)=><FooterSome {...props} data={dataRef.current} />


    let tempColumn = [
        {
            field: 'IndexCell',
            filterable: false,
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            sortable: false,
            reorderable: false
        },
        {
            field: 'accountParty',
            name: "طرف حساب",
            children: [
                {
                    field: 'PartnerCode',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    filter: 'numeric',
                    name: "کد",
                },
                {
                    field: 'PartnerName',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "نام",
                },
                {
                    field: 'PartnerLegalName',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "نام حقوقی",
                },
                {
                    field: 'PartnerZoneAndRoute',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "منطقه/مسیر",
                },
                {
                    field: 'PartnerGroupName',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "گروه مشتری",
                },

                {
                    field: 'PartnerTelephones',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "تلفن ها",
                },
            ]
        },
        {
            field: 'actionCell',
            filterable: false,
            name: "ویرایش طرف حساب",
            width: '70px',
            cell: EditCell
        },
        {
            field: 'LastOrderDate',
            // columnMenu: DateMenu,
            filterable: true,
            cell: DateCell,
            filter: "date",
            // format: "{0:d}",
            name: "آخرین خرید",
        },
        {
            field: 'PartnerDebt',
            // columnMenu: ColumnMenu,
            filterable: true,
            cell: CustomCell,
            footerCell:CustomFooterSome,
            width: '130px',
            name: "مانده حساب",
        },
        {
            field: 'ConversationResult',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "نتیجه مکالمه",
        },
        {
            field: 'OrderPreCode',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "پیش فاکتور",
        },
        {
            field: 'lastChange',
            name: "آخرین تغییر",
            children: [
                {
                    field: 'VisitDescription',
                    // columnMenu: ColumnMenu,
                    filterable: true,
                    name: "شرح",
                },
                {
                    field: 'UpdateDate',
                    // columnMenu: DateMenu,
                    cell: DateCell,
                    filter: "date",
                    // format: "{0:d}",
                    filterable: true,
                    name: "تاریخ",
                },

            ]
        },
        {
            field: 'UpdateTime',
            // columnMenu: ColumnMenu,
            filterable: true,
            name: "ساعت",
        },
        {
            field: 'actionCell',
            filterable: false,
            width: '70px',
            name: "عملیات",
            cell: ActionCell,
            className: 'text-center',
            sortable: false,
            reorderable: false
        }
    ]


    return (
        <>
            <div style={{backgroundColor: `${theme.palette.background.paper}`}}>
                <RKGrid
                    gridId={'SalePhone'}
                    gridData={data}
                    excelData={excelData}
                    columnList={tempColumn}
                    showSetting={true}
                    showChart={true}
                    showExcelExport={true}
                    showPrint={true}
                    chartDependent={chartObj}
                    excelFileName={t("فروش تلفنی")}
                    rowCount={10}
                    sortable={true}
                    pageable={true}
                    reorderable={true}
                    selectable={false}
                    extraBtn={<SearchBtn/>}

                />
            </div>
        </>
    )
}

export default SalePhone