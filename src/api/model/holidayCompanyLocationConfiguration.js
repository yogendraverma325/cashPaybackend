export default (sequelize, Sequelize) => {
  const holidayCompanyLocationConfiguration = sequelize.define(
    "holidayCompanyLocationConfiguration",
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
    }
  );
  return holidayCompanyLocationConfiguration;
};
