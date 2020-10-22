import * as functions from "firebase-functions";
const {log} = require("firebase-functions/lib/logger");
import {sha256} from "js-sha256";
import {validateApiTokenAndIp} from "../ipAndApiTokenValidator";
import returnBadRequestResponse from "../returnBadRequestResponse";
import config from "../../config";

const findSubscription = async (codeId: string, code: string): Promise<any> => {
    if (codeId) {
        return await config.subscription.repository.getByCodeId(codeId);
    }
    if (code) {
        const codeSha256 = sha256(code);
        return await config.subscription.repository.getByCodeSha256(codeSha256);
    }
    return undefined;

};

const getSubscriptionCode = async (request: functions.Request, response: functions.Response) => {
    const isValid = await validateApiTokenAndIp(request);

    if (!isValid) {
        log("not authorize request");
        returnBadRequestResponse(response);
    }

    const {id: codeId, code} = request.body;

    const subscription = await findSubscription(codeId, code);

    if (!subscription) {
        log("subscription doesn't exist");
        returnBadRequestResponse(response);
    }

    const {id, status} = subscription;

    response.status(200).send({
        subscription: {id, status}
    });
};

export default getSubscriptionCode;
