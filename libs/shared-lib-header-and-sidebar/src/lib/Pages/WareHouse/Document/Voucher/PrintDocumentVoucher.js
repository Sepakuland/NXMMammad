import Print from "sepakuland-component-print";
import CoddingIcon from "../../../../assets/images/Logo/CoddingIcon.jpg";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { DocumentVoucherData } from "./DocumentVoucherData";
import { FooterSome,IndexCell, CurrencyCell, TotalTitle,DateCell } from "rkgrid";


const PrintDocumentVoucher = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([])
    const dataRef = useRef()
    dataRef.current = data

    useEffect(() => {
        let tempData = DocumentVoucherData.map((data) => {
            let temp = (data.Value.Price).toString().replaceAll(',', '')
            let price = temp !== '' ? parseFloat(temp, 2) : 0

            return {
                ...data,
                DocumentCode: data.Value.DocumentCode !== '' ? parseInt(data.Value.DocumentCode) : '',
                PersonName: data.Value.PersonName,
                StorekeeperCode: data.Value.StorekeeperCode !== '' ? parseInt(data.Value.StorekeeperCode) : '',
                StorekeeperName: data.Value.StorekeeperName,
                WarehouseCode: data.Value.WarehouseCode !== '' ? parseInt(data.Value.WarehouseCode) : '',
                WarehouseName: data.Value.WarehouseName,
                DocumentTypeName: data.Value.DocumentTypeName,
                DocumentRefCode: data.Value.DocumentRefCode !== '' ? parseInt(data.Value.DocumentRefCode) : '',
                DocumentDate: new Date(data.Value.DocumentDate),
                Price: price,
                DocumentId: data.Value.DocumentId
            }
        })
        setData(tempData)
    }, [i18n.language])

    const CustomFooterSome = (props) => <FooterSome {...props} data={dataRef.current} />

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: TotalTitle,
        },
        {
            field: 'DocumentCode',
            name: "ش رسید",
        },
        {
            field: 'PersonName',
            name: "تحویل‌دهنده",
        },
        {
            field: 'StorekeeperCode',
            name: "کد انباردار",
        },
        {
            field: 'StorekeeperName',
            name: "نام انباردار",
        },
        {
            field: 'WarehouseCode',
            name: "کد انبار",
        },
        {
            field: 'WarehouseName',
            name: "نام انبار",
        },
        {
            field: 'DocumentTypeName',
            name: "نوع",
        },
        {
            field: 'DocumentRefCode',
            name: "شماره ارجاع",
        },
        {
            field: 'DocumentDate',
            // format: "{0:d}",
            name: "تاریخ",
            cell: DateCell,
        },
        {
            field: 'Price',
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSome,
        }
    ]
    return (
        <>
            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("نمایش جزئیات")}
                subTitle={t("رسیدهای انبار")}
            >
            </Print>

        </>
    )
}

export default PrintDocumentVoucher 