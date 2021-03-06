import config from "../config";
import {secretManager, codeRepository} from "../services";
import * as functions from "firebase-functions";
import {generateJwt} from "./jwtGenerator";
import {validateCode} from "./code/codeValidator";

export const getAccessToken = async (data : any) => {

    const isCodeValid = await validateCode(data.code);

    if (!isCodeValid) {
        throw new functions.https.HttpsError('not-found', 'Invalid code');
    }

    await codeRepository.remove(data.code);
    const secret = await secretManager.getConfig('secret');
    const accessToken = await generateJwt({code: data.code}, secret, config.jwt.lifetime);

    return {accessToken: accessToken};
};
