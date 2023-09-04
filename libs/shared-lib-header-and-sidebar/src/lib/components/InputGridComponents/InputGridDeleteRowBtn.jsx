import { IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';

const InputGridDeleteRowBtn = (props) => {
    return (
        <IconButton
            variant="contained"
            color="error"
            className='kendo-action-btn'
            data-cy='Remove-grid-icon'
            {...props}
        >
            <DeleteIcon />
        </IconButton>
    )
}

export default InputGridDeleteRowBtn