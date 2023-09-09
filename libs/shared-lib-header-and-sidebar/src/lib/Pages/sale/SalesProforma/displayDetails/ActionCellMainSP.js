import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { history } from '../../../../utils/history'
import MyMap from '../../../../components/map';


const ActionCellSP = (props) => {

    let loc = props.dataItem.Corrdinates.split(',')

    const { t, i18n } = useTranslation();
    const [defaultLoc, setDefaultLoc] = useState({ lat: loc[1], lng: loc[0] })
    const [addressLoading, setAddressLoading] = useState(false)

    function getMapData(fullAddress, currentPos) {
        console.log('fullAddress', fullAddress)
        console.log('currentPos', currentPos)
    }



    function callReceipt() {
        history.navigate(`FinancialTransaction/receiptDocument/General/Issuance?id=${props.dataItem.OrderId}`)
    }


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >
                    {props.dataItem.State === 'نهایی' ?
                        <Tooltip title={t("رسید")}>
                            <IconButton variant="contained" color='success' className='kendo-action-btn' onClick={() => { callReceipt() }}>
                                <AttachMoneyIcon />
                            </IconButton >
                        </Tooltip> :
                        <div className='kendo-action-btn'></div>}

                    {props.dataItem.Corrdinates !== "" ?
                        <Tooltip title={t("نقشه")}>
                            <IconButton variant="contained" color='primary' className='kendo-action-btn' >
                                <MyMap defaultLoc={defaultLoc}
                                    getMapData={getMapData} setAddressLoading={setAddressLoading} />
                            </IconButton >
                        </Tooltip> :
                        <div className='kendo-action-btn'></div>}
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={console.log("edit", props.dataItem.OrderId)}>
                            <EditIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color='error' className='kendo-action-btn' onClick={console.log("delete", props.dataItem.OrderId)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>
                </div>
            </td>


        </>

    )
}

export default React.memo(ActionCellSP)