const admin = require('../../..')
const sequelize = require('../db')
const DataTypes = require('sequelize').DataTypes

const Project = sequelize.define('project', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  desc: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  freezeTableName: true
})

class Admin {
  constructor() {
    this.name = "项目"
    this.format = '{{ title }}'
    this.listFilters = ['title']
    this.searchFields = ['title']
    
    this.meta = {
      title: {
        name: '项目名',
        component: 'select',
        options: [
          {
            key: '项目1',
            value: '1'
          },
          {
            key: '项目2',
            value: '2'
          }
        ]
      },
      image: {
        name: '图片',
        format: 'image'
      },
      desc: '描述'
    }
  }
}

admin.register(Project, Admin)
module.exports = Project