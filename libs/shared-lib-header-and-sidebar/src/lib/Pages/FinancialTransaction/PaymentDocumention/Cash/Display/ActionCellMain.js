import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PieChartTwoToneIcon from '@mui/icons-material/PieChartTwoTone';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Modal } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import trashIcon3 from '../../../../../assets/images/icons/trash-icon3.gif'
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';


const ActionCell = (props) => {

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
    const {pathname}=location
 

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("تسهیم")}>
                        <IconButton variant="contained" className='kendo-action-btn purple-color' onClick={() => console.log('view', props.dataItem.DocumentCode)}>
                            <Link
                                to={`${pathname}/Sharing?lang=${i18n.language}&id=${props.dataItem.DocumentCode}`}
                                // target={"_blank"}
                                className={"link-tag"}>
                                <PieChartTwoToneIcon />
                            </Link>
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("چاپ")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={() => {
                            setAnchorPrint(null);
                        }}>
                            <Link
                                to={`${pathname}/PrintRow?lang=${i18n.language}&id=${props.dataItem.DocumentCode}`}
                                target={"_blank"}
                                className={"link-tag"}>
                                <PrintIcon />
                            </Link>
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn' onClick={() => console.log('edit', props.dataItem.DocumentCode)}>
                            <EditIcon />
                        </IconButton >
                    </Tooltip>

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

export default React.memo(ActionCell)




