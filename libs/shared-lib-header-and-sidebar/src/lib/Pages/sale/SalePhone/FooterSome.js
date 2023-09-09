import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const FooterSome = props => {

    const {t, i18n} = useTranslation();
    const [total,setTotal]=useState(0)

    useEffect(()=>{
        if(props.data?.length){
            let creditor=props?.data.filter(item=>item.PartnerDebt.includes('بس'))
            let debtor=props?.data.filter(item=>item.PartnerDebt.includes('بد'))

            let tempTotalCreditor = creditor?.reduce(
                (acc, current) => acc + parseFloat(current.PartnerDebt.replaceAll(',',''))||0,
                0
            );

            let tempTotalDebtor = debtor?.reduce(
                (acc, current) => acc + parseFloat(current.PartnerDebt.replaceAll(',',''))||0,
                0
            );


            let tempTotal=tempTotalCreditor-tempTotalDebtor


            setTotal(tempTotal)
        }

    },[props.data])

    return (
        <td colSpan={props.colSpan} className={` word-break ${props?.className?props?.className:''}`} style={props.style}>
            {Math.abs(total)?.toLocaleString()}{total>0&&<span style={i18n.dir()==='rtl'?{marginRight:'4px'}:{marginLeft:'4px'}}>{t('بس')}</span>}{total<0&&<span style={i18n.dir()==='rtl'?{marginRight:'4px'}:{marginLeft:'4px'}}>{t('بد')}</span>}
        </td>
    );
};

export default React.memo(FooterSome)