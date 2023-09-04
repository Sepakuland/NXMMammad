import { TaskBoard, TaskBoardToolbar } from '@progress/kendo-react-taskboard'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Column } from './column';
import { Card } from './card';
import { filterBy } from '@progress/kendo-data-query';
import { useLostBenefitQuery, useUpdateOperationalStatusMutation } from '../../../../features/slices/customerChosenCodingSlice';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import swal from 'sweetalert';

const columns = [
    {
        id: 0,
        title: 'حساب‌های سود و زیانی',
        status: 'NotSpecified'
    }, {
        id: 1,
        title: 'درآمدهای عملیاتی',
        status: 'OperatingRevenues'
    }, {
        id: 2,
        title: 'هزینه‌های عملیاتی',
        status: 'OperatingExpenses'
    },
    {
        id: 3,
        title: 'سایر هزینه ها و درآمدهای عملیاتی',
        status: 'OtherOperating'
    },
    {
        id: 4,
        title: 'درآمدهای غیر عملیاتی',
        status: "NonOperatingRevenues"
    },
    {
        id: 5,
        title: 'هزینه‌های غیر عملیاتی',
        status: "NonOperatingExpenses"
    },
    {
        id: 6,
        title: 'سایر هزینه ها و درآمدهای غیرعملیاتی',
        status: "OtherNonOperating"
    }];
const TaskBoardIndex = () => {
    const [filter, setFilter] = useState("");
    const { t, i18n } = useTranslation();
    const [taskData, setTaskData] = useState([]);
    const [columnsData, setColumnsData] = useState(columns);

    useEffect(() => {
        setLostBeneftSkip(false)
    }, [])

    const onChangeHandler = useCallback(event => {
        if (event.type ===  '   column') {
            setColumnsData(event.data);
        } else {
            // New Task has been added.useLostBenefitQuery
            if (event.item && event.item.id === undefined) {
                event.item.id = event.data.length + 1;
            }
            setTaskData(event.data);
        }
    }, []);
    const resultTasks = useMemo(() => {
        const filterDesc = {
            logic: 'and',
            filters: [{
                field: 'title',
                operator: 'contains',
                value: filter
            }]
        };
        return filter ? filterBy(taskData, filterDesc) : taskData;
    }, [filter, taskData]);

    /* -------------------------------------------------------------------------- */
    /*                              RTKQuery / Redux                              */
    /* -------------------------------------------------------------------------- */

    /* ------------------------- Get LostBenefts coding ------------------------- */
    const [LostBeneftSkip, setLostBeneftSkip] = useState(true)
    const [data, setData] = useState([])
    const { data: LostBeneftResult = [], isFetching: LostBeneftIsFetching, currentData: LostBeneftCurrentData }
        = useLostBenefitQuery({ skip: LostBeneftSkip })
    useEffect(() => {
        const tasks = LostBeneftResult?.map(c => ({
            id: c?.codingId,
            title: c.name,
            status: c?.operationalStatus === 0 ? "NotSpecified" : c?.operationalStatus === 1 ? "OperatingRevenues" :
                c?.operationalStatus === 2 ? "OperatingExpenses" : c.operationalStatus === 3 ? "OtherOperating" :
                    c?.operationalStatus === 4 ? "NonOperatingRevenues" : c?.operationalStatus === 5 ? "NonOperatingExpenses" :
                        "OtherNonOperating",
            priority: {
                color: "gray",
            },
        }));
        setData(tasks)
        setTaskData(tasks)
    }, [LostBeneftResult?.data, LostBeneftIsFetching, LostBeneftCurrentData])

    /* -------------------------------- Mutation -------------------------------- */
    const [updateOperationalStatus, updateResults] = useUpdateOperationalStatusMutation()
    useEffect(() => {
        if (updateResults.status === "fulfilled" && updateResults.isSuccess) {
            UpdateSub()
        }
        else if (updateResults.isError) {
            let arr = updateResults.error.map((item) => t(item));
            let msg = arr.join(" \n ");
            swal({
                text: msg,
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });
        }

    }, [updateResults.status])
    /* -------------------------------------------------------------------------- */
    function cancel() {
        setTaskData(data)
    }

    const SubmitForm = (data) => {
        let notSubmit = []
        let values = data.map((data, index) => {
            if (data?.status === "NotSpecified") {
                notSubmit.push(data)
            }
            return {
                codingId: data.id,
                name: data.title,
                status: data.status
            };


        });
        if (notSubmit?.length > 0) {
            swal({
                text: "لطفا ماهیت تمامی حساب ها را مشخص نمایید",
                icon: "error",
                button: t("باشه"),
                className: "small-error",
            });

        }
        else {
            updateOperationalStatus(values).unwrap()
                .catch((error) => {
                    console.error(error)
                })
        }



    }

    const UpdateSub = () => {

        swal({
            title: t("تغییرات با موفقیت ثبت شد"),
            icon: "success",
            button: t("باشه")
        });
    }

   
    return (
        <div className='DND-Coding' style={{ direction: i18n.dir() }}>

            <TaskBoard
                columnData={columnsData}
                taskData={resultTasks}
                onChange={onChangeHandler}
                column={Column}
                card={Card}
                style={{
                    height: "510px",
                }}
                tabIndex={0}
            >
                <TaskBoardToolbar>
                    <span className="k-spacer" />
                </TaskBoardToolbar>
            </TaskBoard>
            <div className='d-flex justify-content-center'>
                <Button variant='contained' style={{ margin: "5px", width: "70px", boxShadow: "0px 0px 5px 0px gray" }} color='success' onClick={() => { SubmitForm(resultTasks) }}>{t("ذخیره")}</Button>
                <Button variant='contained' style={{ margin: "5px", width: "70px", boxShadow: "0px 0px 5px 0px gray" }} color='error' onClick={() => cancel()}>{t("انصراف")}</Button>
            </div>

        </div>
    )
}

export default TaskBoardIndex