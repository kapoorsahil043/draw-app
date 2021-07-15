import hostname from "./hostname";
import resourceServerHostname from "./hostnameResourceServer";

export const HOSTNAME_RESOURCE_SERVER = resourceServerHostname;
export const HOSTNAME = hostname;

export const DEFAULT_IMAGE_URL_LOGO = HOSTNAME_RESOURCE_SERVER + "/public/uploads/default/rewards_icon_hover.png";
export const DEFAULT_IMAGE_URL = HOSTNAME_RESOURCE_SERVER + "/public/uploads/default/box-960_720.png";
export const DEFAULT_USER_IMAGE_URL = HOSTNAME_RESOURCE_SERVER + "/public/uploads/default/user-icon.png";

export const COLOR_WHITE_SMOKE = "#F5F5F5";
export const COLOR_RED = "#f40105";

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
    [statuses.transactionStatusInit]:{shortDesc:"Initiated"},
    [statuses.transactionStatusSuccess]:{shortDesc:"Success"},
    [statuses.transactionStatusFailed]:{shortDesc:"Failed"},
    [statuses.transactionStatusContestFull]:{shortDesc:"Contest Full"},
    [statuses.transactionType_AppAddCash]:{shortDesc:"Cash Added"},
    [statuses.transactionType_AppContestJoinedUsingMainAcct]:{shortDesc:"Contest Joined"},
    [statuses.transactionType_AppContestCancelled]:{shortDesc:"Contest Cancelled"},
    [statuses.transactionType_AppContestWinCashback]:{shortDesc:"Cashback Received"},
    [statuses.transactionType_AppContestJoinedUsingWinAcct]:{shortDesc:"Contest Joined"},
    [statuses.transactionType_AppWithdraw]:{shortDesc:"Amount Withdrawn"},
    [statuses.transactionType_AppBonusPromotional]:{shortDesc:"Promotional Cash Received"},
    [statuses.transactionType_AppBonusPromotionalExpired]:{shortDesc:"Promotional Cash Expired"},
    [statuses.transactionType_AppBonusReferal]:{shortDesc:"Referral Cash Received"},
    [statuses.transactionType_AppContestJoinedUsingBonus]:{shortDesc:"Contest Joined"},
}

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