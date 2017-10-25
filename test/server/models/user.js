const admin = require('../../..')
const sequelize = require('../db')
const DataTypes = require('sequelize').DataTypes

const User = sequelize.define('user', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  freezeTableName: true
})

class Admin {
  constructor() {
    this.name = "用户"
    this.listFields = ['id', 'username', 'profile', 'tasks']
    this.format = '{{ username }}'
    this.associationFields = []

    this.meta = {
      id: 'ID',
      username: '用户名',
      birthday: '出生日期'
    }
  }
}

admin.register(User, Admin)
module.exports = User