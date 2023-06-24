'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('universities', {
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
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
    */
    await queryInterface.dropTable('universities');
  }
}