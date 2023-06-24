export default (sequelize, Sequelize) => {
  class University extends Sequelize.Model {

  }

  University.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'email',
    },
  }, {
    sequelize,
    tableName: 'universities',
    timestamps: false
  });

  University.addHook('afterCreate', async (instance, options) => {

  });

  University.addHook('afterUpdate', async (instance, options) => {

  });

  return University;
};