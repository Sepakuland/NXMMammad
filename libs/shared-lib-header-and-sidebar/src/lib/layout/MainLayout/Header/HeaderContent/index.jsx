// material-ui
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  useMediaQuery,
} from '@mui/material';
// import { IconCalendarStats } from '@tabler/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import ThemeToggle from './ThemeToggle';
import LanguageSwitch from '../../../Customization/LanguageSwitch';
import i18next, { t } from 'i18next';
import { SelectBox } from 'devextreme-react';
import { useSelector, useDispatch } from 'react-redux';
import { setFiscalYearId } from '../../../../store/reducers/fiscalYear';
import { useFetchFiscalYearQuery } from '../../../../features/slices/FiscalYearSlice';
import { apiSlice } from '../../../../features/api-slice';
import { Link, Navigate } from 'react-router-dom';
import { IconCalendarStats } from '@tabler/icons';
// import { IconCalendarStats } from '@tabler/icons';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  /* -------------------------------------------------------------------------- */
  /*                                  RTK Query                                 */
  /* -------------------------------------------------------------------------- */
  const fiscalYear = useSelector(
    (state) => state.reducer.fiscalYear.fiscalYearId
  );
  const {
    data: allFiscalYears = [{ fiscalYearId: 0 }],
    isFetching: allFiscalYearsIsFetching,
    error: allFiscalYearsSearchError,
  } = useFetchFiscalYearQuery('', {
    skip: fiscalYear !== 0,
  });

  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  useEffect(() => {
    if (allFiscalYearsIsFetching) {
      setContent(<CircularProgress />);
    } else if (allFiscalYearsSearchError) {
      setContent(t('خطایی رخ داده است'));
    } else {
      if (allFiscalYears.length > 0) {
        setContent('');
        dispatch(
          setFiscalYearId(
            allFiscalYears[allFiscalYears.length - 1].fiscalYearId
          )
        );
      }
    }
  }, [allFiscalYearsIsFetching]);

  const callBackComponent = () => {
    Navigate(`/baseInformation/accounting/FiscalYear/AddFiscalYear`, {
      replace: false,
    });
  };

  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 }, marginRight: '35px' }}>
        {allFiscalYears.length != 0 ? (
          <div style={{ display: 'flex' }}>
            <IconButton style={{ position: 'absolute', zIndex: '999' }}>
              <IconCalendarStats />
            </IconButton>
            {content === '' ? (
              <SelectBox
                dataSource={allFiscalYears}
                rtlEnabled={i18next.dir() == 'ltr' ? false : true}
                onValueChanged={(e) => {
                  dispatch(setFiscalYearId(e.value));
                  dispatch(
                    apiSlice.util.invalidateTags([
                      'AccountingDocument',
                      'AccountingDocumentRecycleBin',
                      'AccountingDocumentNumbers',
                    ])
                  );
                }}
                className="header-selectBox"
                noDataText={t('اطلاعات یافت نشد')}
                itemRender={null}
                displayExpr="fiscalYearName"
                valueExpr="fiscalYearId"
                placeholder=""
                name="fiscalYear"
                id="fiscalYear"
                //searchEnabled             برای سرچ
                //showClearButton           امکان پاک کردن فیلد
                value={fiscalYear}
                defaultValue={
                  fiscalYear === 0
                    ? allFiscalYears[allFiscalYears.length - 1].fiscalYearId
                    : fiscalYear
                }
              />
            ) : (
              content
            )}
          </div>
        ) : (
          <Link>
            <Button
              variant="contained"
              color="primary"
              style={{ height: '38px', margin: '8px' }}
              onClick={callBackComponent}
            >
              {t('ایجاد سال مالی')}
            </Button>
          </Link>
        )}
      </Box>
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      {!matchesXs && <ThemeToggle />}
      {!matchesXs && <LanguageSwitch />}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
