import { useRef } from "react";
import { useTranslation } from "react-i18next"
import { IndexCell } from "rkgrid";
import {PrintGridEmpty} from "sepakuland-component-print";



const PrintTotalSumWOC = ({ data }) => {
    const { t, i18n } = useTranslation();

    const dataRef = useRef()
    dataRef.current = data

    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${i18n.language == 'en' ? 'border-right-0' : 'border-left-0'}`} >
                <div className={`empty-footer-border justify-content-start ${i18n.language == 'en' ? 'border-right-1' : 'border-left-1'}`}>
                    {t('جمع')}<br />
                </div>
            </td>

        );
    };

    const NoFooter = (props) => <td/>

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

export default PrintTotalSumWOC