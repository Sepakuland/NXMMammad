import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FolderIcon from '@mui/icons-material/Folder';


const ActionCellMain2 = (props) => {

    const { t, i18n } = useTranslation();



    const callBackComponent = (data) => {

        if (data?.DocumentLevel == 1) {
            props.GetStatus({ state: "گردش اسناد", name: data?.DocumentType, level: data?.DocumentLevel, DocumentCode: data?.DocumentCode, Date: data?.DocumentDate, ArticleDescription: data?.ArticleDescription })
        }
        else if (data?.DocumentLevel == 2) {
            props.GetStatus({ state: "گردش اسناد", name: data?.DocumentType, level: data?.DocumentLevel, DocumentCode: data?.DocumentCode, Date: data?.DocumentDate, ArticleDescription: data?.ArticleDescription })
        }
        else if (data?.DocumentLevel == 3) {

            props.GetStatus({ state: "گردش اسناد", name: data?.DocumentType, level: data?.DocumentLevel, DocumentCode: data?.DocumentCode, Date: data?.DocumentDate, ArticleDescription: data?.ArticleDescription })
        }
        else if (data?.DocumentLevel == 4) {
            props.GetStatus({ state: "گردش اسناد", name: data?.DocumentType, level: data?.DocumentLevel, DocumentCode: data?.DocumentCode, Date: data?.DocumentDate, ArticleDescription: data?.ArticleDescription })
        }
        else if (data?.DocumentLevel == 5) {
            props.GetStatus({ state: "گردش اسناد", name: data?.DocumentType, level: data?.DocumentLevel, DocumentCode: data?.DocumentCode, Date: data?.DocumentDate, ArticleDescription: data?.ArticleDescription })
        }
        else if (data?.DocumentLevel == 6) {
            props.GetStatus({ state: "گردش اسناد", name: data?.DocumentType, level: data?.DocumentLevel, DocumentCode: data?.DocumentCode, Date: data?.DocumentDate, ArticleDescription: data?.ArticleDescription })
        }
    }


    return (
        <>
            <td colSpan="1" >
                <div className={`d-flex justify-content-center`} >
                    <Tooltip title={t("سند")}>
                        <IconButton variant="contained" color='primary' className='kendo-action-btn' onClick={() => callBackComponent(props?.dataItem)}>
                            <FolderIcon />
                        </IconButton >
                    </Tooltip>
                </div>
            </td>
        </>
    )
}

export default React.memo(ActionCellMain2)




