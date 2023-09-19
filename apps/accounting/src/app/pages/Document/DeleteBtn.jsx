import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Delete from "@mui/icons-material/Delete";



const DeleteBtn = () => {

    const {t, i18n} = useTranslation();




    return (

        <div>
            <Tooltip title={t("حذف")} arrow>
                <Button
                    // aria-describedby={idSearch}
                    variant="outlined"
                    style={
                        i18n.dir() === "rtl"
                          ? { marginLeft: "4px" }
                          : { marginRight: "4px" }
                      }
                    className="kendo-setting-btn"
                    onClick={console.log("Deletttttttttttttttte!")}

                >
                    <Delete/>
                </Button>
            </Tooltip>
          
        </div>

    )

}

export default DeleteBtn