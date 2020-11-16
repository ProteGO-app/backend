import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import {generateCodeIPChecker, secretManager} from "../../config";

export const validateApiTokenAndIp = async (request: functions.Request): Promise<boolean> => {

    const ip = request.header('Cf-Connecting-Ip');
    const apiToken = request.header('efgsApiUrl-token');

    if (!ip || !apiToken) {
        log("ip or efgsApiUrl token don't exist in header");
        return false;
    }

    if (!await generateCodeIPChecker.allow(ip)) {
        log("ip doesn't allow to access");
        return false;
    }

    if (apiToken !== await secretManager.getConfig('apiToken')) {
        log("efgsApiUrl token doesn't allow to access");
        return false;
    }

    return true
};
