import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Guid from 'devextreme/core/guid';
import { useSearchCodingQuery } from '@kara-erp/shared-lib-header-and-sidebar';
import { useSearchDetailedAccountQuery } from '@kara-erp/shared-lib-header-and-sidebar';
import { CreateQueryString } from '@kara-erp/shared-lib-header-and-sidebar';
import objectNotNull from '@kara-erp/shared-lib-header-and-sidebar';
import InputMask from '@kara-erp/shared-lib-header-and-sidebar';
import { parsFloatFunction } from '@kara-erp/shared-lib-header-and-sidebar';
import CachedIcon from '@mui/icons-material/Cached';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { julianIntToDate } from '@kara-erp/shared-lib-header-and-sidebar';
import {
  GHAutocomplete,
  GHCurrencyInput,
  GHDatepicker,
  GHGrid,
  GHInput,
  KeyboardNavigation,
} from 'react-input-grid';

export const InputGrid = ({
  formik,
  creditsTotal,
  setCreditsTotal,
  debitsTotal,
  setDebitsTotal,
  showArticles,
  setShowArticles,
}) => {
  const { t, i18n } = useTranslation();
  const emptyArticles = {
    documentArticleGuid: new Guid().valueOf(),
    moeinAccountId: null,
    detailed4Id: null,
    detailed5Id: null,
    detailed6Id: null,
    debits: 0,
    credits: 0,
    notes: '',
    trackingNumber: '',
    trackingDate: null,
  };
  function renderBalanceClassName() {
    if (creditsTotal > debitsTotal) {
      return 'balanceFieldGreen';
    } else if (creditsTotal < debitsTotal) {
      return 'balanceFieldRed';
    } else {
      return '';
    }
  }
  function renderBalanceState() {
    if (creditsTotal > debitsTotal) {
      return t('بستانکار');
    } else if (creditsTotal < debitsTotal) {
      return t('بدهکار');
    } else {
      return '';
    }
  }
  function CalculateDebitsTotal(articles) {
    let debitsTemp = 0;
    articles.forEach((element) => {
      debitsTemp += parseFloat(element.debits, 2) || 0;
      setDebitsTotal(parsFloatFunction(debitsTemp, 2));
    });
  }

  function CalculateCreditsTotal(articles) {
    let creditsTemp = 0;
    articles.forEach((element) => {
      creditsTemp += parseFloat(element.credits, 2) || 0;
      setCreditsTotal(parsFloatFunction(creditsTemp, 2));
    });
  }
  /* -------------------------------------------------------------------------- */
  /*                               RTKQuery/Redux                               */
  /* -------------------------------------------------------------------------- */
  const [moeinSkip, setMoeinSkip] = useState(true);
  const [detailed4Skip, setDetailed4Skip] = useState(true);
  const [detailed5Skip, setDetailed5Skip] = useState(true);
  const [detailed6Skip, setDetailed6Skip] = useState(true);
  const [codingSearchParam, setCodingSearchParam] = useState('');
  const {
    data: codingSearchResult = [],
    isFetching: codingSearchIsFetching,
    error: codingSearchError,
  } = useSearchCodingQuery(codingSearchParam, {
    skip: moeinSkip,
  });

  const [detailed4SearchParam, setDetailed4SearchParam] = useState('');
  const {
    data: detailed4SearchResult = [],
    isFetching: detailed4SearchIsFetching,
    error: detailed4SearchError,
  } = useSearchDetailedAccountQuery(detailed4SearchParam, {
    skip: detailed4Skip,
  });

  const [detailed5SearchParam, setDetailed5SearchParam] = useState('');
  const {
    data: detailed5SearchResult = [],
    isFetching: detailed5SearchIsFetching,
    error: detailed5SearchError,
  } = useSearchDetailedAccountQuery(detailed5SearchParam, {
    skip: detailed5Skip,
  });

  const [detailed6SearchParam, setDetailed6SearchParam] = useState('');
  const {
    data: detailed6SearchResult = [],
    isFetching: detailed6SearchIsFetching,
    error: detailed6SearchError,
  } = useSearchDetailedAccountQuery(detailed6SearchParam, {
    skip: detailed6Skip,
  });

  /* ----------------------------- Row Management ----------------------------- */
  function addDocumentArticlesRow() {
    formik.setFieldValue('documentArticles', [
      ...formik.values.documentArticles,
      emptyArticles,
    ]);
  }
  const [documentArticlesFocusedRow, setDocumentArticlesFocusedRow] =
    useState(1);
  /* --------------- AutoComplete open states and their handlers -------------- */
  const [moeinAccountOpen, setMoeinAccountOpen] = useState(false);

  function RenderMoeinAccountOpenState(index, state) {
    if (index === documentArticlesFocusedRow - 1) {
      setMoeinAccountOpen(state);
    } else {
      setMoeinAccountOpen(false);
    }
  }

  const [detailedOpen4, setDetailedOpen4] = useState(false);
  const [detailedOpen5, setDetailedOpen5] = useState(false);
  const [detailedOpen6, setDetailedOpen6] = useState(false);

  function RenderDetailedOpenState4(index, state) {
    if (index === documentArticlesFocusedRow - 1) {
      setDetailedOpen4(state);
    } else {
      setDetailedOpen4(false);
    }
  }

  function RenderDetailedOpenState5(index, state) {
    if (index === documentArticlesFocusedRow - 1) {
      setDetailedOpen5(state);
    } else {
      setDetailedOpen5(false);
    }
  }

  function RenderDetailedOpenState6(index, state) {
    if (index === documentArticlesFocusedRow - 1) {
      setDetailedOpen6(state);
    } else {
      setDetailedOpen6(false);
    }
  }
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                       AutoComplete requests on change                      */
  /* -------------------------------------------------------------------------- */

  /* ----------------------------- Search Formiks ----------------------------- */
  const moeinAccountSearchFormik = useFormik({
    initialValues: {
      CompleteCode: '',
      FormersNames: '',
      CodingLevel: 3,
    },
    onSubmit: (values) => {
      setCodingSearchParam(CreateQueryString(values));
      setMoeinSkip(CreateQueryString(values) === '');
    },
  });

  const detailed4SearchFormik = useFormik({
    initialValues: {
      DetailedAccountCode: '',
      DetailedAccountName: '',
      DetailedTypeID: [],
      IsDetailedAccountActive: true,
    },
    onSubmit: (values) => {
      setDetailed4SearchParam(CreateQueryString(values));
      setDetailed4Skip(CreateQueryString(values) === '');
    },
  });

  const detailed5SearchFormik = useFormik({
    initialValues: {
      DetailedAccountCode: '',
      DetailedAccountName: '',
      DetailedTypeID: [],
      IsDetailedAccountActive: true,
    },
    onSubmit: (values) => {
      setDetailed5SearchParam(CreateQueryString(values));
      setDetailed5Skip(CreateQueryString(values) === '');
    },
  });

  const detailed6SearchFormik = useFormik({
    initialValues: {
      DetailedAccountCode: '',
      DetailedAccountName: '',
      DetailedTypeID: [],
      IsDetailedAccountActive: true,
    },
    onSubmit: (values) => {
      setDetailed6SearchParam(CreateQueryString(values));
      setDetailed6Skip(CreateQueryString(values) === '');
    },
  });

  /* ----------------------------- Change Handlers ---------------------------- */
  const HandleMoeinAccountChange = (value) => {
    if (isNaN(value)) {
      moeinAccountSearchFormik.setFieldValue('FormersNames', value);
      moeinAccountSearchFormik.setFieldValue('CompleteCode', '');
    } else {
      moeinAccountSearchFormik.setFieldValue('CompleteCode', value);
      moeinAccountSearchFormik.setFieldValue('FormersNames', '');
    }
  };
  const debouncedHandleMoeinAccountChange = useMemo(
    () => debounce(moeinAccountSearchFormik.handleSubmit, 500),
    []
  );

  const HandleDetailed4Change = (value) => {
    if (isNaN(value)) {
      detailed4SearchFormik.setFieldValue('DetailedAccountName', value);
      detailed4SearchFormik.setFieldValue('DetailedAccountCode', '');
    } else {
      detailed4SearchFormik.setFieldValue('DetailedAccountCode', value);
      detailed4SearchFormik.setFieldValue('DetailedAccountName', '');
    }
  };
  const debouncedHandleDetailed4Change = useMemo(
    () => debounce(detailed4SearchFormik.handleSubmit, 500),
    []
  );

  const HandleDetailed5Change = (value) => {
    if (isNaN(value)) {
      detailed5SearchFormik.setFieldValue('DetailedAccountName', value);
      detailed5SearchFormik.setFieldValue('DetailedAccountCode', '');
    } else {
      detailed5SearchFormik.setFieldValue('DetailedAccountCode', value);
      detailed5SearchFormik.setFieldValue('DetailedAccountName', '');
    }
  };
  const debouncedHandleDetailed5Change = useMemo(
    () => debounce(detailed5SearchFormik.handleSubmit, 500),
    []
  );

  const HandleDetailed6Change = (value) => {
    if (isNaN(value)) {
      detailed6SearchFormik.setFieldValue('DetailedAccountName', value);
      detailed6SearchFormik.setFieldValue('DetailedAccountCode', '');
    } else {
      detailed6SearchFormik.setFieldValue('DetailedAccountCode', value);
      detailed6SearchFormik.setFieldValue('DetailedAccountName', '');
    }
  };
  const debouncedHandleDetailed6Change = useMemo(
    () => debounce(detailed6SearchFormik.handleSubmit, 500),
    []
  );

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  const CodingCell = (index) => {
    return (
      <div className={`table-autocomplete position-relative`}>
        <GHAutocomplete
          loadingState={codingSearchIsFetching}
          innerWidth={300}
          value={formik.values.documentArticles[index].moeinAccountId}
          renderOption={(props, option) => {
            return (
              <Box component="li" {...props} key={option.completeCode}>
                {option.completeCode}-{option.formersNames}
              </Box>
            );
          }}
          filterOptions={(options, state) => {
            let newOptions = [];
            options.forEach((element) => {
              if (
                element.completeCode.includes(state.inputValue.toLowerCase()) ||
                element.formersNames
                  .replace('/', '')
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              )
                newOptions.push(element);
            });
            return newOptions;
          }}
          open={
            documentArticlesFocusedRow === index + 1 ? moeinAccountOpen : false
          }
          options={codingSearchResult}
          getOptionLabel={(option) => option.completeCode}
          onInputChange={(event, value) => {
            if (value !== '' && event !== null) {
              RenderMoeinAccountOpenState(index, true);
              HandleMoeinAccountChange(value);
              debouncedHandleMoeinAccountChange(value);
            } else {
              RenderMoeinAccountOpenState(index, false);
            }
          }}
          onChange={(event, value) => {
            RenderMoeinAccountOpenState(index, false);
            formik.setFieldValue(
              `documentArticles[${index}].moeinAccountId`,
              value
            );
            detailed4SearchFormik.setFieldValue(
              `DetailedTypeID`,
              value.detailedType4Ids
            );
            detailed5SearchFormik.setFieldValue(
              `DetailedTypeID`,
              value.detailedType5Ids
            );
            detailed6SearchFormik.setFieldValue(
              `DetailedTypeID`,
              value.detailedType6Ids
            );
            var test = value.formersNames.split('/');
            setShowArticles({
              ...showArticles,
              group: test[0].trim(),
              kol: test[1].trim(),
              moein: value.name,
            });
          }}
          onBlur={(e) => {
            RenderMoeinAccountOpenState(index, false);
          }}
          onKeyDown={(e) => {
            if (
              (e.keyCode === 13 ||
                e.keyCode === 9 ||
                e.keyCode === 38 ||
                e.keyCode === 40 ||
                e.keyCode === 37 ||
                e.keyCode === 39) &&
              moeinAccountOpen === false
            ) {
              /* Enter */
              e.preventDefault();
              RenderMoeinAccountOpenState(index, false);
            }
            setTimeout(() => {
              KeyboardNavigation(
                e,
                [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
                formik.values.documentArticles,
                documentArticlesFocusedRow,
                addDocumentArticlesRow,
                i18n.dir()
              );
            }, 0);
          }}
        />
        <Tooltip title={t('ایجاد حساب معین')}>
          <IconButton
            aria-label={'Clear'}
            variant="contained"
            color={'success'}
            className="add-item-btn"
            sx={i18n.dir() === 'rtl' ? { left: 0 } : { right: 0 }}
          >
            <Link to={'/Accounting/coding'} target={'_blank'}>
              <AddCircleOutlineIcon fontSize="small" />
            </Link>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const detailed4Cell = (index) => {
    return (
      <div className={`table-autocomplete position-relative`}>
        <GHAutocomplete
          loadingState={detailed4SearchIsFetching}
          innerWidth={300}
          backgroundColor={
            formik.values.documentArticles[index].moeinAccountId
              ?.detailedType4Ids?.length == 0 ||
            !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
              ? '#EFEFEF4D'
              : '#FFFFFF'
          }
          value={formik.values.documentArticles[index].detailed4Id}
          disabled={
            formik.values.documentArticles[index].moeinAccountId
              ?.detailedType4Ids?.length == 0 ||
            !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
          }
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.detailedAccountId}>
              {option.detailedAccountCode}-({option.detailedAccountName})
            </Box>
          )}
          filterOptions={(options, state) => {
            let newOptions = [];
            options.forEach((element) => {
              if (
                element.detailedAccountCode.includes(
                  state.inputValue.toLowerCase()
                ) ||
                element.detailedAccountName
                  .replace('/', '')
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              )
                newOptions.push(element);
            });
            return newOptions;
          }}
          id="detailed4Id"
          name={`documentArticles.${index}.detailed4Id`}
          open={
            documentArticlesFocusedRow === index + 1 ? detailedOpen4 : false
          }
          options={detailed4SearchResult}
          getOptionLabel={(option) => option.detailedAccountCode}
          onInputChange={(event, value) => {
            if (value !== '' && event !== null) {
              //     setDetailedSkip(false)
              RenderDetailedOpenState4(index, true);
              HandleDetailed4Change(value);
              debouncedHandleDetailed4Change(value);
            } else {
              RenderDetailedOpenState4(index, false);
            }
          }}
          onChange={(event, value) => {
            RenderDetailedOpenState4(index, false);
            formik.setFieldValue(
              `documentArticles[${index}].detailed4Id`,
              value
            );
            setShowArticles({
              ...showArticles,
              detailed4: value.detailedAccountName,
            });
          }}
          onBlur={(e) => RenderDetailedOpenState4(index, false)}
          onKeyDown={(e) => {
            if (
              (e.keyCode === 13 ||
                e.keyCode === 9 ||
                e.keyCode === 38 ||
                e.keyCode === 40 ||
                e.keyCode === 37 ||
                e.keyCode === 39) &&
              detailedOpen4 === false
            ) {
              e.preventDefault();
              RenderDetailedOpenState4(index, false);
            }
            setTimeout(() => {
              KeyboardNavigation(
                e,
                [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
                formik.values.documentArticles,
                documentArticlesFocusedRow,
                addDocumentArticlesRow,
                i18n.dir()
              );
            }, 0);
          }}
        />
        <Tooltip title={t('ایجاد تفضیلی')}>
          <IconButton
            aria-label={'Clear'}
            variant="contained"
            color={'success'}
            className="add-item-btn"
            sx={i18n.dir() === 'rtl' ? { left: 0 } : { right: 0 }}
          >
            <Link to={'/baseInformation/accounting/entity'} target={'_blank'}>
              <AddCircleOutlineIcon fontSize="small" />
            </Link>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const detailed5Cell = (index) => {
    return (
      <div className={`table-autocomplete position-relative`}>
        <GHAutocomplete
          loadingState={detailed5SearchIsFetching}
          innerWidth={300}
          backgroundColor={
            formik.values.documentArticles[index].moeinAccountId
              ?.detailedType5Ids?.length == 0 ||
            !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
              ? '#EFEFEF4D'
              : '#FFFFFF'
          }
          value={formik.values.documentArticles[index].detailed5Id}
          disabled={
            formik.values.documentArticles[index].moeinAccountId
              ?.detailedType5Ids?.length == 0 ||
            !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
          }
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.detailedAccountId}>
              {option.detailedAccountCode}-({option.detailedAccountName})
            </Box>
          )}
          filterOptions={(options, state) => {
            let newOptions = [];
            options.forEach((element) => {
              if (
                element.detailedAccountCode.includes(
                  state.inputValue.toLowerCase()
                ) ||
                element.detailedAccountName
                  .replace('/', '')
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              )
                newOptions.push(element);
            });
            return newOptions;
          }}
          id="detailed5Id"
          name={`documentArticles.${index}.detailed5Id`}
          open={
            documentArticlesFocusedRow === index + 1 ? detailedOpen5 : false
          }
          options={detailed5SearchResult}
          getOptionLabel={(option) => option.detailedAccountCode}
          onInputChange={(event, value) => {
            if (value !== '' && event !== null) {
              RenderDetailedOpenState5(index, true);
              HandleDetailed5Change(value);
              debouncedHandleDetailed5Change(value);
            } else {
              RenderDetailedOpenState5(index, false);
            }
          }}
          onChange={(event, value) => {
            RenderDetailedOpenState5(index, false);
            formik.setFieldValue(
              `documentArticles[${index}].detailed5Id`,
              value
            );
            setShowArticles({
              ...showArticles,
              detailed5: value.detailedAccountName,
            });
          }}
          onBlur={(e) => RenderDetailedOpenState5(index, false)}
          onKeyDown={(e) => {
            if (
              (e.keyCode === 13 ||
                e.keyCode === 9 ||
                e.keyCode === 38 ||
                e.keyCode === 40 ||
                e.keyCode === 37 ||
                e.keyCode === 39) &&
              detailedOpen5 === false
            ) {
              e.preventDefault();
              RenderDetailedOpenState5(index, false);
            }
            setTimeout(() => {
              KeyboardNavigation(
                e,
                [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
                formik.values.documentArticles,
                documentArticlesFocusedRow,
                addDocumentArticlesRow,
                i18n.dir()
              );
            }, 0);
          }}
        />
        <Tooltip title={t('ایجاد تفضیلی')}>
          <IconButton
            aria-label={'Clear'}
            variant="contained"
            color={'success'}
            className="add-item-btn"
            sx={i18n.dir() === 'rtl' ? { left: 0 } : { right: 0 }}
          >
            <Link to={'/baseInformation/accounting/entity'} target={'_blank'}>
              <AddCircleOutlineIcon fontSize="small" />
            </Link>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const detailed6Cell = (index) => {
    return (
      <div className={`table-autocomplete position-relative`}>
        <GHAutocomplete
          loadingState={detailed6SearchIsFetching}
          innerWidth={300}
          backgroundColor={
            formik.values.documentArticles[index].moeinAccountId
              ?.detailedType6Ids?.length == 0 ||
            !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
              ? '#EFEFEF4D'
              : '#FFFFFF'
          }
          value={formik.values.documentArticles[index].detailed6Id}
          disabled={
            formik.values.documentArticles[index].moeinAccountId
              ?.detailedType6Ids?.length == 0 ||
            !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
          }
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option.detailedAccountId}>
              {option.detailedAccountCode}-({option.detailedAccountName})
            </Box>
          )}
          filterOptions={(options, state) => {
            let newOptions = [];
            options.forEach((element) => {
              if (
                element.detailedAccountCode.includes(
                  state.inputValue.toLowerCase()
                ) ||
                element.detailedAccountName
                  .replace('/', '')
                  .toLowerCase()
                  .includes(state.inputValue.toLowerCase())
              )
                newOptions.push(element);
            });
            return newOptions;
          }}
          id="detailed6Id"
          name={`documentArticles.${index}.detailed6Id`}
          open={
            documentArticlesFocusedRow === index + 1 ? detailedOpen6 : false
          }
          options={detailed6SearchResult}
          getOptionLabel={(option) => option.detailedAccountCode}
          onInputChange={(event, value) => {
            if (value !== '' && event !== null) {
              RenderDetailedOpenState6(index, true);
              HandleDetailed6Change(value);
              debouncedHandleDetailed6Change(value);
            } else {
              RenderDetailedOpenState6(index, false);
            }
          }}
          onChange={(event, value) => {
            RenderDetailedOpenState6(index, false);
            formik.setFieldValue(
              `documentArticles[${index}].detailed6Id`,
              value
            );
            setShowArticles({
              ...showArticles,
              detailed6: value.detailedAccountName,
            });
          }}
          onBlur={(e) => RenderDetailedOpenState6(index, false)}
          onKeyDown={(e) => {
            if (
              (e.keyCode === 13 ||
                e.keyCode === 9 ||
                e.keyCode === 38 ||
                e.keyCode === 40 ||
                e.keyCode === 37 ||
                e.keyCode === 39) &&
              detailedOpen6 === false
            ) {
              e.preventDefault();
              RenderDetailedOpenState6(index, false);
            }
            setTimeout(() => {
              KeyboardNavigation(
                e,
                [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
                formik.values.documentArticles,
                documentArticlesFocusedRow,
                addDocumentArticlesRow,
                i18n.dir()
              );
            }, 0);
          }}
        />
        <Tooltip title={t('ایجاد تفضیلی')}>
          <IconButton
            aria-label={'Clear'}
            variant="contained"
            color={'success'}
            className="add-item-btn"
            sx={i18n.dir() === 'rtl' ? { left: 0 } : { right: 0 }}
          >
            <Link target={'_blank'} to={'/baseInformation/accounting/entity'}>
              <AddCircleOutlineIcon fontSize="small" />
            </Link>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const debitsCell = (index) => {
    return (
      <GHCurrencyInput
        onKeyDown={(e) =>
          KeyboardNavigation(
            e,
            [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
            formik.values.documentArticles,
            documentArticlesFocusedRow,
            addDocumentArticlesRow,
            i18n.dir()
          )
        }
        id="debits"
        name={`documentArticles.${index}.debits`}
        value={formik.values.documentArticles[index].debits}
        onValueChange={(value) =>
          formik.setFieldValue(`documentArticles[${index}].debits`, value)
        }
        onBlur={() => CalculateDebitsTotal(formik.values.documentArticles)}
      />
    );
  };

  const switchCell = (index) => {
    return (
      <IconButton
        variant="contained"
        color="primary"
        className="kendo-action-btn"
        onClick={() => {
          let temp = formik.values.documentArticles[index].credits;
          formik.setFieldValue(
            `documentArticles[${index}].credits`,
            formik.values.documentArticles[index].debits
          );
          formik.setFieldValue(`documentArticles[${index}].debits`, temp);
          let totalTemp = creditsTotal;
          setCreditsTotal(debitsTotal);
          setDebitsTotal(totalTemp);
        }}
      >
        <CachedIcon />
      </IconButton>
    );
  };

  const creditsCell = (index) => {
    return (
      <GHCurrencyInput
        onKeyDown={(e) =>
          KeyboardNavigation(
            e,
            [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
            formik.values.documentArticles,
            documentArticlesFocusedRow,
            addDocumentArticlesRow,
            i18n.dir()
          )
        }
        id="credits"
        value={formik.values.documentArticles[index].credits}
        name={`documentArticles.${index}.credits`}
        onValueChange={(value) =>
          formik.setFieldValue(`documentArticles[${index}].credits`, value)
        }
        onBlur={() => CalculateCreditsTotal(formik.values.documentArticles)}
      />
    );
  };

  const notesCell = (index) => {
    return (
      <GHInput
        onKeyDown={(e) =>
          KeyboardNavigation(
            e,
            [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
            formik.values.documentArticles,
            documentArticlesFocusedRow,
            addDocumentArticlesRow,
            i18n.dir()
          )
        }
        name={`documentArticles.${index}.notes`}
        placeholder="---"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.documentArticles[index].notes}
      />
    );
  };

  const trackingNumberCell = (index) => {
    return (
      <GHInput
        disabled={
          formik.values.documentArticles[index].moeinAccountId
            ?.followUpCharacteristics === false ||
          !objectNotNull(formik.values.documentArticles[index].moeinAccountId)
        }
        onKeyDown={(e) =>
          KeyboardNavigation(
            e,
            [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
            formik.values.documentArticles,
            documentArticlesFocusedRow,
            addDocumentArticlesRow,
            i18n.dir()
          )
        }
        name={`documentArticles.${index}.trackingNumber`}
        type="number"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.documentArticles[index].trackingNumber}
      />
    );
  };

  const trackingDateCell = (index) => {
    return (
      <div
        onKeyDown={(e) => {
          if (
            e.keyCode === 13 ||
            e.keyCode === 9 ||
            e.keyCode === 38 ||
            e.keyCode === 40 ||
            e.keyCode === 37 ||
            e.keyCode === 39
          ) {
            KeyboardNavigation(
              e,
              [moeinAccountOpen, detailedOpen4, detailedOpen5, detailedOpen6],
              formik.values.documentArticles,
              documentArticlesFocusedRow,
              addDocumentArticlesRow,
              i18n.dir()
            );
          }
        }}
      >
        <GHDatepicker
          style={{ direction: 'ltr' }}
          name={`documentArticles.${index}.trackingDate`}
          id="trackingDate"
          render={
            <InputMask
              disabled={
                formik.values.documentArticles[index].moeinAccountId
                  ?.followUpCharacteristics === false ||
                !objectNotNull(
                  formik.values.documentArticles[index].moeinAccountId
                )
              }
            />
          }
          onChange={(date) => {
            if (date !== null) {
              formik.setFieldValue(
                `documentArticles[${index}].trackingDate`,
                julianIntToDate(date.toJulianDay())
              );
            }
          }}
        />
      </div>
    );
  };

  const sumFooter = () => {
    return `${t('جمع')}:`;
  };
  const debitsFooter = () => {
    return (
      <GHCurrencyInput
        id="debitsTotal"
        disabled
        value={debitsTotal}
        name={`documentArticles.debitsTotal`}
      />
    );
  };

  const creditsFooter = () => {
    return (
      <GHCurrencyInput
        id="creditsTotal"
        disabled
        value={creditsTotal}
        name={`documentArticles.creditsTotal`}
      />
    );
  };

  const balanceFooter = () => {
    return (
      <div className="d-flex align-items-center">
        <div className="title" style={{ margin: '0 7px' }}>
          <span> {t('مانده')} :</span>
        </div>
        <div className="wrapper flex-grow-1">
          <div className={renderBalanceClassName()}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                margin: 'auto',
              }}
            >
              <GHCurrencyInput
                id="balance"
                name="balance"
                value={formik.values.balance}
                disabled
              />
              <span style={{ width: '20%' }}>{renderBalanceState()}</span>
            </label>
          </div>
          {formik.touched.balance && formik.errors.balance ? (
            <div className="error-msg">{t(formik.errors.balance)}</div>
          ) : null}
        </div>
      </div>
    );
  };

  let inputColumns = [
    {
      header: t('کد حساب معین'),
      content: CodingCell,
      width: '160px',
      minWidth: '100px',
    },
    {
      header: `${t('تفضیلی')} 4`,
      content: detailed4Cell,
      width: '160px',
      minWidth: '100px',
    },
    {
      header: `${t('تفضیلی')} 5`,
      content: detailed5Cell,
      width: '160px',
      minWidth: '100px',
    },
    {
      header: `${t('تفضیلی')} 6`,
      content: detailed6Cell,
      width: '160px',
      minWidth: '100px',
    },
    {
      header: t('بدهکار'),
      content: debitsCell,
      width: '120px',
      minWidth: '100px',
    },
    {
      // header: t(""),
      content: switchCell,
      width: '40px',
      // minWidth: '100px'
    },
    {
      header: t('بستانکار'),
      content: creditsCell,
      width: '120px',
      minWidth: '100px',
    },
    {
      header: t('توضیحات'),
      content: notesCell,
      // width: '160px',
      minWidth: '100px',
    },
    {
      header: t('شماره پیگیری'),
      content: trackingNumberCell,
      width: '150px',
      minWidth: '100px',
    },
    {
      header: t('تاریخ پیگیری'),
      content: trackingDateCell,
      width: '150px',
      minWidth: '100px',
    },
  ];
  let inputFooters = [
    {
      content: sumFooter,
      colspan: 1,
    },
    {
      colspan: 4,
    },
    {
      content: debitsFooter,
      colspan: 1,
    },
    {
      colspan: 1,
    },
    {
      content: creditsFooter,
      colspan: 1,
    },
    {
      content: balanceFooter,
      colspan: 4,
    },
  ];
  return (
    <GHGrid
      title={`${t('آرتیکل‌های سند')}:`}
      addRowFunction={addDocumentArticlesRow}
      columns={inputColumns}
      fieldArrayErrors={formik?.errors?.documentArticles}
      fieldArrayKey={'documentArticleGuid'}
      fieldArrayName={'documentArticles'}
      fieldArrayValues={formik?.values?.documentArticles}
      footer={inputFooters}
      removeRowOperation={(index) => {
        setCreditsTotal(
          creditsTotal -
            parseFloat(formik.values.documentArticles[index].credits)
        );
        setDebitsTotal(
          debitsTotal - parseFloat(formik.values.documentArticles[index].debits)
        );
      }}
      rowFocusFunction={(e) => {
        var codingNames = ['', '', ''];
        var rowIndex = e.target.closest('tr').rowIndex;
        setDocumentArticlesFocusedRow(rowIndex);
        if (
          objectNotNull(
            formik.values.documentArticles[rowIndex - 1].moeinAccountId
          )
        ) {
          codingNames =
            formik.values.documentArticles[
              rowIndex - 1
            ].moeinAccountId?.formersNames.split('/');
        }
        setShowArticles({
          ...showArticles,
          group: codingNames[0].trim(),
          kol: codingNames[1].trim(),
          moein: codingNames[2].trim(),
          detailed4:
            formik.values.documentArticles[rowIndex - 1].detailed4Id
              ?.detailedAccountName || '',
          detailed5:
            formik.values.documentArticles[rowIndex - 1].detailed5Id
              ?.detailedAccountName || '',
          detailed6:
            formik.values.documentArticles[rowIndex - 1].detailed6Id
              ?.detailedAccountName || '',
        });
      }}
      rowFocusState={documentArticlesFocusedRow}
    />
  );
};
