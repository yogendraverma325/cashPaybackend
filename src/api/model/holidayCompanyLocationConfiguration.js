export default (sequelize, Sequelize) => {
  const holidayCompanyLocationConfiguration = sequelize.define(
    "holidaycompanylocationconfiguration",
    {
      holidayCompanyLocationConfigurationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      holidayId: {
        type: Sequelize.INTEGER,
      },
      companyLocationId: {
        type: Sequelize.INTEGER,
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedBy: {
        type: Sequelize.INTEGER
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.BOOLEAN
      }
    }
  );
  return holidayCompanyLocationConfiguration;
};
