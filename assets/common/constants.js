import hostname from "./hostname";
export const HOSTNAME = hostname;
export const DEFAULT_IMAGE_URL = HOSTNAME + "/public/uploads/default/box-960_720.png";
export const COLOR_WHITE_SMOKE = "#F5F5F5";

export const statuses = {
    active: 1,
    live: 2,
    started: 3,
    stopped: 4,
    completed: 5,
    drawFull: 6,
};

export const STATUS_FOR_LIVE = [statuses.live , statuses.started , statuses.stopped];
export const STATUS_FOR_ACTIVE = [statuses.active,statuses.drawFull];