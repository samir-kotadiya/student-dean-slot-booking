export default (sequelize, Sequelize) => {
  class Session extends Sequelize.Model {

  }

  Session.init({
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
    universityId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    deanId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    bookedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pending', 'cancelled', 'completed'),
      defaultValue: 'pending',
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
  }, {
    sequelize,
    tableName: 'sessions',
    timestamps: false
  });

  Session.addHook('afterCreate', async (instance, options) => {

  });

  Session.addHook('afterUpdate', async (instance, options) => {

  });

  return Session;
};