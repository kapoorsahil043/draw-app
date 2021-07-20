import hostname from "./hostname";
import resourceServerHostname from "./hostnameResourceServer";

export const HOSTNAME_RESOURCE_SERVER = resourceServerHostname;
export const HOSTNAME = hostname;

export const DEFAULT_IMAGE_URL_LOGO = HOSTNAME_RESOURCE_SERVER + "/public/uploads/default/rewards_icon_hover.png";
export const DEFAULT_IMAGE_URL = HOSTNAME_RESOURCE_SERVER + "/public/uploads/default/box-960_720.png";
export const DEFAULT_USER_IMAGE_URL = HOSTNAME_RESOURCE_SERVER + "/public/uploads/default/user-icon.png";

export const COLOR_WHITE_SMOKE = "#F5F5F5";
export const COLOR_RED = "#f40105";
export const COLOR_RED_LIGHT = "#FF7F7F";
export const COLOR_GREEN = "green";

export const statuses = {
    inactive: 0,
    active: 1,
    live: 2,
    started: 3,
    stopped: 4,
    completed: 5,
    drawFull: 6,
    cancelled: 7,

    transactionStatusInit:0, 
    transactionStatusSuccess:1,
    transactionStatusFailed:2,
    transactionStatusContestFull:3,
    transactionType_AppAddCash:0, // add
    transactionType_AppContestJoinedUsingMainAcct:1, // minus
    transactionType_AppContestCancelled:2, // add
    transactionType_AppContestWinCashback:3, // add , winnings
    transactionType_AppContestJoinedUsingWinAcct:4, // minus , winnings
    transactionType_AppWithdraw:5, // minus
    transactionType_AppBonusPromotional:6, // bonus , add
    transactionType_AppBonusPromotionalExpired:7, // bonus , minus
    transactionType_AppBonusReferal:8, // bonus , add
    transactionType_AppContestJoinedUsingBonus:9 // bonus , minus
};

export const transactionsStatuses = {
    [statuses.transactionStatusInit]:{shortDesc:"Initiated",colorCode:COLOR_WHITE_SMOKE},
    [statuses.transactionStatusSuccess]:{shortDesc:"Success",colorCode:COLOR_GREEN},
    [statuses.transactionStatusFailed]:{shortDesc:"Failed",colorCode:COLOR_RED_LIGHT},
    [statuses.transactionStatusContestFull]:{shortDesc:"Contest Full",colorCode:COLOR_WHITE_SMOKE},
    [statuses.transactionType_AppAddCash]:{shortDesc:"Cash Added",colorCode:COLOR_GREEN},
    [statuses.transactionType_AppContestJoinedUsingMainAcct]:{shortDesc:"Contest Joined",colorCode:COLOR_RED_LIGHT},
    [statuses.transactionType_AppContestCancelled]:{shortDesc:"Contest Cancelled",colorCode:COLOR_RED_LIGHT},
    [statuses.transactionType_AppContestWinCashback]:{shortDesc:"Cashback Received",colorCode:COLOR_GREEN},
    [statuses.transactionType_AppContestJoinedUsingWinAcct]:{shortDesc:"Contest Joined",colorCode:COLOR_RED_LIGHT},
    [statuses.transactionType_AppWithdraw]:{shortDesc:"Amount Withdrawn",colorCode:COLOR_RED_LIGHT},
    [statuses.transactionType_AppBonusPromotional]:{shortDesc:"Promotional Cash Received",colorCode:COLOR_GREEN},
    [statuses.transactionType_AppBonusPromotionalExpired]:{shortDesc:"Promotional Cash Expired",colorCode:COLOR_RED_LIGHT},
    [statuses.transactionType_AppBonusReferal]:{shortDesc:"Referral Cash Received",colorCode:COLOR_GREEN},
    [statuses.transactionType_AppContestJoinedUsingBonus]:{shortDesc:"Contest Joined Using Bonus",colorCode:COLOR_RED_LIGHT},
}

export const statusesDesc = {
    [statuses.inactive]: "Inactive",
    [statuses.active]: "Active",
    [statuses.live]: "Live",
    [statuses.started]: "Started",
    [statuses.stopped]: "Stopped",
    [statuses.completed]: "Completed",
    [statuses.drawFull]: "Full",
    [statuses.cancelled]: "Cancelled",
}

export const statusesColor = {
    [statuses.inactive]: "grey",
    [statuses.active]: "green",
    [statuses.live]: COLOR_RED,
    [statuses.started]: "green",
    [statuses.stopped]: COLOR_RED,
    [statuses.completed]: "orange",
    [statuses.drawFull]: "orange",
    [statuses.cancelled]: COLOR_RED,
}

export const errCodes = {
    D1:{errDesc:"Login Required",code:"D1",link:"Me"},
    D2:{errDesc:"Add Cash",code:"D2",link:"Me"},
    D3:{errDesc:"Login Required",code:"D2",link:"Me"},
    D4:{errDesc:"Login Required",code:"D2",link:"Me"},
    D5:{errDesc:"Login Required",code:"D2",link:"Me"},
    D6:{errDesc:"Login Required",code:"D2",link:"Me"}
};


export const STATUS_FOR_LIVE = [statuses.live , statuses.started , statuses.stopped];
export const STATUS_FOR_ACTIVE = [statuses.active,statuses.drawFull];

export const styleTextLabel = { color:"grey",fontSize:12};

export const dhm = (ms) => {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor(minutesms / 1000);
    return [days, hours, minutes, sec];
};

export const isValidateValue = (value) =>{
    if(value && value!==""){
        return true;
    }
    return false;
}
