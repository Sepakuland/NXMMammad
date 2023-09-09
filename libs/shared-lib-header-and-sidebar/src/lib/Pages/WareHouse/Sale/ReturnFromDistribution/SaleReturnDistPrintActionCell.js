import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import { Menu, MenuItem, Tooltip } from "@mui/material";

const ActionCell = (props) => {
    const { t, i18n } = useTranslation();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '1px solid #eee',
        boxShadow: 24,
        p: 7,
        direction: i18n.dir()
    };
    const [anchorElTotal, setAnchorElTotal] = React.useState(null);
    const handleTotalClick = (event) => {
        setAnchorElTotal(event.currentTarget);
    };
    const handleCloseTotal = () => {
        setAnchorElTotal(null);
    };
    const [anchorElBills, setAnchorElBills] = React.useState(null);
    const handleClickBills = (event) => {
        setAnchorElBills(event.currentTarget);
    };
    const handleCloseBills = () => {
        setAnchorElBills(null);
    };



    const TotalPrintWC = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/PrintTotalWC?id=${props.dataItem.TotalId}`, '_blank');
    }
    const TotalPrintWOC = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/PrintTotalWOC?id=${props.dataItem.TotalId}`, '_blank');
    }
    const DistributionTeamOnePrint = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/PrintDistributionTeamOne?id=${props.dataItem.TotalId}`, '_blank');
    }
    const DistributionTeamTwoPrint = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/PrintDistributionTeamTwo?id=${props.dataItem.TotalId}`, '_blank');
    }
    const UnofficialBillPrint = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/PrintUnofficialBill?id=${props.dataItem.TotalId}`, '_blank');
    }
    const OfficialBillPrint = () => {
        window.open(`/Warehouse/Sale/ReturnFromDist/PrintOfficialBill?id=${props.dataItem.TotalId}`, '_blank');
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-between`} >
                    <Tooltip title={t("سرجمع")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu" aria-haspopup="true" onClick={handleTotalClick}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("تیم پخش 1")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={DistributionTeamOnePrint}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("تیم پخش 2")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' onClick={DistributionTeamTwoPrint}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>
                    <Tooltip title={t("صورت حساب‌ها")}>
                        <IconButton variant="contained" style={{ color: "#1890ff" }} className='kendo-action-btn' aria-controls="simple-menu2" aria-haspopup="true" onClick={handleClickBills}>
                            <PrintIcon />
                        </IconButton >
                    </Tooltip>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorElTotal}
                        keepMounted
                        open={Boolean(anchorElTotal)}
                        onClose={handleCloseTotal}
                    >
                        <MenuItem onClick={TotalPrintWC}>{t("همراه با قیمت")}</MenuItem>
                        <MenuItem onClick={TotalPrintWOC}>{t("بدون قیمت")}</MenuItem>
                    </Menu>
                    <Menu
                        id="simple-menu2"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorElBills}
                        keepMounted
                        open={Boolean(anchorElBills)}
                        onClose={handleCloseBills}
                    >
                        <MenuItem onClick={UnofficialBillPrint}>{t("فاکتور غیررسمی")}</MenuItem>
                        <MenuItem onClick={OfficialBillPrint}>{t("فاکتور رسمی")}</MenuItem>
                    </Menu>
                </div>
            </td>

        </>

    )
}

export default React.memo(ActionCell)