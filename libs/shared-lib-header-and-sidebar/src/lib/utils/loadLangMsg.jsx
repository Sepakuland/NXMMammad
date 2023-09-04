import {load, loadMessages} from "@progress/kendo-react-intl";
import faMessages from "../components/RKGrid/fa-IR.json";
import faGeneric from "cldr-dates-full/main/fa/ca-generic.json";
import faGregorian from "cldr-dates-full/main/fa/ca-gregorian.json";
import arMessages from "../components/RKGrid/ar.json";
import arGeneric from "cldr-dates-full/main/ar/ca-generic.json";
import arGregorian from "cldr-dates-full/main/ar/ca-gregorian.json";


export function loadLangMsg(lang) {
    switch (lang) {
        case 'fa':
            load(
                faGeneric,
                faGregorian,
            );
            loadMessages(faMessages, "fa-IR");
            break;
        case 'ar':
            load(
                arGeneric,
                arGregorian,
            );
            loadMessages(arMessages, "ar");
            break;
        default:


    }
}

