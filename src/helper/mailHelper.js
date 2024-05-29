import helper from "./helper.js";
import logger from "./logger.js";
import emailTemplate from '../email/emailTemplate.js'

export default function getAllListeners(eventEmitter) {
    eventEmitter.on('regularizeRequestMail', async (input) => {
        await regularizationRequestMail(input);
    });

    eventEmitter.on('resetPasswordMail', async (input) => {
        await resetPasswordMail(input);
    });

    eventEmitter.on('revokeRegularizationMail', async (input) => {
        await revokeRegularizationMail(input);
    });
}

async function regularizationRequestMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.managerEmail,
            subject: `Regularization Request`,
            html: await emailTemplate.regularizationRequestMail(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function resetPasswordMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Reset Password`,
            html: await emailTemplate.resetPasswordMail(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function revokeRegularizationMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Regularization Request Revoked`,
            html: await emailTemplate.revokeRegularizeMail(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}