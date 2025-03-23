const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Ad extends Sequelize.Model {}
    Ad.init({
            title: {
                type: Sequelize.STRING,
                allowedNull: false,
                validate: {
                    len: [0, 20]
                }
            },

            description: {
                type: Sequelize.STRING,
                validate: {
                    len: [0, 200]
                }
            },

            price: {
                type: Sequelize.FLOAT,
                allowedNull: false,
                validate: {
                    min: 0
                }
            },

            phone: {
                type: Sequelize.STRING,
                validate: {
                    isValidPhoneNumber(value) {
                        // Check if value is not null and not an empty string
                        if (value !== null && value.trim() !== '' && !/^\d{2,3}-\d{7}$/.test(value)) {
                            throw new Error('Invalid phone number format');
                        }
                    },
                }
            },

            email: {
                type: Sequelize.STRING,
                allowedNull: false,
                validate: {
                    isEmail: true
                }
            },
            approved: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize
        });

    return Ad;
};