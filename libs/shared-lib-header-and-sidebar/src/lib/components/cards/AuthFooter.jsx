// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="xl" style={{direction:"rtl"}}>
            <Stack
                direction={matchDownSM ? 'column' : 'row'}
                justifyContent={matchDownSM ? 'center' : 'space-between'}
                spacing={2}
                textAlign={matchDownSM ? 'center' : 'inherit'}
            >
                <Typography variant="subtitle2" color="secondary" component="span">
                    &copy; تمامی حقوق این سایت متعلق به شرکت مهندسی &nbsp;
                    <Typography component={Link} variant="subtitle2" href="https://mydejban.com" target="_blank" underline="hover">
                    پیام گستر فاوا&nbsp;
                    </Typography>
                    <Typography variant="subtitle2" color="secondary" component="span">
                    می باشد
                    </Typography>
                </Typography>

                <Stack
                    direction={matchDownSM ? 'column' : 'row'}
                    spacing={matchDownSM ? 1 : 3}
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                >
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href=""
                        target="_blank"
                        underline="hover"
                    >
                        سیاست حفظ حریم خصوصی&nbsp;&nbsp;&nbsp;
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href=""
                        target="_blank"
                        underline="hover"
                    >
                        پشتیبانی
                    </Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default AuthFooter;
