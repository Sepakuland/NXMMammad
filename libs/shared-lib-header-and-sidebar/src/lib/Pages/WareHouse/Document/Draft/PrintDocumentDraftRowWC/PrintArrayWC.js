import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import {PrintGridEmpty} from "sepakuland-component-print";
import { CurrencyCell } from "rkgrid";


const PrintArrayWC = ({ data, start }) => {
    const { t, i18n } = useTranslation();

    const dataRef = useRef()
    dataRef.current = data

    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${i18n.language == 'en' ? 'border-right-0' : 'border-left-0'}`} colSpan={3} >
                <div className={`empty-footer-border justify-content-start ${i18n.language == 'en' ? 'border-right-1' : 'border-left-1'}`} style={{ height: "auto" }}>
                    {t('جمع سبد کالای 5')} <br />
                    {t('تست')}<br />
                    {t('سبد کالا 3')}<br />
                    {t('سبد کالای 1')}<br />
                </div>
            </td>

        );
    };

    const CustomIndexCell = (props) => {

        return (
            <td colSpan="1" >
                <span>{props.dataIndex + 1 + start}</span>
            </td>

        )
    }

    const CustomFooterSumCount = (props) => {

        const [totalCount, setTotalCount] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalCount = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalCount(tempTotalCount)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalCount?.toLocaleString()}
            </td>
        );
    };
    const CustomFooterSumEqual = (props) => {

        const [totalEqual, setTotalEqual] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalEqual = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalEqual(tempTotalEqual)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalEqual?.toLocaleString()}
            </td>
        );
    };
    const CustomFooterSumAmount = (props) => {

        const [totalAmount, setTotalAmount] = useState(0)

        useEffect(() => {
            if (dataRef.current?.length) {
                let tempTotalAmount = dataRef.current?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalAmount(tempTotalAmount)
            }

        }, [dataRef.current])

        return (
            <td>
                {totalAmount?.toLocaleString()}
            </td>


        );
    };
    const NoFooter = (props) => <td />



    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: CustomIndexCell,
            footerCell: CustomTotalTitle,
        },
        {
            field: "Code",
            name: "کد کالا",
            footerCell: () => <></>
        },
        {
            field: "Name",
            name: "نام کالا",
            footerCell: () => <></>
        },
        {
            field: "Count",
            name: "تعداد",
            footerCell: CustomFooterSumCount
        },
        {
            field: "Equal",
            name: "معادل",
            footerCell: CustomFooterSumEqual
        },
        {
            field: "Fee",
            name: "فی",
            footerCell: NoFooter
        },
        {
            field: "Amount",
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSumAmount,
        },
        {
            field: "Description",
            name: "توضیحات",
            footerCell: () => <></>
        }
    ]

    return (
        <div className="no-header">

            <PrintGridEmpty
                printData={data}
                columnList={tempColumn}
            />
        </div>
    )

}

export default PrintArrayWC