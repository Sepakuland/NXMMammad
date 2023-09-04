import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EastIcon from '@mui/icons-material/East';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WestIcon from '@mui/icons-material/West';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {useTheme} from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from "@mui/material/IconButton";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TextField from '@mui/material/TextField';
import CurrencyInput from 'react-currency-input-field';
import {parsFloatFunction} from "../../utils/parsFloatFunction";
import {useFormik} from "formik";
import React, {createRef, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './style.css'
import * as Yup from "yup";


export const Kara = ({debtor = [], creditor = [], getData, matches = [], showOtherBtn = false, show = true}) => {

    const {t, i18n} = useTranslation()
    const theme = useTheme()


    const DRef = useRef(null)

    const formik = useFormik({
        initialValues: {
            exchangeInput: ""

        },
        //validationSchema: Yup.object({
        //    exchangeInput: Yup.number().required("وارد کردن مرتبط با الزامیست"),

        //}),

        onSubmit: (values) => {


        },

    });

    const formik2 = useFormik({
        initialValues: {
            discountPercentage: 0,
            discountAmount: 0,
            totalPrice: "",
            totalRemaining: "",
            id: ""

        },
        validationSchema: Yup.object({
            discountPercentage: Yup.number().lessThan(101, 'بیشتر از 100 مجاز نیست')


        }),

        onSubmit: (values) => {
            console.log(values)
            let temp = leftdata.map((item) => {


                if ((item.id == formik2.values.id)) {


                    item.remain = formik2.values.totalRemaining
                    item.saleOrderObject.CashDiscountPercent = formik2.values.discountPercentage
                    item.saleOrderObject.CashDiscountAmount = formik2.values.discountAmount


                }
                return item

            })
            let temp2 = rightdata.map((item) => {


                if ((item.id == formik2.values.id)) {


                    item.remain = formik2.values.totalRemaining
                    item.saleOrderObject.CashDiscountPercent = formik2.values.discountPercentage
                    item.saleOrderObject.CashDiscountAmount = formik2.values.discountAmount


                }
                return item

            })

            setleftData([...temp])
            setrightData([...temp2])
            handleClose3()

        },

    });


    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.keyCode == 20) {

            setOpenEasterEgg(true)

        }
    });

    const [maxWidth, setMaxWidth] = React.useState('lg');
    const [fullWidth, setFullWidth] = React.useState(true);


    const [openEasterEgg, setOpenEasterEgg] = useState(false)
    const newid = useRef(0)
    // newid.current=0
    const [open, setOpen] = useState(false);
    const [DocCheck, setDocCheck] = useState(true);

    const [ClickedItem, setClickedItem] = useState(0);

    const [active, IsActive] = useState(true);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const [rowElement, setrowElement] = useState([]);

    const handleClickOpen2 = () => {
        setOpen2(true)
    };
    const handleClickOpen3 = () => {
        setOpen3(true)
    };
    const handleClose2 = () => {
        setOpen2(false)
    }
    const handleClose3 = () => {
        setOpen3(false)
    }

    const rightGridRef = useRef();
    const LeftGridRef = useRef();

    const btnRef = useRef()
    const componentDiv = useRef()


    const [RightBackUp, setRightBackUp] = useState()
    const [LeftBackUp, setLeftBackUp] = useState()
    const [CoordinateBackUp, setCoordinateBackUp] = useState()
    const [ElementBackUp, setElementBackUp] = useState()


    const [element, setElement] = useState([])
    const [OpenSett, setOpenSett] = useState(false)
    const [rightElement, setrightElement] = useState()
    const [leftElement, setleftElement] = useState()

    const handleClose = () => {
        setrightrowData({});
        setleftrowData({});
        setOpen(false)
    }

    const [leftrowData, setleftrowData] = useState({})
    const [rightrowData, setrightrowData] = useState({})
    const [rightdata, setrightData] = useState([])
    const [leftdata, setleftData] = useState([])

    useEffect(() => {
        if (debtor.length && creditor.length) {
            let r = debtor.sort(function (a, b) {
                return (parseFloat(a.DocumentDate.split('/').join('')) - parseFloat(b.DocumentDate.split('/').join('')));
            })
            let l = creditor.sort(function (a, b) {
                return (parseFloat(a.DocumentDate.split('/').join('')) - parseFloat(b.DocumentDate.split('/').join('')));
            })
            setrightData(r)
            setleftData(l)
        }

    }, [creditor, debtor])


    const [connected, setconnected] = useState([])

    const [coordinates, setCoordinates] = useState([])
    const coordinatesRef = useRef();
    coordinatesRef.current = coordinates

    const [currenctButtonId, setcurrentButtonId] = useState()

    const [display, setDisplay] = useState([])
    const displayRef = useRef()
    const connectedRef = useRef()
    const inputRef = createRef()
    const tRef = useRef()
    tRef.current = t;
    displayRef.current = display;
    connectedRef.current = connected;


    useEffect(() => {
        getData(connected)
    }, [connected])

    useEffect(() => {

        DeleteAutoSet()


    }, [show])

    useEffect(() => {
        if (matches.length) {
            let temp = matches.map((item) => ({
                left: item.CreditorArticleId,
                right: item.DebtorArticleId,
                connectbtn: item.Id,
                sett: item.MatchPrice
            }))
            setconnected(temp)

            let temp2 = matches.map((item) => {
                let left = document.getElementById(`t${item.CreditorArticleId}`)
                let right = document.getElementById(`t${item.DebtorArticleId}`)
                return {
                    leftElement: left,
                    rightElement: right,
                    line: item.Id
                }
            })
            setElement(temp2)


            let corTemp = []

            temp2.forEach((t) => {


                const rightEl = t.rightElement.getBoundingClientRect();
                const leftEl = t.leftElement.getBoundingClientRect();

                const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;

                const middlewidth = document.getElementById("middleCol").getBoundingClientRect().width;
                const m = ((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight)) / (middlewidth - 5)


                const middleleft = ((rightEl.y + leftEl.y) / 2) - topHeight;


                const tt = Math.pow((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight), 2) + Math.pow(middlewidth, 2)
                const w = Math.pow(tt, 0.5)


                var Degree = (Math.atan(m) * (180 / Math.PI));
                if (Degree === 90 || Degree === -90) {
                    Degree = 0

                }

                const lll = leftEl.y + (leftEl.height / 2) - topHeight
                const rrr = rightEl.y + (rightEl.height / 2) - topHeight
                const www = w;
                const ddd = Degree;
                const mll = middleleft;
                const mww = middlewidth;

                const Calculate = {
                    'leftRow': lll,
                    'rightRow': rrr,
                    'width': www,
                    'degree': ddd,
                    'middleWidth': mww,
                    'middleLeft': mll,
                    'id': t.line
                };

                corTemp.push(Calculate)

            })


            setCoordinates(corTemp)

        }

    }, [matches])


    function dothis() {

        const btn = DRef.current

        if (Object.keys(formik2.errors).length) {
            btn.style.left = `${Math.ceil(Math.random() * 90)}%`;

        } else {
            btn.style.left = "45%"

        }

    }

    function dothisagain() {

        const btn = DRef.current
        if (Object.keys(formik2.errors).length) {
            btn.style.left = "43%"

        } else {
            btn.style.left = "45%"

        }

    }


