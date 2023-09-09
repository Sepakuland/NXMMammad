import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Modal, Tooltip } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../assets/images/icons/trash-icon3.gif';
import { useLocation } from "react-router";
import { history } from "../../../utils/history";
import { IconAbacus, IconScale } from '@tabler/icons';



const ActionCellMainCheque = (props) => {
    const [showCount, setShowCount] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showBalance, setShowBalance] = useState(false)

    const [openRemove, setOpenRemove] = useState(false)
    const { t, i18n } = useTranslation();
    const [anchorPrint, setAnchorPrint] = useState(null);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 4,
        direction: i18n.dir()
    };
    const location = useLocation()
    const { pathname } = location
    const PrintSelected = () => {
        window.open(`/WareHouse/PrintSelectedWareHouseingEra?id=${props.dataItem.WarehousingPeriodId}&lang=${i18n.language}`, '_blank');
    }
    const Counting = () => {
        // history.navigate(`/FinancialTransaction/receiptDocument/Cheque/EditMultiPlexing?id=${props.dataItem.DocumentCode}`, 'noopener,noreferrer')
        history.navigate(`/WareHouse/Counting?id=${props.dataItem.WarehousingPeriodId}&lang=${i18n.language}`)
    }
    const Balanced = () => {
        history.navigate(`/WareHouse/ConflictBalance?id=1805`)
        console.log("balance", props.dataItem.Status)
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" color='primary' className='kendo-action-btn' onClick={PrintSelected}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    {props.dataItem.Status == "شمارش" ? (
                        <Tooltip title={t("ویرایش")}>
                            <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={() => console.log('edit', props.dataItem.WarehousingPeriodId)}>
                                <EditIcon />
                            </IconButton >
                        </Tooltip>) : <div className="kendo-action-btn" style={{ cursor: 'unset' }}></div>}

                    {(props.dataItem.Status == "شمارش" || props.dataItem.Status == "بالانس مغایرت ها") ? (<Tooltip title={t("شمارش")}>
                        <IconButton variant="contained" className='kendo-action-btn ' style={{ color: "#d38003" }} onClick={() => Counting()}>
                            <IconAbacus />
                        </IconButton >
                    </Tooltip>) : <div className="kendo-action-btn" style={{ cursor: 'unset' }}></div>}

                    {(props.dataItem.Status == "بالانس مغایرت ها" || props.dataItem.Status == "نهایی") ? (<Tooltip title={t("بالانس مغایرت ها")}>
                        <IconButton variant="contained" className='kendo-action-btn purple-color' onClick={() => Balanced()}>
                            <IconScale />
                        </IconButton >
                    </Tooltip>) : <div className="kendo-action-btn" style={{ cursor: 'unset' }}></div>}
                    <Tooltip title={t("حذف")}>
                        <IconButton variant="contained" color="error" className='kendo-action-btn' onClick={() => setOpenRemove(true)}>
                            <DeleteIcon />
                        </IconButton >
                    </Tooltip>

                </div>
            </td>
            <Modal
                open={openRemove}
                onClose={() => setOpenRemove(false)}
            >
                <Box sx={style} style={{ textAlign: 'center', width: '450px' }}>
                    <img src={trashIcon3} alt={'remove'} className='remove-icon' />
                    <p>
                        {t('شما در حال حذف کردن یک آیتم هستید')}
                        <br />
                        {t('آیا از این کار مطمئنید؟')}
                        <br />
                    </p>

                    <div className='d-flex justify-content-center'>
                        <Button variant="contained" color={'success'} startIcon={<DoneIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />} style={{ margin: '0 2px' }}>{t('بله مطمئنم')}</Button>
                        <Button
                            variant="contained"
                            color={'error'}
                            startIcon={<CloseIcon style={i18n.dir() === 'rtl' ? { marginLeft: '5px' } : { marginRight: '5px' }} />}
                            style={i18n.dir() === 'rtl' ? { marginRight: '10px' } : { marginLeft: '10px' }}
                            onClick={() => setOpenRemove(false)}
                        >{t('انصراف')}</Button>
                    </div>
                </Box>
            </Modal>

        </>

    )
}

export default React.memo(ActionCellMainCheque)



