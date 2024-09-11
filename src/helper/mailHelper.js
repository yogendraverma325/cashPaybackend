import helper from "./helper.js";
import logger from "./logger.js";
import emailTemplate from '../email/emailTemplate.js'

export default function getAllListeners(eventEmitter) {
    eventEmitter.on('regularizeRequestMail', async (input) => {
        await regularizationRequestMail(input);
    });

    eventEmitter.on('leaveRequestMail', async (input) => {
        await leaveRequestMail(input);
    });

    eventEmitter.on('resetPasswordMail', async (input) => {
        await resetPasswordMail(input);
    });

    eventEmitter.on('revokeRegularizationMail', async (input) => {
        await revokeRegularizationMail(input);
    });

    eventEmitter.on("regularizeAckMail", async (input) => {
        await regularizeAckMail(input)
    })

    eventEmitter.on("leaveAckMail", async (input) => {
        await leaveAckMail(input)
    })

    eventEmitter.on("forgotPasswordMail", async (input) => {
        await forgotPassword(input)
    })

    eventEmitter.on("revokeLeaveRequest", async (input) => {
        await revokeLeaveRequest(input)
    })

    eventEmitter.on("autoLeaveDeductionMail", async (input) => {
        await autoLeaveDeductionMail(input)
    })

    eventEmitter.on('initiateSeparation', async (input) => {
        await initiateSeparation(input)
    })
}

async function regularizationRequestMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.managerEmail,
            subject: `${userData.requesterName} has applied for attendance update`,
            html: await emailTemplate.regularizationRequestMail(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function leaveRequestMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.managerEmail,
            subject: `${userData.requesterName} has requested for leave`,
            html: await emailTemplate.leaveRequestMail(userData),
            cc: userData.cc
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
            subject: `${userData.name} has revoked own attendance request`,
            html: await emailTemplate.revokeRegularizeMail(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function regularizeAckMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Your attendance update request has been ${userData.status}.`,
            html: await emailTemplate.regularizationAcknowledgement(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function leaveAckMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Your leave request has been ${userData.status}.`,
            html: await emailTemplate.leaveAcknowledgement(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function forgotPassword(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Your One-Time Password (OTP)`,
            html: await emailTemplate.forgotPasswordMail(userData)
        })

    } catch (error) {
        console.log(error)
        logger.error(error)
    }

}

async function revokeLeaveRequest(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.managerEmail,
            subject: `${userData.empName} has Revoked own leave request`,
            html: await emailTemplate.revokeLeaveRequestMail(userData)
        })

    } catch (error) {
        console.log(error)
        logger.error(error)
    }

}

async function autoLeaveDeductionMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: 'Auto Leave Deduction',
            html: await emailTemplate.autoLeaveDeduction(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function initiateSeparation(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `${userData.empName}, ${userData.empDesignation} - ${userData.empDepartment} has resigned from the company`,
            html: await emailTemplate.initiateSeparation(userData)
        })

    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}