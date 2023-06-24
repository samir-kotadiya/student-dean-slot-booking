'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
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
    });

    await queryInterface.addIndex('sessions', ['deanId']);
    await queryInterface.addIndex('sessions', ['userId']);
    await queryInterface.addIndex('sessions', ['bookedAt']);
  },
  
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
    */
    await queryInterface.dropTable('sessions');
  }
}