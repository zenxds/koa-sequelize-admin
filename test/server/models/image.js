const admin = require('../../..')
const sequelize = require('../db')
const DataTypes = require('sequelize').DataTypes

const Image = sequelize.define('image', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  path: {
    type: DataTypes.STRING
  },
  size: {
    type: DataTypes.INTEGER
  },
  md5: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true
})

class Admin {
  constructor() {
    this.name = "图片"

    this.meta = {
      id: 'ID',
      path: {
        name: '路径',
        format: 'image'
      },
      size: '大小',
      md5: 'MD5'
    }
  }
}

admin.register(Image, Admin)
module.exports = Image