//  const button = document.getElementById('tayidbtn')
//   console.log("hopoooooooooooooooooooyoutttttt",button?.style.left)
//    ;
//  button?.addEventListener('mouseover', function () {
// console.log("hooooooooooooooy")
//     button.style.left="30%"
//     console.log("jhoyyyyyyinnerr",button?.style.left)
//     //button.style.top = `${Math.ceil(Math.random() * 90)}%`;
// });


    useEffect(() => {

        const btn = DRef.current

        if (btn) {

            if (Object.keys(formik2.errors).length) {
                btn.innerText = t("زیر صد بزن")
                btn.style.background = "red"


            } else {

                btn.innerText = t("تائید")
                btn.style.background = "#52C41A"
                btn.style.left = "45%"

            }

        }

    }, [formik2.errors]);


    const [leftrow, setleftrow] = useState([])
    const [rightrow, setrightrow] = useState([])


    const [perAmount, setPerAmount] = useState(0)
    const [totalP, setTotalP] = useState(0)
    const [totalRem, setTotalRem] = useState(0)


    const testRef = useRef()
    const elementArrRef = useRef()

    elementArrRef.current = element


    function ChangeColor(e) {

        let list = rightGridRef.current.querySelectorAll('.select-row')
        let list1 = LeftGridRef.current.querySelectorAll('.select-row')
        list.forEach((item) => item.classList.remove('select-row'))
        list1.forEach((item) => item.classList.remove('select-row'))


        const tr = e.target.closest('tr')

        e.target.closest('.main-row').classList.add("select-row");

        let shadow = document.querySelectorAll('.SelectedLine')


        let zshadow = document.querySelectorAll('.Zclass')


        shadow.forEach((item) => item.classList.remove('SelectedLine'))

        zshadow.forEach((item) => item.classList.remove('Zclass'))


        let t = elementArrRef.current.filter(obj => obj.leftElement == tr || obj.rightElement == tr)

        t.map((item) => {

            item.leftElement.closest('.main-row').classList.add("select-row");
            item.rightElement.closest('.main-row').classList.add("select-row");


            const line = document.getElementById(`l${item.line}`);


            line.classList.add('SelectedLine');


            item.rightElement.scrollIntoView({
                block: "center"

            });


            item.leftElement.scrollIntoView({
                block: "center"

            });

        })


    }


    const [totalRemainleft, setTotalremainleft] = useState()
    const [totalTotalPriceleft, setTotalTotalPriceleft] = useState()
    const [totalSettleft, setTotalSettleft] = useState()
    const [totalExtraSetleft, settotalExtraSetleft] = useState()

    const [totalRemainright, setTotalremainright] = useState()
    const [totalTotalPriceright, setTotalTotalPriceright] = useState()
    const [totalSettright, setTotalSettright] = useState()
    const [totalExtraSetright, settotalExtraSetright] = useState()


    useEffect(() => {


        function handleScroll(event) {


            let n = coordinatesRef.current.map((item) => {

                let t = elementArrRef.current.filter(obj => obj.line == item.id)[0]

                const rightEl = t.rightElement.getBoundingClientRect();
                const leftEl = t.leftElement.getBoundingClientRect();

                const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;


                const middlewidth = document.getElementById("middleCol").getBoundingClientRect().width;
                const m = ((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight)) / (middlewidth - 5)


                const middleleft = ((rightEl.y + leftEl.y) / 2) - topHeight;


                const tt = Math.pow((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight), 2) + Math.pow(middlewidth, 2)
                const w = Math.pow(tt, 0.5)


                var Degree = (Math.atan(m) * (180 / Math.PI));
                if (Degree === 90 || Degree === -90) {
                    Degree = 0

                }

                item.leftRow = leftEl.y + (leftEl.height / 2) - topHeight
                item.rightRow = rightEl.y + (rightEl.height / 2) - topHeight
                item.width = w;
                item.degree = Degree;
                item.middleLeft = middleleft;
                item.middleWidth = middlewidth;


                return item


            })


            setCoordinates(n)


        };


        function handleScroll2(event) {


            setTimeout(function () {
                let n = coordinatesRef.current.map((item) => {

                    let t = elementArrRef.current.filter(obj => obj.line == item.id)[0]
                    const rightEl = t.rightElement.getBoundingClientRect();
                    const leftEl = t.leftElement.getBoundingClientRect();
                    const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;

                    const middlewidth = document.getElementById("middleCol").getBoundingClientRect().width;
                    const m = ((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight)) / (middlewidth - 5)


                    const middleleft = ((rightEl.y + leftEl.y) / 2) - topHeight;


                    const tt = Math.pow((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight), 2) + Math.pow(middlewidth, 2)
                    const w = Math.pow(tt, 0.5)


                    var Degree = (Math.atan(m) * (180 / Math.PI));
                    if (Degree === 90 || Degree === -90) {
                        Degree = 0

                    }

                    item.leftRow = leftEl.y + (leftEl.height / 2) - topHeight
                    item.rightRow = rightEl.y + (rightEl.height / 2) - topHeight
                    item.width = w;
                    item.degree = Degree;
                    item.middleLeft = middleleft;
                    item.middleWidth = middlewidth;


                    return item


                })


                setCoordinates(n)


            }, 500)


        };


        rightGridRef?.current?.addEventListener('scroll', handleScroll);
        LeftGridRef?.current?.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll2);
        window.addEventListener('scroll', handleScroll2);
        return () => {

            rightGridRef?.current?.removeEventListener('scroll', handleScroll);
            LeftGridRef?.current?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll2);
            window.removeEventListener('resize', handleScroll2);

        };


    }, []);


    useEffect(() => {


        if (i18n.dir() === 'ltr') {


            let t = elementArrRef.current.map((item) => {

                const R = item.rightElement;
                const L = item.leftElement;
                item.rightElement = L;
                item.leftElement = R;
                item.line = item.line;
                return item

            })

            setElement(t)


        } else {


            let t = elementArrRef.current.map((item) => {

                const R = item.rightElement;
                const L = item.leftElement;
                item.rightElement = L;
                item.leftElement = R;
                item.line = item.line;
                return item

            })

            setElement(t)

        }


    }, [i18n.dir()])


    function DrawLine() {


        if (leftrow.length && rightrow.length) {


            const m = (leftrow[1] - rightrow[1]) / (leftrow[0] - rightrow[0])
            const middleWidth = document.getElementById("middleCol").getBoundingClientRect().width;
            const t = Math.pow((rightrow[1] - leftrow[1]), 2) + Math.pow(middleWidth, 2)
            const w = Math.pow(t, 0.5)


            var degree = (Math.atan(m) * (180 / Math.PI));
            if (degree === 90 || degree === -90) {
                degree = 0
            }


            const middletop = ((rightrow[0] + leftrow[0]) / 2);
            const middleleft = ((rightrow[1] + leftrow[1]) / 2);


            const object = {'leftElement': leftElement, 'rightElement': rightElement, 'line': newid.current};

            const Calculate = {
                'leftRow': leftrow[1],
                'rightRow': rightrow[1],
                'width': w,
                'degree': degree,
                'middleWidth': middleWidth,
                'middleLeft': middleleft,
                'id': newid.current
            };

            setCoordinates((coordinates) => [...coordinates, Calculate])

            setElement([...element, object])
            setleftrow([])
            setrightrow([])
            setleftrowData({})
            setrightrowData({})
            setrightElement()
            setleftElement()


        }

    }


    useEffect(() => {

        let temp = coordinates.map(coordinates => (
            <>
                <div className='line' id={`l${coordinates.id}`} style={{
                    top: `${coordinates.leftRow}px`,
                    left: `-1px`,
                    width: `${coordinates.width}px`,
                    transform: `rotate(${coordinates.degree}deg)`
                }}
                     onClick={(e) => ClickLine(e)}
                >

                    <button id={`${coordinates.id}`} className="closebtn" type='button'
                            onClick={() => {
                                setOpen2(true);
                                setcurrentButtonId(coordinates.id)
                            }}

                    ><DeleteIcon className="iconcss"/></button>


                </div>

                <div className='circle'
                     style={{top: `${coordinates.rightRow}px`, left: `${coordinates.middleWidth - 6}px`}}></div>

                <div className='circle' style={{top: `${coordinates.leftRow}px`, left: `-1px`}}></div>


            </>
        ))

        setDisplay(temp)


    }, [coordinates])

    useEffect(() => {


        let n = coordinatesRef.current.map((item) => {

            let t = elementArrRef.current.filter(obj => obj.line == item.id)[0]
            const rightEl = t.rightElement.getBoundingClientRect();
            const leftEl = t.leftElement.getBoundingClientRect();
            const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;


            const middlewidth = document.getElementById("middleCol").getBoundingClientRect().width;
            const m = ((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight)) / (middlewidth - 5)


            const middleleft = ((rightEl.y + leftEl.y) / 2) - topHeight;


            const tt = Math.pow((rightEl.y + (rightEl.height / 2) - topHeight) - (leftEl.y + (leftEl.height / 2) - topHeight), 2) + Math.pow(middlewidth, 2)
            const w = Math.pow(tt, 0.5)


            var Degree = (Math.atan(m) * (180 / Math.PI));
            if (Degree === 90 || Degree === -90) {
                Degree = 0

            }

            item.leftRow = leftEl.y + (leftEl.height / 2) - topHeight
            item.rightRow = rightEl.y + (rightEl.height / 2) - topHeight
            item.width = w;
            item.degree = Degree;
            item.middleLeft = middleleft;
            item.middleWidth = middlewidth;


            return item


        })


        setCoordinates((s) => [...s, ...n])


    }, [DocCheck, element])

    function ClickLine(e) {
        let shadow = document.querySelectorAll('.SelectedLine')
        let zshadow = document.querySelectorAll('.Zclass')
        let list = rightGridRef.current.querySelectorAll('.select-row')
        let list1 = LeftGridRef.current.querySelectorAll('.select-row')
        list.forEach((item) => item.classList.remove('select-row'))
        list1.forEach((item) => item.classList.remove('select-row'))

        e.target.classList.add("SelectedLine")
        e.target.parentElement.classList.add("Zclass")


        shadow.forEach((item) => item.classList.remove('SelectedLine'))
        zshadow.forEach((item) => item.classList.remove('Zclass'))


        let t = elementArrRef.current.filter(obj => `l${obj.line}` == e.target.id)[0]


        t.leftElement.closest('.main-row').classList.add("select-row");
        t.rightElement.closest('.main-row').classList.add("select-row");

    }


    function Calculate() {

        newid.current = newid.current + 1

        const num = parseFloat(formik.values.exchangeInput);

        const object = {'left': leftrowData.id, 'right': rightrowData.id, 'connectbtn': newid.current, 'sett': num};

        setconnected([...connected, object])


        let temp = leftdata.map((item) => {

            if ((item.id === leftrowData.id)) {

                item.remain = parseFloat(item.remain) - num
                item.Sett = parseFloat(item.Sett) + num

            }
            return item

        })

        setleftData([...temp])

        let temp2 = rightdata.map((item) => {

            if ((item.id === rightrowData.id)) {

                item.remain = parseFloat(item.remain) - num
                item.Sett = parseFloat(item.Sett) + num

            }
            return item

        })
        setrightData([...temp2])


    }

    function setLine() {

        Calculate()
        DrawLine()
        handleClose()

    }


    function RMV() {

        const btnid = currenctButtonId;


        let obj = connectedRef.current.filter((item) => item.connectbtn == btnid)[0]


        let temp = leftdata.map((item) => {


            if ((item.id == obj?.left)) {


                item.remain = parseFloat(item.remain) + obj.sett;

                item.Sett = item.Sett - obj.sett

            }
            return item

        })

        setleftData([...temp])

        let temp2 = rightdata.map((item) => {

            if ((item.id == obj?.right)) {

                item.remain = parseFloat(item.remain) + obj.sett;
                item.Sett = item.Sett - obj.sett


            }
            return item

        })


        setrightData([...temp2])


        let t = coordinates.filter(item => item.id !== btnid)
        setCoordinates(t)


        let c = element.filter(item => item.line !== btnid)

        let d = connected.filter((item) => item.connectbtn !== btnid)
        setElement(c)
        setconnected(d)
        handleClose2()

    }


    function getLeftrow(e, item) {


        setleftElement(e.target.parentElement.parentElement)
        const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;
        let rect = e.target.parentElement.getBoundingClientRect();
        setleftrow([rect.x, rect.y + (rect.height / 2) - topHeight]);
        setleftrowData(item);

        if (Object.keys(rightrowData).length) {

            handleClickOpen()

        }

    }


    function showRemain(e) {

        setElementBackUp(element)
        setLeftBackUp(leftdata)
        setRightBackUp(rightdata)

        setCoordinateBackUp(coordinates)

        const leftmap = leftdata.filter(obj => obj.remain == 0)
        const rightmap = rightdata.filter(obj => obj.remain == 0)


        if (e.target.checked) {


            leftmap.forEach((item) => {
                const c = document.getElementById(`t${item.id}`)


                c.style.display = 'none'

            })

            rightmap.forEach((item) => {
                const c = document.getElementById(`t${item.id}`)

                c.style.display = 'none'

            })


            setCoordinates([])
            setElement([])

        } else {

            leftmap.map((item) => {
                const c = document.getElementById(`t${item.id}`)
                c.style.display = 'table-row'

            })

            rightmap.map((item) => {
                const c = document.getElementById(`t${item.id}`)
                c.style.display = 'table-row'

            })

            setCoordinates(CoordinateBackUp)
            setElement(ElementBackUp)


        }

    }

    function getRightrow(e, item) {

        setrightElement(e.target.parentElement.parentElement)
        const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;
        let rect = e.target.parentElement.getBoundingClientRect();
        setrightrow([rect.x - (rect.width), rect.y + (rect.height / 2) - topHeight]);
        setrightrowData(item)

        if (Object.keys(leftrowData).length) {
            handleClickOpen()
        }

    }

    const [remainDif, setRemaindiff] = useState(0);


    function AutoSet() {

        IsActive(false)

        let rightTemp = rightdata
        let leftTemp = leftdata
        let Arr = [];
        let ElementArr = [];
        let ConnectedArr = [];


        for (var i = 0; i < rightTemp.length; i++) {

            let LeftdataIndex = 0;

            if (rightTemp[i].remain !== 0) {


                while (rightTemp[i].remain !== 0) {

                    if (leftTemp[LeftdataIndex].remain == 0) {

                        LeftdataIndex = LeftdataIndex + 1;
                        continue;

                    }

                    var MatchPrice = Math.min(parseFloat(rightTemp[i].remain), parseFloat(leftTemp[LeftdataIndex].remain));
                    rightTemp[i].remain = parseFloat(rightTemp[i].remain) - MatchPrice
                    rightTemp[i].Sett = parseFloat(rightTemp[i].Sett) + MatchPrice

                    leftTemp[LeftdataIndex].remain = parseFloat(leftTemp[LeftdataIndex].remain) - MatchPrice
                    leftTemp[LeftdataIndex].Sett = parseFloat(leftTemp[LeftdataIndex].Sett) + MatchPrice


                    const rightTr = document.getElementById(`t${rightTemp[i]?.id}`)?.getBoundingClientRect();
                    const rT = document.getElementById(`t${rightTemp[i]?.id}`);
                    const leftTr = document.getElementById(`t${leftTemp[LeftdataIndex]?.id}`)?.getBoundingClientRect();
                    const lT = document.getElementById(`t${leftTemp[LeftdataIndex]?.id}`);


                    const topHeight = document.getElementById("topDiv").getBoundingClientRect().bottom + 30;
                    const leftTop = leftTr.x
                    const leftLeft = leftTr.y + (leftTr.height / 2) - topHeight

                    const rightTop = rightTr.x - (rightTr.width)
                    const rightLeft = rightTr.y + (rightTr.height / 2) - topHeight


                    const m = (leftLeft - rightLeft) / (leftTop - rightTop)
                    const middleWidth = document.getElementById("middleCol").getBoundingClientRect().width;
                    const t = Math.pow((rightLeft - leftLeft), 2) + Math.pow(middleWidth, 2)
                    const w = Math.pow(t, 0.5)


                    var degree = (Math.atan(m) * (180 / Math.PI));
                    if (degree === 90 || degree === -90) {
                        degree = 0
                    }


                    const middletop = ((leftTop + rightTop) / 2);
                    const middleleft = ((leftLeft + rightLeft) / 2);

                    newid.current = newid.current + 1

                    const Calculated = {
                        'leftRow': leftLeft,
                        'rightRow': rightLeft,
                        'width': w,
                        'degree': degree,
                        'middleWidth': middleWidth,
                        'middleLeft': middleleft,
                        'id': newid.current
                    };
                    const object = {'leftElement': lT, 'rightElement': rT, 'line': newid.current};
                    const obj = {
                        'left': leftTemp[LeftdataIndex].id,
                        'right': rightTemp[i].id,
                        'connectbtn': newid.current,
                        'sett': MatchPrice
                    };


                    ConnectedArr.push(obj)
                    Arr.push(Calculated)
                    ElementArr.push(object)


                    LeftdataIndex = LeftdataIndex + 1


                }


            }
        }


        setElement(element => [...element, ...ElementArr])
        setCoordinates((coordinates) => [...coordinates, ...Arr])
        setrightData([...rightTemp])
        setleftData([...leftTemp])
        setconnected(connected => [...connected, ...ConnectedArr])


    }

    const DiscountFunction = (item) => {

        setClickedItem(item)
        formik2.setFieldValue('totalRemaining', item.remain)
        formik2.setFieldValue('totalPrice', item.TotalPrice)
        formik2.setFieldValue('discountPercentage', item.saleOrderObject.CashDiscountPercent)
        formik2.setFieldValue('discountAmount', item.saleOrderObject.CashDiscountAmount)
        formik2.setFieldValue('id', item.id)
        setOpen3(true)

    }


    useEffect(() => {

        // const [perAmount, setPerAmount] = useState()
        // const [totalP, setTotalP] = useState()
        // const [totalRem, setTotalRem] = useState()

        if (formik2.values.discountPercentage) {
            let per = formik2.values.discountPercentage;
            let a = parseFloat(formik2.values.totalPrice) * (per / 100)
            let o = parseFloat(formik2.values.totalRemaining) * (per / 100)

            setPerAmount(a)
            let b = parseFloat(formik2.values.totalRemaining) - o
            setTotalRem(b)
            let l = parseFloat(formik2.values.totalPrice) - a
            setTotalP(l)

        }
        if (formik2.values.discountPercentage == 0 || formik2.values.discountPercentage == '') {
            setPerAmount(0)
            setTotalP(ClickedItem.TotalPrice || 0)
            setTotalRem(ClickedItem.remain || 0)

        }


    }, [formik2.values.discountPercentage])


    useEffect(() => {

        // const [perAmount, setPerAmount] = useState()
        // const [totalP, setTotalP] = useState()
        // const [totalRem, setTotalRem] = useState()


        formik2.setFieldValue('discountAmount', parsFloatFunction(perAmount, 2) || 0)
        formik2.setFieldValue('totalRemaining', parsFloatFunction(totalRem, 2) || 0)
        formik2.setFieldValue('totalPrice', parsFloatFunction(totalP, 2) || 0)


    }, [perAmount, totalP, totalRem])


    const DeleteAutoSet = () => {


        connected.map((item) => {
            const leftmap = leftdata.filter(obj => obj.id == item.left)[0]
            const rightmap = rightdata.filter(obj => obj.id == item.right)[0]

            leftmap.remain = parseFloat(leftmap.remain) + item.sett
            leftmap.Sett = leftmap.Sett - item.sett


            rightmap.remain = parseFloat(rightmap.remain) + item.sett
            rightmap.Sett = rightmap.Sett - item.sett


        })

        IsActive(true)
        setCoordinates([])
        setconnected([])
        setElement([])

    }


    useEffect(() => {


        if (rightrowData && leftrowData) {


            if (parseFloat(rightrowData.remain) < parseFloat(leftrowData.remain)) {


                setRemaindiff(rightrowData.remain)
                formik.setFieldValue("exchangeInput", rightrowData.remain)
            } else {

                setRemaindiff(leftrowData.remain)
                formik.setFieldValue("exchangeInput", leftrowData.remain)
            }


        }
    }, [rightrowData, leftrowData])


    useEffect(() => {


        const Remainsubleft = leftdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.remain), 0);
        const Pricesubleft = leftdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.TotalPrice), 0);
        const ExtraSetsubleft = leftdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.extraSet), 0);
        const Setsubleft = leftdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.Sett), 0);

        setTotalremainleft(Remainsubleft)
        setTotalTotalPriceleft(Pricesubleft)
        setTotalSettleft(Setsubleft)
        settotalExtraSetleft(ExtraSetsubleft)


    }, [leftdata])


    useEffect(() => {


        const Remainsubright = rightdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.remain), 0);
        const Pricesubright = rightdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.TotalPrice), 0);
        const ExtraSetsubright = rightdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.extraSet), 0);
        const Setsubright = rightdata?.reduce((total, currentValue) => total = total + parseFloat(currentValue.Sett), 0);

        setTotalremainright(Remainsubright)
        setTotalTotalPriceright(Pricesubright)
        setTotalSettright(Setsubright)
        settotalExtraSetright(ExtraSetsubright)


    }, [rightdata])


    return (


        <div className='kara-set-grid' ref={componentDiv}>

            <style>{`
        .kara-set-grid .middleCol:before {
            background:${theme.palette.background.paper}
        }
        .kara-set-grid .line{
        
        background:${theme.palette.mode === 'light' ? 'black' : '#fff'} ;
        }
       
       `}</style>


            <div className="row"
                 style={{marginTop: "1.0416666666666667vw", marginBottom: "1.5625vw", position: "relative"}}
                 id='topDiv'>


                <div className='content col-lg-8 col-12'>
          <span style={{display: 'flex'}}>

           
            <label className='checkbox-label'>
                <div>{t("گردش این تفضیلی")}: </div>
            </label>

            <label className='checkbox-label'>
              <input
                  className='form-input'
                  type="checkbox"
                  checked={DocCheck}
                  value={DocCheck}
                  onChange={() => {
                      setDocCheck(!DocCheck)
                  }}


              />
                {t("نمایش شرح اسناد")}
            </label>

            <label className='checkbox-label'>
              <input
                  className='form-input'
                  type="checkbox"

                  onChange={(e) => showRemain(e)}
              />
                {t("فقط نمایش گردش های تطبیق داده نشده")}
            </label>
          </span>
                </div>
                <div className='content col-lg-4 col-12 d-flex justify-content-end'>


                    <Button onClick={AutoSet} variant="contained" type='button' style={{
                        marginLeft: "0.5208333333333334vw",
                        marginRight: "26px  "
                    }}>  {t("تطبیق خودکار گردش های تطبیق داده نشده")}</Button>

                    <Button onClick={DeleteAutoSet} color="error" type='button'
                            variant="contained">   {t("حذف تطبیق")}</Button>


                </div>


            </div>


            <div>
                <div className='row'>
                    <div className="content col-5" ref={rightGridRef} style={{
                        zIndex: "50",
                        paddingRight: "unset",
                        overflowY: "auto",
                        height: '700px',
                        padding: "0",
                        direction: `${i18n.dir()}` === 'rtl' ? 'ltr' : 'rtl'
                    }}>

                        <>
                            <table id='RightTable' style={{width: "100%"}}
                                   className={`tablestyle ${i18n.dir() === 'rtl' ? 'rtl' : 'ltr'}`}>

                                <thead style={{height: "3.125vw", padding: "unset", zIndex: "1"}}>

                                <tr>
                                    <th className="headerstyle" colSpan={'12'}
                                        style={{height: "1.9791666666666667vw"}}>  {t("گردش بدهکار")}</th>

                                </tr>
                                <tr style={{height: "51px"}}>
                                    <th className="thstyle" style={{
                                        padding: "0",
                                        zIndex: "1",
                                        width: "1.1458333333333333vw"
                                    }}>{t("ردیف")}</th>
                                    <th className=" thstyle"
                                        style={{padding: "0", borderTop: "0", width: "2.0833333333333335vw"}}>
                                        <div className='d-flex'>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '2.1875vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("سند")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '3.8vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("تاریخ")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '3.3333333333333335vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("نوع سند")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '2.5520833333333335vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("شماره ارجاع")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '5.104166666666667vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("مبلغ کل")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '3.5416666666666665vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("سایر تطبیق ها")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '3.6979166666666665vw',
                                                     height: "51px",
                                                     zIndex: "1"
                                                 }}>{t("تطبیق داده شده")}</div>
                                            <div className="thstyle d-flex align-items-center justify-content-center"
                                                 style={{
                                                     width: '6.09vw',
                                                     height: "51px",
                                                     zIndex: "1",
                                                     flexGrow: 1
                                                 }}>{t("مانده")}</div>
                                        </div>
                                    </th>
                                    <th className="thstyle" style={{width: "2.0833333333333335vw"}}>{t("تطبیق")}</th>
                                </tr>
                                </thead>


                                <tbody>


                                {rightdata.map((item, Index) => {

                                    return (
                                        <tr id={`t${item.id}`} onClick={(e) => ChangeColor(e)}
                                            className={`main-row ${item.remain === 0 ? 'red' : 'green'}`}
                                            style={{direction: `${i18n.dir()}` === 'rtl' ? 'rtl' : 'ltr'}}>
                                            <td className="tdgridstyle" style={{textAlign: 'center'}}>{Index + 1}</td>
                                            <td className="tdgridstyle" style={{padding: "0"}}>
                                                <div className="d-flex" style={{height: "54px"}}>
                                                    <div style={{
                                                        width: '2.0833333333333335vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        wordBreak: "break-all"
                                                    }} className="td-border">{item?.DocumentCode}</div>
                                                    <div style={{
                                                        width: ' 3.9vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        wordBreak: "break-all"
                                                    }} className="td-border">{item?.DocumentDate}</div>
                                                    <div style={{
                                                        width: '3.28125vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }} className="td-border">{item?.DocumentType}</div>
                                                    <div style={{
                                                        width: '2.5520833333333335vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }} className="td-border">{item?.DocumentRefCode}</div>
                                                    <div style={{
                                                        width: '5.104166666666667vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        wordBreak: "break-all"
                                                    }} className="td-border">{item?.TotalPrice}</div>
                                                    <div style={{
                                                        width: '3.59375vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        wordBreak: "break-all"
                                                    }}
                                                         className="td-border">{(item?.extraSet == 0 && showOtherBtn) ? item?.extraSet :
                                                        <button type={'button'} className='ExtraSetbtn'
                                                                onClick={() => setOpenSett(true)}>{item?.extraSet}</button>}</div>
                                                    <div style={{
                                                        width: '3.6979166666666665vw',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        wordBreak: "break-all"
                                                    }} className="td-border">{item?.Sett}</div>
                                                    <div className="td-border" style={{
                                                        flexGrow: '1',
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        width: '6.09vw',
                                                        wordBreak: "break-all"
                                                    }}>{item?.remain}</div>


                                                </div>
                                                {DocCheck && <div style={{
                                                    whiteSpace: "break-spaces",
                                                    direction: "rtl",
                                                    borderTop: '1px solid grey'
                                                }} className="notes-row">
                                                    <div
                                                        style={{padding: "5px"}}>{item.DocumentDescription}({item?.ArticleDescription})
                                                    </div>
                                                    {item?.saleOrderObject === null ? "" : <div
                                                        className='d-flex justify-content-end align-items-center'
                                                        style={{padding: "5px"}}>
                                                        <span
                                                            className='fa-bold'>{t("تخفیف تسویه نقد")}({item?.saleOrderObject.CashDiscountPercent}%): {item?.saleOrderObject.CashDiscountAmount}</span>
                                                        <IconButton className='discount-btn'
                                                                    onClick={() => DiscountFunction(item)}>
                                                            <BorderColorIcon sx={{color: "#1890ff"}}/> </IconButton>
                                                    </div>}
                                                </div>
                                                }

                                            </td>


                                            <td className="tdgridstyle" style={{height: "53px"}}>
                                                <IconButton onClick={(e) => getRightrow(e, item)}
                                                            disabled={item?.remain == 0} style={{
                                                    backgroundColor: 'transparent',
                                                    height: "100%"
                                                }}>{`${i18n.dir()}` === 'rtl' ?
                                                    <WestIcon style={{pointerEvents: 'none'}}/> :
                                                    <EastIcon style={{pointerEvents: 'none'}}/>}</IconButton>
                                            </td>


                                        </tr>

                                    )

                                })}


                                </tbody>
                                <thead style={{height: "3.125vw"}}>


                                <tr>
                                    <th className="thstyle"></th>
                                    <th className="thstyle" style={{
                                        padding: "0",
                                        borderTop: "0",
                                        position: "sticky",
                                        top: "0",
                                        zIndex: "1"
                                    }}>
                                        <tr>
                                            <th className="thstyle" style={{
                                                width: '16.7vw',
                                                height: '3.125vw',
                                                padding: "5px",
                                                textAlign: `${i18n.dir()}` === 'rtl' ? 'right' : 'left'
                                            }}>{t("جمع")}:
                                            </th>
                                            <th className="thstyle" style={{width: '6vw'}}> {totalTotalPriceright}</th>
                                            <th className="thstyle"
                                                style={{width: '4.09375vw'}}> {totalExtraSetright} </th>
                                            <th className="thstyle" style={{width: '5.36458vw'}}> {totalSettright}</th>
                                            <th className="thstyle"
                                                style={{width: '7.3vw', borderLeft: 'none'}}>{totalRemainright}</th>
                                        </tr>
                                    </th>
                                    <th className="thstyle" style={{padding: "0"}}></th>
                                </tr>
                                </thead>
                            </table>


                        </>

                    </div>
                    <div className='content col-2 middleCol' id='middleCol'
                         style={{position: "relative", padding: "0", height: '700px', overflow: "hidden"}}>


                        <div ref={testRef}>

                            {display}

                        </div>


                    </div>
                    <div className='content col-5 ' ref={LeftGridRef} style={{
                        zIndex: "50",
                        paddingRight: "unset",
                        overflowY: "scroll",
                        height: '700px',
                        padding: "0"
                    }}>

                        <table id='LeftTable' className={`tablestyle ${i18n.dir() === 'rtl' ? 'rtl' : 'ltr'}`}
                               style={{width: '100%', borderRight: '1px solid grey'}} cellspacing="0">
                            <thead style={{height: "3.125vw"}}>
                            <tr>
                                <th className="leftheader" colSpan={'12'} style={{
                                    height: "1.9791666666666667vw",
                                    borderBottom: "1px",
                                    zIndex: "1"
                                }}>{t("گردش بستانکار")}</th>

                            </tr>
                            <tr style={{height: '51px', position: "sticky", top: "0", borderTop: "1px solid grey"}}>
                                <th className="thstyle" style={{
                                    width: '2.0833333333333335vw',
                                    height: "15px",
                                    zIndex: "1"
                                }}>{t("تطبیق")}</th>
                                <th className="thstyle" style={{padding: "0", borderTop: "0", zIndex: "1"}}>
                                    <div className='d-flex'>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '2.0833333333333335vw',
                                                 height: "51px",
                                                 zIndex: "1"
                                             }}>{t("سند")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{width: '3.8vw', height: "51px", zIndex: "1"}}>{t("تاریخ")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '2.6041666666666665vw',
                                                 height: "51px",
                                                 zIndex: "1"
                                             }}>{t("نوع سند")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '3.0208333333333335vw',
                                                 height: "51px",
                                                 zIndex: "1"
                                             }}>{t("شماره ارجاع")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '4.739583333333333vw',
                                                 height: "51px",
                                                 zIndex: "1"
                                             }}>{t("مبلغ کل")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '4.114583333333333vw',
                                                 height: "51px",
                                                 zIndex: "1"
                                             }}>{t("سایر تطبیق ها")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '4.322916666666667vw',
                                                 height: "51px",
                                                 zIndex: "1"
                                             }}>{t("تطبیق داده شده")}</div>
                                        <div className="thstyle d-flex align-items-center justify-content-center"
                                             style={{
                                                 width: '6vw',
                                                 height: "51px",
                                                 zIndex: "1",
                                                 flexGrow: 1
                                             }}>{t("مانده")}</div>
                                    </div>
                                </th>
                                <th className="thstyle" style={{
                                    width: '1.1458333333333333vw',
                                    padding: "0",
                                    position: "sticky",
                                    top: "0",
                                    zIndex: "1"
                                }}>{t("ردیف")}</th>
                            </tr>
                            </thead>


                            <tbody>


                            {leftdata.map((item, Index) => {

                                return (
                                    <tr id={`t${item.id}`} onClick={(e) => ChangeColor(e)}
                                        className={`main-row ${item.remain === 0 ? 'red' : 'green'}`}
                                        style={{direction: `${i18n.dir()}` === 'rtl' ? 'rtl' : 'ltr'}}>
                                        <td style={{height: "53px"}} className="tdgridstyle">
                                            <IconButton onClick={(e) => getLeftrow(e, item)}
                                                        style={{backgroundColor: 'transparent', height: "100%"}}
                                                        disabled={item.remain == 0}>{`${i18n.dir()}` === 'rtl' ?
                                                <EastIcon style={{pointerEvents: 'none'}}/> :
                                                <WestIcon style={{pointerEvents: 'none'}}/>}</IconButton>
                                        </td>
                                        <td className="tdgridstyle" style={{padding: "0"}}>
                                            <div className="d-flex" style={{height: "54px"}}>
                                                <div style={{
                                                    width: '2.0833333333333335vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    wordBreak: "break-all"
                                                }} className="td-border">{item?.DocumentCode}</div>
                                                <div style={{
                                                    width: '3.7vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    wordBreak: "break-all"
                                                }} className="td-border">{item?.DocumentDate}</div>
                                                <div style={{
                                                    width: '2.6041666666666665vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }} className="td-border">{item?.DocumentType}</div>
                                                <div style={{
                                                    width: '2.96875vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }} className="td-border">{item?.DocumentRefCode}</div>
                                                <div style={{
                                                    width: '4.739583333333333vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    wordBreak: "break-all"
                                                }} className="td-border">{item?.TotalPrice}</div>
                                                <div style={{
                                                    width: '4.114583333333333vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    wordBreak: "break-all"
                                                }}
                                                     className="td-border">{(item?.extraSet == 0 && showOtherBtn) ? item?.extraSet :
                                                    <button type={'button'} className='ExtraSetbtn'
                                                            onClick={() => setOpenSett(true)}>{item?.extraSet}</button>}</div>
                                                <div style={{
                                                    width: '4.322916666666667vw',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    wordBreak: "break-all"
                                                }} className="td-border">{item?.Sett}</div>
                                                <div className="td-border" style={{
                                                    width: "6vw",
                                                    flexGrow: '1',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    wordBreak: "break-all"
                                                }}>{item?.remain}</div>


                                            </div>
                                            {DocCheck && <div style={{
                                                whiteSpace: "break-spaces",
                                                direction: "rtl",
                                                borderTop: '1px solid grey'
                                            }}>
                                                <div colSpan="12"
                                                     style={{padding: "5px"}}>{item?.DocumentDescription}({item?.ArticleDescription})
                                                </div>
                                                {item?.saleOrderObject === null ? "" : <div
                                                    className='d-flex justify-content-end align-items-center'
                                                    style={{padding: "5px"}}>
                                                    <span
                                                        className='fa-bold'>{t("تخفیف تسویه نقد")}({item?.saleOrderObject.CashDiscountPercent}%): {item?.saleOrderObject.CashDiscountAmount}</span>
                                                    <IconButton className='discount-btn'
                                                                onClick={() => DiscountFunction(item)}>
                                                        <BorderColorIcon sx={{color: "#1890ff"}}/> </IconButton></div>}
                                            </div>}

                                        </td>

                                        <td className="tdgridstyle" style={{textAlign: 'center'}}>{Index + 1}</td>


                                    </tr>


                                )

                            })}


                            </tbody>

                            <thead style={{height: "3.125vw"}}>

                            <tr>
                                <th className="thstyle"></th>
                                <th className="thstyle"
                                    style={{padding: "0", borderTop: "0", position: "sticky", top: "0", zIndex: "1"}}>
                                    <tr>
                                        <th className="thstyle" style={{
                                            width: '16.71875vw',
                                            height: '3.125vw',
                                            padding: "5px",
                                            textAlign: `${i18n.dir()}` === 'rtl' ? 'right' : 'left'
                                        }}>{t("جمع")}:
                                        </th>
                                        <th className="thstyle"
                                            style={{width: '9.427083333333334vw'}}> {totalTotalPriceleft}</th>
                                        <th className="thstyle" style={{width: '4.6875vw'}}> {totalExtraSetleft} </th>
                                        <th className="thstyle"
                                            style={{width: '4.479166666666667vw'}}> {totalSettleft}</th>
                                        <th className="thstyle" style={{
                                            width: '5.208333333333333vw',
                                            borderLeft: 'none'
                                        }}>{totalRemainleft}</th>
                                    </tr>
                                </th>
                                <th className="thstyle" style={{padding: "0"}}></th>
                            </tr>
                            </thead>


                        </table>


                        <Dialog open={open} style={{zIndex: "9999"}}>
                            <div style={{display: "flex"}}></div>
                            <div className={`modal-header ${i18n.dir() == "rtl" ? 'header-ltr' : ''}`}>
                                <button type='button' className='close-btn' onClick={handleClose}><CloseIcon/></button>
                            </div>

                            <DialogContent sx={{width: '13.020833333333334vw', height: '85px'}}>


                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    direction: 'rtl'
                                }}>


                                    <TextField value={formik.values.exchangeInput} type="number"
                                               onChange={formik.handleChange}
                                               className={`${i18n.dir() === 'rtl' ? 'rtl' : 'ltr'} textfield`}
                                               name='exchangeInput' label={t("مبلغ تطبیق")} variant="standard"/>

                                </div>


                            </DialogContent>

                            <DialogActions sx={{width: "100%"}}>
                                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                    <Button type='button'
                                            disabled={!!(formik.values.exchangeInput == '' || parseFloat(formik.values.exchangeInput) <= 0 || parseFloat(formik.values.exchangeInput) > parseFloat(remainDif))}
                                            sx={{margin: 0, width: 80, height: 40}} variant="contained" color="success"
                                            onClick={setLine}>{t("تائید")}</Button>

                                </div>
                            </DialogActions>

                        </Dialog>


                        <Dialog open={openEasterEgg} style={{zIndex: "9999"}}>
                            <DialogContent>
                                <div style={{width: "31.25vw", height: "300px", padding: "0.5208333333333334vw"}}>
                                    <b style={{
                                        display: "flex",
                                        width: '100%',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "25px"
                                    }}> {t("مثل اینکه تو زیادی خوش شانسی که این پیام مخفی رو پیدا کردی")}</b>
                                    <b style={{
                                        display: "flex",
                                        width: '100%',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "25px"
                                    }}>{t("پس ما هم هویتمونو برات فاش میکنیم")}</b>

                                    <div className="row" style={{marginTop: "35px"}}>


                                        <div className='content col-6'
                                             style={{display: "flex", justifyContent: "center"}}>

                                            <a href="https://www.linkedin.com/in/arian-ata-aa58b9234/" target='_blank'>
                                                <LinkedInIcon color="primary"
                                                              style={{width: "3.125vw", height: '3.125vw'}}/></a>


                                        </div>


                                        <div className='content col-6 '
                                             style={{display: "flex", justifyContent: "center"}}>
                                            <a href="https://www.linkedin.com/in/kasrabelarak/" target='_blank'>
                                                <LinkedInIcon color="primary"
                                                              style={{width: "3.125vw", height: '3.125vw'}}/></a>

                                        </div>
                                        <div className='content col-6'>
                                            <b style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>Arian Ata</b>


                                        </div>

                                        <div className='content col-6'>
                                            <b style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>Kasra Belarak</b>

                                        </div>


                                    </div>

                                </div>
                            </DialogContent>


                            <DialogActions sx={{width: "100%"}}>
                                <div className='d-flex align-items-center justify-content-center'
                                     style={{width: "100%"}}>
                                    <Button sx={{margin: 0, width: 200, height: 60,}} style={{justifyContent: 'center'}}
                                            type='button' variant="contained" color="success"
                                            onClick={() => setOpenEasterEgg(false)}>{t("دمتوووون گرم")}</Button>

                                </div>
                            </DialogActions>

                        </Dialog>

                        <Dialog open={open2} style={{zIndex: "9999"}}>
                            <div style={{display: "flex"}}></div>
                            <div className={`modal-header ${i18n.dir() == "rtl" ? 'header-ltr' : ''}`}>
                                <button type='button' className='close-btn' onClick={handleClose2}><CloseIcon/></button>
                            </div>

                            <DialogContent sx={{width: '300px', height: '120px'}}>

                                <DialogContent style={{textAlign: 'center'}}>
                                    {t("آیا مطمئن هستید؟")}
                                </DialogContent>


                            </DialogContent>

                            <DialogActions sx={{width: "100%"}}>
                                <div className='d-flex align-items-center justify-content-center'
                                     style={{width: "100%"}}>
                                    <Button sx={{margin: 0, width: 80, height: 40,}} style={{justifyContent: 'center'}}
                                            type='button' variant="contained" color="success"
                                            onClick={() => RMV()}>{t("تایید")}</Button>

                                </div>
                            </DialogActions>

                        </Dialog>


                        <Dialog open={OpenSett} style={{zIndex: "9999"}} fullWidth={fullWidth} maxWidth={maxWidth}>
                            <div style={{display: "flex"}}></div>
                            <div className={`modal-header ${i18n.dir() == "rtl" ? 'header-ltr' : ''}`}>
                                <button type='button' className='close-btn' onClick={() => setOpenSett(false)}>
                                    <CloseIcon/></button>
                            </div>

                            <DialogContent>
                                <table id='dialogTable' style={{direction: 'rtl'}} cellspacing="0">
                                    <thead>
                                    <tr>
                                        <th colSpan={'12'}
                                            style={{textAlign: 'center'}}>{t("سایر تطبیق های این گردش")}</th>
                                    </tr>
                                    <tr>
                                        <th>{t("ردیف")}</th>
                                        <th>
                                            <tr style={{borderBottom: '1px solid grey', borderTop: '1px solid grey'}}>
                                                <th style={{width: '230px'}}>{t("سند")}</th>
                                                <th style={{width: '256px'}}>{t("تاریخ")}</th>
                                                <th style={{width: '311px'}}>{t("نوع سند")}</th>
                                                <th style={{width: '354px'}}>{t("شماره ارجاع")}</th>
                                                <th style={{width: '396px'}}>{t("مبلغ کل")}</th>
                                                <th style={{width: '359px'}}>{t("تطبیق با این گردش")}</th>
                                            </tr>
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody>

                                    <tr className={`main-row`} style={{direction: "rtl"}}>
                                        <td>1</td>
                                        <td style={{padding: "0"}}>
                                            <div className="d-flex" style={{height: "54px"}}>
                                                <div style={{
                                                    width: '137px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRight: '1px solid grey'
                                                }}>{leftdata[0]?.DocumentCode}</div>
                                                <div style={{
                                                    width: '152px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[0]?.DocumentDate}</div>
                                                <div style={{
                                                    width: '180px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[0]?.DocumentType}</div>
                                                <div style={{
                                                    width: '207px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[0]?.DocumentRefCode}</div>
                                                <div style={{
                                                    width: '227px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[0]?.TotalPrice}</div>
                                                <div style={{
                                                    width: '56px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[0]?.extraSet}</div>
                                            </div>
                                            <div style={{
                                                height: "70px",
                                                whiteSpace: "break-spaces",
                                                direction: "rtl",
                                                borderTop: '1px solid grey'
                                            }} className="notes-row d-flex align-items-center justify-content-center">
                                                <div colSpan="12">{leftdata[0]?.detail}</div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className={`main-row`} style={{direction: "rtl"}}>
                                        <td>2</td>
                                        <td style={{padding: "0"}}>
                                            <div className="d-flex" style={{
                                                height: "54px",
                                                borderBottom: '1px solid grey',
                                                borderTop: '1px solid grey'
                                            }}>
                                                <div style={{
                                                    width: '137px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRight: '1px solid grey'
                                                }}>{leftdata[1]?.DocumentCode}</div>
                                                <div style={{
                                                    width: '152px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[1]?.DocumentDate}</div>
                                                <div style={{
                                                    width: '180px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[1]?.DocumentType}</div>
                                                <div style={{
                                                    width: '207px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[1]?.DocumentRefCode}</div>
                                                <div style={{
                                                    width: '227px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[1]?.TotalPrice}</div>
                                                <div style={{
                                                    width: '56px',
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>{leftdata[1]?.extraSet}</div>

                                            </div>
                                            <div style={{
                                                height: "70px",
                                                whiteSpace: "break-spaces",
                                                direction: "rtl",
                                                borderTop: '1px solid grey'
                                            }} className="notes-row d-flex align-items-center justify-content-center">
                                                <div colSpan="12">{leftdata[1]?.detail}</div>
                                            </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                    <thead>
                                    <tr style={{borderTop: '1px solid grey'}}>
                                        <th className="thstyle"></th>
                                        <th className="thstyle">
                                            <tr>
                                                <th style={{
                                                    width: '681px',
                                                    textAlign: "right",
                                                    height: '3.125vw'
                                                }}>{t("جمع")}:
                                                </th>
                                                <th style={{width: '227px'}}></th>
                                                <th style={{width: '211px'}}></th>
                                            </tr>
                                        </th>
                                        <th style={{padding: "0"}}></th>
                                    </tr>
                                    </thead>
                                </table>


                            </DialogContent>


                        </Dialog>


                        <Dialog open={open3} style={{zIndex: "9999"}}
                                className={`kara-dialog ${i18n.dir() == 'rtl' ? 'rtl' : 'ltr'}`}>
                            <div style={{display: "flex"}}></div>
                            <div
                                className={`modal-header d-flex align-items-center justify-content-between ${i18n.dir() == "ltr" ? 'header-ltr' : ''}`}>
                                <div className="title mb-0"> {t("تخفیف تسویه نقد فاکتور فروش")}</div>
                                <button type='button' className='close-btn' onClick={handleClose3}><CloseIcon/></button>
                            </div>

                            <DialogContent style={{overflowX: "hidden"}}>

                                <DialogContent style={{textAlign: 'center'}}>

                                </DialogContent>
                                <div className="form-design">
                                    <div className="row">
                                        <div className="content col-lg-6 col-md-6 col-xs-12">
                                            <div className="title">
                                                <span>{t("درصد تخفیف")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <input
                                                        className="form-input"
                                                        type="number"
                                                        id="discountPercentage"
                                                        name="discountPercentage"
                                                        onChange={formik2.handleChange}
                                                        onBlur={formik2.handleBlur}
                                                        value={formik2.values.discountPercentage}

                                                    />
                                                    {formik2.errors.discountPercentage ? (
                                                        <div className={'error-msg'}>
                                                            {t(formik2.errors.discountPercentage)}
                                                        </div>
                                                    ) : null}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-xs-12">
                                            <div className="title">
                                                <span>{t("مبلغ تخفیف")}</span>
                                            </div>
                                            <div className="wrapper">

                                                <div>
                                                    <CurrencyInput
                                                        className="disabled-form-input"
                                                        type="text"
                                                        id="discountAmount"
                                                        name="discountAmount"
                                                        style={{width: "100%"}}
                                                        value={formik2.values.discountAmount}
                                                        disabled
                                                        decimalsLimit={2}/>
                                                </div>


                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-xs-12">
                                            <div className="title">
                                                <span>{t("مانده نهایی")}</span>
                                            </div>
                                            <div className="wrapper">
                                                <div>
                                                    <CurrencyInput
                                                        className="disabled-form-input"
                                                        type="text"
                                                        id="totalRemaining"
                                                        name="totalRemaining"
                                                        style={{width: "100%"}}
                                                        value={formik2.values.totalRemaining}
                                                        disabled
                                                        decimalsLimit={2}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content col-lg-6 col-md-6 col-xs-12">
                                            <div className="title">
                                                <span>{t("مبلغ نهایی فاکتور")}</span>
                                            </div>
                                            <div className="wrapper">


                                                <div>
                                                    <CurrencyInput
                                                        className="disabled-form-input"
                                                        type="text"
                                                        id="totalPrice"
                                                        name="totalPrice"
                                                        style={{width: "100%"}}
                                                        value={formik2.values.totalPrice}
                                                        disabled
                                                        decimalsLimit={2}/>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>

                            <DialogActions sx={{width: "100%"}}>
                                <div className='d-flex align-items-center justify-content-center'
                                     style={{width: "100%", position: "relative", height: "60px"}}
                                     onMouseLeave={dothisagain}>
                                    <div className={`button-pos ${i18n.dir() == 'ltr' ? 'ltr' : 'rtl'}`} id="divbtn">


                                        <Button variant="contained" color="success"
                                                type="button"
                                                onClick={formik2.handleSubmit}
                                                id="tayidbtn"
                                                ref={DRef}
                                                style={{
                                                    position: "absolute",
                                                    transition: "0.5s",
                                                    left: "45%",
                                                    bottom: "20px",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onMouseOver={dothis}


                                        >
                                            {t("تائید")}
                                        </Button>

                                    </div>

                                </div>
                            </DialogActions>

                        </Dialog>


                    </div>


                </div>

            </div>
        </div>


    )
}
export default Kara;
