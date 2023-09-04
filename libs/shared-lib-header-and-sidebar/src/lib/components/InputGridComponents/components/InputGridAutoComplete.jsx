import { useTranslation } from "react-i18next"
import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import { useState } from "react"

const InputGridAutoComplete = ({
    innerWidth = 300,
    innerFontSize = '12px',
    backgroundColor = '#FFFFFF',
    loadingState,
    ...props
}) => {
    const { t, i18n } = useTranslation()
    const [width, setWidth] = useState(innerWidth)
    const [fontSize, setFontSize] = useState(innerFontSize)
    const [bgColor, setBgColor] = useState(backgroundColor)
    return (
        <Autocomplete
            componentsProps={{
                paper: {
                    sx: {
                        width: { width },
                        maxWidth: '90vw',
                        direction: i18n.dir(),
                        position: "absolute",
                        fontSize: { fontSize },
                        right: i18n.dir() === "rtl" ? "0" : "unset"
                    }
                }
            }}
            sx={
                {
                    direction: i18n.dir(),
                    position: "relative",
                    background: { bgColor },
                    borderRadius: 0,
                    fontSize: { fontSize }
                }
            }
            size="small"
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            disableClearable={true}
            forcePopupIcon={false}
            noOptionsText={t("اطلاعات یافت نشد")}
            loading
            loadingText={loadingState ? <CircularProgress /> : t("اطلاعات یافت نشد")}
            renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                    <input type="text" {...params.inputProps} className='form-input' />
                </div>
            )}
            {...props}
        />
    )
}
export default InputGridAutoComplete