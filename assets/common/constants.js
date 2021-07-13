import hostname from "./hostname";
import resourceServerHostname from "./hostnameResourceServer";

export const HOSTNAME_RESOURCE_SERVER = resourceServerHostname;
export const HOSTNAME = hostname;

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
    cancelled: 7
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