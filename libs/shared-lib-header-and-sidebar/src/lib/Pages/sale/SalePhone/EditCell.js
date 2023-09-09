import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import {Dialog, DialogContent, DialogContentText, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddAccountParty from "../../../components/Modals/AddAccountParty";



const EditCell = (props) => {

    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >
                    <Tooltip title={t("ویرایش اطلاعات طرف حساب")}>
                        <IconButton variant="contained" style={{ color: "#d38003" }}  onClick={() => handleClickOpen()} >
                            <EditIcon />
                        </IconButton >
                    </Tooltip>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        fullWidth={false}
                        maxWidth={'xl'}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"

                    >
                        <DialogContent sx={{ background: "#edeff2" }} >
                            <DialogContentText
                                id="scroll-dialog-description"
                                ref={descriptionElementRef}
                                tabIndex={-1}
                                sx={{ background: "#edeff2" }}

                            >
                                <AddAccountParty handleClose={handleClose} />
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                </div>
            </td>
        </>

    )
}

export default React.memo(EditCell)