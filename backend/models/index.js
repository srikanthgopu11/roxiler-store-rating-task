const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './database.sqlite', logging: false });

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('admin', 'user', 'owner'), defaultValue: 'user' }
});

const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    address: { type: DataTypes.STRING }
});

const Rating = sequelize.define('Rating', {
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
});

User.hasOne(Store, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
Store.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(Rating, { foreignKey: 'user_id' });
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

module.exports = { sequelize, User, Store, Rating };