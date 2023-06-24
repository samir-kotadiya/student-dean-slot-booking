'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 * */
		await queryInterface.bulkInsert(
			"universities", [
			{
				"id": "95f7a094-68a3-4c34-b793-370a85d957c4",
				"name": "Nirma University"
			}
		]);
	},
	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		*/
		await queryInterface.bulkDelete('universities', null, {});
	}
};
