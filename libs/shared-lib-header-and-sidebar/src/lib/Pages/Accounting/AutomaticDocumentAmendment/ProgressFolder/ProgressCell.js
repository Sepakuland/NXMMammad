import { React, useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';



 const ProgressCell = () => {





    
    function LinearProgressWithLabel(props) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate"  sx={{backgroundColor: '#e5e6e8', "& .MuiLinearProgress-bar": { backgroundColor: '#9CFF2E' } }} {...props} />


            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2"  color="text.secondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }
      LinearProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate and buffer variants.
         * Value between 0 and 100.
         */
        value: PropTypes.number.isRequired,
      };
  


    //   const styles = props => ({
    //     colorPrimary: {
    //       backgroundColor: '#00695C',
    //     },
    //     barColorPrimary: {
    //       backgroundColor: '#B2DFDB',
    //     }
    //   });
  
  
      
        const [progress, setProgress] = useState(10);
      
        useEffect(() => {
          const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
          }, 800);
          return () => {
            clearInterval(timer);
          };
        }, []);
      
  return (
    <td>
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
</td>
  )
}
export default ProgressCell
