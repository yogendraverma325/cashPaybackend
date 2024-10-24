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

    eventEmitter.on('separationUserAcknowledge', async (input) => {
        await separationUserAcknowledge(input)
    })

    eventEmitter.on('separationApprovalAcknowledgementToUser', async (input) => {
        await separationApprovalAcknowledgementToUser(input)
    })

    eventEmitter.on('separationRejectByBUHR', async (input) => {
        await separationRejectByBUHR(input)
    })

    eventEmitter.on("managerRejectsSeparation", async (input) => {
        await managerRejectsSeparation(input)
    })

    eventEmitter.on('managerApprovesSeparation', async (input) => {
        await managerApprovesSeparation(input)
    })

    eventEmitter.on("clearenceInitiated", async (input) => {
        await clearenceInitiated(input)
    })

    eventEmitter.on("separationApproveByBUHR", async (input) => {
        await separationApproveByBUHR(input)
    })

    eventEmitter.on('onboardingEmployeeMail', async (input) => {
        await onboardingEmployeeMail(input)
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

async function separationUserAcknowledge(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Your separation request is submitted successfully`,
            html: await emailTemplate.separationAcknowledgementToUser(userData)
        })

    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function separationRejectByBUHR(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `BU HR rejected your resignation ${userData.empName} (${userData.empCode}),`,
            html: await emailTemplate.separationRejectedByBUHR(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function separationApprovalAcknowledgementToUser(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Manager accepted the resignation of Employee`,
            html: await emailTemplate.separationApprovalAcknowledgementToUser(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function managerRejectsSeparation(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Rejection by Manager`,
            html: await emailTemplate.managerRejectsSeparation(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function managerApprovesSeparation(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Separation approval of BU HR- ${userData.empName},${userData.empCode},${userData.bu}`,
            html: await emailTemplate.managerApprovesSeparation(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function clearenceInitiated(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Resignation of Member ${userData.empName} (${userData.empCode}) - ${userData.bu} | Clearance initiated`,
            html: await emailTemplate.clearanceInitiated(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function separationApproveByBUHR(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Resignation Acceptance ${userData.empCode}, ${userData.empName}`,
            html: await emailTemplate.separationApproveByBUHR(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}

async function onboardingEmployeeMail(input) {
    try {
        const userData = JSON.parse(input)
        await helper.mailService({
            to: userData.email,
            subject: `Welcome to Team's new HRMS Platform | Login credentials`,
            html: await emailTemplate.onboardingEmployee(userData)
        })
    } catch (error) {
        console.log(error)
        logger.error(error)
    }
}