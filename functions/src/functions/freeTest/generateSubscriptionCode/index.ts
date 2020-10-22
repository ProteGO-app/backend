import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import {validateApiTokenAndIp} from "../../ipAndApiTokenValidator";
import {generateCode} from "../../code/codeGenerator";
import returnBadRequestResponse from "../../returnBadRequestResponse";

const generateSubscriptionCode = async (request: functions.Request, response: functions.Response) => {

    try {
        const isValid = await validateApiTokenAndIp(request);

        if (!isValid) {
            returnBadRequestResponse(response);
        }

        const {code, id} = await generateCode();

        response.status(201).send({id, code});
    } catch (e) {
        log(e);
        returnBadRequestResponse(response);
    }
};

export default generateSubscriptionCode;
