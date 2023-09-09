const Data = [
    {
        ID: 1,
        parentID: 1,
        systemName: "Account",
        displayName: "حساب",
        icon: "FontOutlined",
        priority: 1,
        active: true,
        type: "group",
        routeName: "/Account",
        breadCrumbs: true
    },
]
const typeData = [
    {
        type: "MegaGroup"
    },
    {
        type: "SuperGroup"
    },
    {
        type: "group"
    },
    {
        type: "item"
    },
]
export default {
    getData() {
        return Data;
    },
    getType() {
        return typeData;
    },
};