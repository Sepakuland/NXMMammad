import React, { useEffect, useState, useRef } from 'react'
import Print from 'sepakuland-component-print'
import {FooterSome, TotalTitle,IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import dataForGrid from './DataForGrid.json'
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";


const PrintPage = () => {

    const { t, i18n } = useTranslation();
    const lang = i18n.language
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = dataForGrid.map((data) => {

            return {
                ...data,
                DocumentDate: new Date(data.DocumentDate),
                ChequeMaturityDate: new Date(data.ChequeMaturityDate),
                WarehouseCode: data.WarehouseCode !== "" ? parseInt(data.WarehouseCode) : "",
                StuffCode: data.StuffCode !== "" ? parseInt(data.StuffCode) : "",
                StuffRealStock: data.StuffRealStock !== "" ? parseInt(data.StuffRealStock) : "",
                BuyOrderStock: data.BuyOrderStock !== "" ? parseInt(data.BuyOrderStock) : "",
                SaleOrderStock: data.SaleOrderStock !== "" ? parseInt(data.SaleOrderStock) : "",
                BuyReversionStock: data.BuyReversionStock !== "" ? parseInt(data.BuyReversionStock) : "",
                MinInWarehouse: data.MinInWarehouse !== "" ? parseInt(data.MinInWarehouse) : "",
                NeedToBuy: data.NeedToBuy !== "" ? parseInt(data.NeedToBuy) : "",
                SaleInRecent10Days: data.SaleInRecent10Days !== "" ? parseInt(data.SaleInRecent10Days) : "",
                SaleInRecent20Days: data.SaleInRecent20Days !== "" ? parseInt(data.SaleInRecent20Days) : "",
                SaleInRecent30Days: data.SaleInRecent30Days !== "" ? parseInt(data.SaleInRecent30Days) : "",
                SaleInRecent3Months: data.SaleInRecent3Months !== "" ? parseInt(data.SaleInRecent3Months) : "",
                PackageCoefficient: data.PackageCoefficient !== "" ? parseInt(data.PackageCoefficient) : "",
                StuffMinOrder: data.StuffMinOrder !== "" ? parseInt(data.StuffMinOrder) : "",
            };
        });
        setData(tempData);
    }, [i18n.language])


    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />
    let tempColumn = [
        {
            field: "IndexCell",
            width: "60px",
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: "WareHouse",
            name: "انبار",
            children: [
                {
                    field: "WarehouseCode",
                    name: "کد",
                    filter: "numeric",
                    // width: "90px",
                },
                {
                    field: "WarehouseName",
                    // width: "100px",
                    name: "نام",
                },
            ]
        },
        {
            field: "Product",
            name: "کالا",
            children: [
                {
                    field: "StuffSubGroupName",
                    // width: "100px",
                    name: "گروه",
                },
                {
                    field: "StuffSubGroupName",
                    // width: "100px",
                    name: "زیرگروه",
                },
                {
                    field: "StuffCode",
                    name: "کد",
                    filter: "numeric",
                    // width: "90px",
                },

            ]
        },
        {
            field: "StuffRealStock",
            filter: "numeric",
            // width: "60px",
            name: "موجودی",
            footerCell:CustomFooterSome
        },
        {
            field: "Reservation",
            name: "رزرو",
            children: [
                {
                    field: "BuyOrderStock",
                    filter: "numeric",
                    // width: "100px",
                    name: "خرید",
                    footerCell:CustomFooterSome
                },
                {
                    field: "SaleOrderStock",
                    filter: "numeric",
                    // width: "100px",
                    name: "فروش",
                    footerCell:CustomFooterSome
                },
                {
                    field: "BuyReversionStock",
                    name: "برگشت از خرید",
                    filter: "numeric",
                    // width: "90px",
                    footerCell:CustomFooterSome
                },
                {
                    field: "SaleReversionStock",
                    name: "برگشت از فروش",
                    filter: "numeric",
                    // width: "90px",
                    footerCell:CustomFooterSome
                },

            ]
        },
        {
            field: "MinInWarehouse",
            filter: "numeric",
            // width: "100px",
            name: "نقطه سفارش",
            footerCell:CustomFooterSome
        },
        {
            field: "NeedToBuy",
            filter: "numeric",
            // width: "100px",
            name: "مورد نیاز",
            footerCell:CustomFooterSome
        },
        {
            field: "RecentDaysSale",
            name: "فروش روزهای اخیر",
            children: [
                {
                    field: "SaleInRecent10Days",
                    filter: "numeric",
                    // width: "100px",
                    name: "10 روزه",
                    footerCell:CustomFooterSome
                },
                {
                    field: "SaleInRecent20Days",
                    filter: "numeric",
                    // width: "100px",
                    name: "20 روزه",
                    footerCell:CustomFooterSome
                },
                {
                    field: "SaleInRecent30Days",
                    name: "30 روزه",
                    filter: "numeric",
                    // width: "90px",
                    footerCell:CustomFooterSome
                },
                {
                    field: "SaleInRecent3Months",
                    name: "3 ماهه",
                    filter: "numeric",
                    // width: "90px",
                    footerCell:CustomFooterSome
                },
            ]
        },
        // {
        //     field: "PackageName",
        //     // // columnMenu: ColumnMenu,
        //     // filterable: true,
        //     name: "واحد",
        //     // filter: "numeric",
        //     width: "120px",
        //     // reorderable: true,
        //     cell: (props) => {

        //         return (
        //             <td className="Unit_Needs">
        //                 <SelectBox
        //                     dataSource={props?.dataItem?.PackageName}
        //                     rtlEnabled={i18n.dir() == "ltr" ? false : true}
        //                     // valueExpr="Id"
        //                     className='selectBox'
        //                     searchEnabled={true}
        //                     placeholder=''
        //                     showClearButton
        //                     noDataText={t("اطلاعات یافت نشد")}
        //                     displayExpr='name'

        //                     valueExpr='name'
        //                     onValueChanged={(e) => {
        //                         formik.setFieldValue('PackageName', e.value)
        //                     }}
        //                 />

        //             </td>
        //         )
        //     }
        // },
        // {
        //     field: "Amount",
        //     // // columnMenu: ColumnMenu,
        //     // filterable: true,
        //     name: "مقدار",
        //     // filter: "numeric",
        //     width: "100px",
        //     // reorderable: true,
        //     cell: (props) => {

        //         return (
        //             <td className="Amount_Needs">
        //                 <input
        //                     className="form-input"
        //                     type="text"
        //                     id="Amount"
        //                     name="Amount"
        //                     style={{ width: "80px" }}
        //                     onChange={(e) => formik.setFieldValue(`Amount[${props.dataIndex}]`, { value: e.target.value, id: props?.dataItem?.PackageId })}
        //                     onBlur={formik.handleBlur}
        //                     value={formik.values?.Amount[props.dataIndex]?.value}
        //                 />
        //             </td>
        //         )
        //     }
        // }



    ];

    return (

        <Print
            printData={data}
            columnList={tempColumn}
            logo={CoddingIcon}
            title={t("نمایش جزییات")}
            subTitle={t("نیازمندی های خرید")}

        />
    )
}
export default PrintPage









