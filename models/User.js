const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING,

            }
        },
        {
            sequelize
        });

    return User;
};