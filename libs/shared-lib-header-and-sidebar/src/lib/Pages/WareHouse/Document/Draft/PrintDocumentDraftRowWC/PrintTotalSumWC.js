import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"
import { CurrencyCell, IndexCell } from "rkgrid";
import {PrintGridEmpty} from "sepakuland-component-print";



const PrintTotalSumWC = ({ data }) => {
    const { t, i18n } = useTranslation();

    const dataRef = useRef()
    dataRef.current = data

    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${i18n.language == 'en' ? 'border-right-0' : 'border-left-0'}`} style={{ height: '36px' }}>
                <div className={`empty-footer-border justify-content-start ${i18n.language == 'en' ? 'border-right-1' : 'border-left-1'}`}>
                    {t('جمع')}<br />
                </div>
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
            <td className={'td-p0 border-left-0'} >
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalAmount?.toLocaleString()}
                    </div>
                </div>
            </td>


        );
    };
    const NoFooter = (props) => <td className={'td-p0 border-left-0'} >
        <div>
            <div className='empty-footer-border'></div>
        </div>
    </td>

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: "ردیف",
            cell: IndexCell,
            footerCell: CustomTotalTitle,
        },
        {
            field: "Code",
            name: "کد کالا",
            footerCell: NoFooter
        },
        {
            field: "Name",
            name: "نام کالا",
            footerCell: NoFooter
        },
        {
            field: "Count",
            name: "تعداد",
            footerCell: NoFooter
        },
        {
            field: "Equal",
            name: "معادل",
            footerCell: NoFooter
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
        <div className="no-header no-body">

            <PrintGridEmpty
                printData={data}
                columnList={tempColumn}
            />
        </div>
    )

}

export default PrintTotalSumWC