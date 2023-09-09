import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AutorenewIcon from '@mui/icons-material/Autorenew';



const ActionCellMain = (props) => {

    const { t, i18n } = useTranslation();
    const callBackComponent = (data) => {
        if (data?.AccountReviewLevel == 1 || data?.AccountReviewLevel == 7) {
            props.GetStatus({ state: "گردش حساب", name: data?.AccountNameGroup, id: data?.CodingId, level: 1, detailsId: null })
        }
        else if (data?.AccountReviewLevel == 2 || data?.AccountReviewLevel == 8) {
            props.GetStatus({ state: "گردش حساب", name: data?.AccountNameTotal, id: data?.CodingId, level: 2, detailsId: null })
        }
        else if (data?.AccountReviewLevel == 3 || data?.AccountReviewLevel == 9) {

            props.GetStatus({ state: "گردش حساب", name: data?.AccountNameSpecific, id: data?.CodingId, level: 3, detailsId: null })
        }
        else if (data?.AccountReviewLevel == 4 || data?.AccountReviewLevel == 10) {
            props.GetStatus({ state: "گردش حساب", name: data?.AccountNameEntity4, id: data?.CodingId, level: 4, detailsId: data.DetailedTypeGuid4 })
        }
        else if (data?.AccountReviewLevel == 5 || data?.AccountReviewLevel == 11) {
            props.GetStatus({ state: "گردش حساب", name: data?.AccountNameEntity5, id: data?.CodingId, level: 5, detailsId: data.DetailedTypeGuid5 })
        }
        else if (data?.AccountReviewLevel == 6 || data?.AccountReviewLevel == 12) {
            props.GetStatus({ state: "گردش حساب", name: data?.AccountNameEntity6, id: data?.CodingId, level: 6, detailsId: data.DetailedTypeGuid6 })
        }
    }

    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >
                    <Tooltip title={t("گردش حساب")}>
                        <IconButton variant="contained" color='primary' className='kendo-action-btn' onClick={() => {

                            callBackComponent(props?.dataItem)
                        }}>
                            <AutorenewIcon />
                        </IconButton >
                    </Tooltip>
                </div>
            </td>

        </>

    )
}

export default React.memo(ActionCellMain)




