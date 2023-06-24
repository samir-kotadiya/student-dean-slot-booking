export default (sequelize, Sequelize) => {
  class User extends Sequelize.Model {

  }

  User.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'email',
    },
    role: {
      type: Sequelize.ENUM('student', 'dean'),
      defaultValue: 'student',
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    universityId: {
      type: Sequelize.UUID,
      references: {
        model: 'universities',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true
  });

  User.addHook('afterCreate', async (instance, options) => {

  });

  User.addHook('afterUpdate', async (instance, options) => {

  });

  return User;
};