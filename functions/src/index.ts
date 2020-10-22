import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
import generateCodeWrapper from "./functions/generateCodeWrapper";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeys from "./functions/uploadDiagnosisKeys";
import {getAccessToken} from "./functions/getAccessToken";
import hospitalsParser from "./functions/jobs/hospitalsParser";
import faqParser from "./functions/jobs/faqParser";
import advicesParser from "./functions/jobs/advicesParser";
import backupTranslations from "./functions/jobs/backupTranslations";
import getSubscriptionCode from "./functions/freeTest/getSubscriptionCode";
import updateSubscription from "./functions/freeTest/updateSubscription";
import subscriptionsForTest from "./functions/freeTest/subscriptionsForTest";
import generateSubscriptionCode from "./functions/freeTest/generateSubscriptionCode";

admin.initializeApp();

exports.advicesParser = cloudFunctions.scheduler(advicesParser, 'every 30 minutes');
exports.backupTranslations = cloudFunctions.scheduler(backupTranslations, 'every 60 minutes');
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.createSubscription = cloudFunctions.httpsOnRequest(subscriptionsForTest);
exports.faqParser = cloudFunctions.scheduler(faqParser, 'every 30 minutes');
exports.generateCode = cloudFunctions.https(generateCodeWrapper);
exports.generateSubscriptionCode = cloudFunctions.httpsOnRequest(generateSubscriptionCode);
exports.getAccessToken = cloudFunctions.https(getAccessToken);
exports.getSubscriptionCode = cloudFunctions.httpsOnRequest(getSubscriptionCode);
exports.hospitalsParser = cloudFunctions.scheduler(hospitalsParser, 'every 30 minutes');
exports.updateSubscription = cloudFunctions.httpsOnRequest(updateSubscription);
exports.uploadDiagnosisKeys = cloudFunctions.httpsOnRequest(uploadDiagnosisKeys);
