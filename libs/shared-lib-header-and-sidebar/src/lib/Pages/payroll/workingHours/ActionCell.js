import React, {useState} from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import {Box, Modal, Tooltip} from "@mui/material";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import trashIcon3 from "../../../assets/images/icons/trash-icon3.gif";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";



const ActionCell = (props) => {

    const { t, i18n } = useTranslation();
    const [openRemove, setOpenRemove] = useState(false)


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

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("ویرایش")}>
                        <IconButton variant="contained" color='info' className='kendo-action-btn'>
                            <Link to={`/Payroll/workingHours/workingHoursForm?id=${props.dataItem.PersonnelCode}`}>
                                <EditIcon />
                            </Link>
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
















































function f() {
    return <>

        <tr className='text-center'>
            <th >{("ردیف")}</th>
            <th >{("روز")}Day</th>
            <th >{("تاریخ")}Date</th>
            <th >{("شروع")}DayStartTime</th>
            <th >{("پایان")}DayEndTime</th>

            <th >{("موظفی")}Bound</th>
            <th >{("ورود")}StartTime</th>
            <th >{("خروج")}EndTime</th>
            <th >{("ورود")}StartTime2</th>
            <th >{("خروج")}EndTime2</th>
            <th >{("ورود")}StartTime3</th>
            <th >{("خروج")}EndTime3</th>

            <th >{("حضور")}Presence</th>
            <th >{("مرخصی از ساعت")}HourlyLeaveStartTime</th>
            <th >{("مرخصی تا ساعت")}HourlyLeaveEndTime</th>
            <th >{("غیبت")}Absence</th>
            <th >{("مرخصی روزانه")}DailyLeave</th>
            <th >{("مرخصی استعلاجی")}SickLeave</th>
            <th >{("جمع مرخصی")}TotalLeave</th>
            <th >{("ماموریت روزانه")}MissionDay</th>
            <th >{("ماموریت ساعتی")}MissionHours</th>
            <th >{("اضافه کار")}Overtime</th>
            <th >{("اضافه کار روز تعطیل")}HolidayOvertime</th>
            <th >{("تاخیر")}Delay</th>
            <th >{("تعجیل")}Rush</th>
            <th >{("کسر کار")}WorkDeduction</th>
        </tr>

    </>
}

