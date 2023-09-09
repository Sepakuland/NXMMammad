import { useEffect,  useState } from "react";
import CoddingIcon from "../../../../../../../assets/images/Logo/CoddingIcon.jpg";
import { CurrencyCell, IndexCell } from "rkgrid";
import { useTranslation } from "react-i18next";
import Print from "sepakuland-component-print";


const TestBillWithEverything = ({ data }) => {
    const { t, i18n } = useTranslation();


    const CustomTotalTitle = (props) => {
        return (
            <td className={`td-p0 ${i18n.language == 'en' ? 'border-right-0' : 'border-left-0'}`} style={{ height: '72px' }}>
                <div className={`empty-footer-border ${i18n.language == 'en' ? 'border-right-1' : 'border-left-1'}`}>
                    {t('جمع')}
                </div>
                <div className={'empty-footer border-left-0'}> </div>
            </td>

        );
    };
    const NoFooter = (props) => <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
        <div>
            <div className='empty-footer-border'></div>
            <div className='empty-footer border-left-0'></div>
        </div>
    </td>
    const CustomFooterSumCount = (props) => {

        const [totalCount, setTotalCount] = useState(0)

        useEffect(() => {
            if (data?.length) {
                let tempTotalCount = data?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalCount(tempTotalCount)
            }

        }, [data])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalCount?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}></div>
                </div>
            </td>
        );
    };
    const CustomFooterSumAmount = (props) => {


        const [totalAmount, setTotalAmount] = useState(0)

        useEffect(() => {
            if (data?.length) {
                let tempTotalAmount = data?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalAmount(tempTotalAmount)
            }

        }, [data])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalAmount?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}></div>
                </div>
            </td>
        );
    };
    const CustomFooterSumRowDiscount = (props) => {

        const [totalRowDiscount, setTotalRowDiscount] = useState(0)

        useEffect(() => {
            if (data?.length) {
                let tempTotalRowDiscount = data?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalRowDiscount(tempTotalRowDiscount)
            }

        }, [data])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalRowDiscount?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}></div>
                </div>
            </td>
        );
    };
    const CustomFooterSumAfterDiscount = (props) => {

        const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)

        useEffect(() => {
            if (data?.length) {
                let tempTotalAfterDiscount = data?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalAfterDiscount(tempTotalAfterDiscount)
            }

        }, [data])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalAfterDiscount?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}></div>
                </div>
            </td>
        );
    };
    const CustomFooterSumVAT = (props) => {

        const [totalVAT, setTotalVAT] = useState(0)

        useEffect(() => {
            if (data?.length) {
                let tempTotalVAT = data?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalVAT(tempTotalVAT)
            }

        }, [data])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalVAT?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}>{t('مبلغ نهایی :')}</div>
                </div>
            </td>
        );
    };
    const CustomFooterSumFinalAmount = (props) => {
        const [totalFinalAmount, setTotalFinalAmount] = useState(0)

        useEffect(() => {
            if (data?.length) {
                let tempTotalFinalAmount = data?.reduce(
                    (acc, current) => acc + parseFloat(current[props.field]) || 0,
                    0
                );
                setTotalFinalAmount(tempTotalFinalAmount)
            }

        }, [data])

        return (
            <td className={'td-p0 border-left-0'} style={{ height: '72px' }}>
                <div>
                    <div className={` word-break empty-footer-border ${props?.className ? props?.className : ''}`} style={props.style}>
                        {totalFinalAmount?.toLocaleString()}
                    </div>
                    <div className={'empty-footer border-left-0'}>{totalFinalAmount?.toLocaleString()}</div>
                </div>
            </td>
        );
    };

    let tempColumn = [
        {
            field: 'IndexCell',
            width: '60px',
            name: " ",
            cell: IndexCell,
            footerCell: CustomTotalTitle,
        },
        {
            field: 'Code',
            name: "کد",
            footerCell: NoFooter
        },
        {
            field: 'Name',
            name: "نام کالا",
            footerCell: NoFooter
        },
        {
            field: 'Count',
            name: "تعداد",
            footerCell: CustomFooterSumCount
        },
        {
            field: 'Fee',
            name: "فی",
            footerCell: NoFooter
        },
        {
            field: 'Amount',
            name: "مبلغ",
            cell: CurrencyCell,
            footerCell: CustomFooterSumAmount
        },
        {
            field: 'RowDiscountValue',
            name: "تخفیف سطری",
            cell: CurrencyCell,
            footerCell: CustomFooterSumRowDiscount
        },
        {
            field: 'AfterDiscount',
            name: "پس از کسر تخفیف",
            cell: CurrencyCell,
            footerCell: CustomFooterSumAfterDiscount
        },
        {
            field: 'VAT',
            name: "مالیات ا.ا. (9%)",
            cell: CurrencyCell,
            footerCell: CustomFooterSumVAT
        },
        {
            field: 'FinalAmount',
            name: "مبلغ نهایی",
            cell: CurrencyCell,
            footerCell: CustomFooterSumFinalAmount
        }
    ]

    return (
        <>

            <Print
                printData={data}
                columnList={tempColumn}
                logo={CoddingIcon}
                title={t("صورتحساب فروش")}
            ></Print>

        </>
    )
}
export default TestBillWithEverything