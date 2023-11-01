import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize;

const tblMenu = db.define('menu',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    price:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    }
},{
    freezeTableName: true
});

/* set foreignkey */

Users.hasMany(tblMenu);
tblMenu.belongsTo(Users, {foreignKey : 'userId'});

export default tblMenu;