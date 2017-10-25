const admin = require('../../..')
const sequelize = require('../db')
const DataTypes = require('sequelize').DataTypes

const Profile = sequelize.define('profile', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true
})

class Admin {
  constructor() {
    this.name = "资料"

    this.meta = {
      id: 'ID',
      location: {
        name: '城市',
        options: [{
          key: '杭州',
          value: '1'
        }, {
          key: '北京',
          value: '2'
        }]
      },
      avatar: {
        name: '头像',
        format: 'image'
      }
    }
  }
}

admin.register(Profile, Admin)

module.exports = Profile