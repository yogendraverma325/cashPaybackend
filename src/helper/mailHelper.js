import helper from "./helper.js";
import logger from "./logger.js";
import emailTemplate from '../email/emailTemplate.js'

export default function getAllListeners(eventEmitter) {
    eventEmitter.on('regularizeRequestMail', async (input) => {
        await regularizationRequestMail(input);
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