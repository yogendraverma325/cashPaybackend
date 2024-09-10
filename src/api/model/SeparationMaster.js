export default (sequelize, Sequelize) => {
    const separationMaster = sequelize.define("separationmaster", {
        resignationAutoId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: {
            type: Sequelize.INTEGER
        },
        initiatedBy: {
            type: Sequelize.ENUM('Self', 'Other')
        },
        pendingAt: {
            type: Sequelize.INTEGER
        },
        resignationDate: {
            type: Sequelize.DATE
        },
        noticePeriodDay: {
            type: Sequelize.INTEGER
        },
        noticePeriodLastWorkingDay: {
            type: Sequelize.DATE
        },
        empProposedLastWorkingDay: {
            type: Sequelize.DATE
        },
        empProposedRecoveryDays: {
            type: Sequelize.INTEGER
        },
        empReasonOfResignation: {
            type: Sequelize.STRING
        },
        empNewOrganizationName: {
            type: Sequelize.STRING
        },
        empSalaryHike: {
            type: Sequelize.STRING
        },
        empPersonalEmailId: {
            type: Sequelize.STRING
        },
        empPersonalMobileNumber: {
            type: Sequelize.STRING
        },
        empRemark: {
            type: Sequelize.STRING
        },
        empAttachment: {
            type: Sequelize.STRING
        },
        empRevokeReason: {
            type: Sequelize.STRING
        },
        empRevokeDate: {
            type: Sequelize.DATE
        },
        empSubmissionDate: {
            type: Sequelize.DATE
        },
        l1ProposedLastWorkingDay: {
            type: Sequelize.DATE
        },
        l1ProposedRecoveryDays: {
            type: Sequelize.INTEGER
        },
        l1ReasonForProposedRecoveryDays: {
            type: Sequelize.STRING
        },
        l1ReasonOfResignation: {
            type: Sequelize.STRING
        },
        l1BillingType: {
            type: Sequelize.STRING
        },
        l1CustomerName: {
            type: Sequelize.STRING
        },
        replacementRequired: {
            type: Sequelize.BOOLEAN
        },
        replacementRequiredBy: {
            type: Sequelize.DATE
        },
        l1Remark: {
            type: Sequelize.STRING
        },
        l1Attachment: {
            type: Sequelize.STRING
        },
        l1SubmissionDate: {
            type: Sequelize.DATE
        },
        l1RequestStatus: {
            type: Sequelize.STRING
        },
        l1RevokeReason: {
            type: Sequelize.STRING
        },
        l1RevokeDate: {
            type: Sequelize.DATE
        },
        l2LastWorkingDay: {
            type: Sequelize.DATE
        },
        l2RecoveryDays: {
            type: Sequelize.INTEGER
        },
        l2RecoveryDaysReason: {
            type: Sequelize.STRING
        },
        l2SeparationType: {
            type: Sequelize.STRING
        },
        l2ReasonOfSeparation: {
            type: Sequelize.STRING
        },
        l2NewOrganizationName: {
            type: Sequelize.STRING
        },
        l2SalaryHike: {
            type: Sequelize.STRING
        },
        doNotReHire: {
            type: Sequelize.BOOLEAN
        },
        l2BillingType: {
            type: Sequelize.STRING
        },
        l2CustomerName: {
            type: Sequelize.STRING
        },
        shortFallPayoutBasis: {
            type: Sequelize.STRING
        },
        shortFallPayoutDays: {
            type: Sequelize.STRING
        },
        ndaConfirmation: {
            type: Sequelize.BOOLEAN
        },
        holdFnf: {
            type: Sequelize.BOOLEAN
        },
        holdFnfTillDate: {
            type: Sequelize.DATE
        },
        holdFnfReason: {
            type: Sequelize.STRING
        },
        l2SubmissionDate: {
            type: Sequelize.DATE
        },
        l2RequestStatus: {
            type: Sequelize.STRING
        },
        finalStatus: {
            type: Sequelize.STRING
        },
        l2Remark: {
            type: Sequelize.STRING
        },
        l2Attachment: {
            type: Sequelize.STRING
        },
        l2RevokeReason: {
            type: Sequelize.STRING
        },
        l2RevokeDate: {
            type: Sequelize.DATE
        },
        submitType:{
            type: Sequelize.INTEGER // 0=SaveAsDraft 1=>Main Submit
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        createdDt: {
            type: Sequelize.DATE
        }
    })
    return separationMaster
}