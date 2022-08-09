const { Model, DataTypes } = require('sequelize')

// 通知方式
// name 通知标识
// type: mail dingRobot dingCorp pushDeer wxPusher
// date: 不同的通知方式有不同的配置
module.exports = (sequelize) => {
  class Notification extends Model {
    static associate({ Task }) {
      Notification.belongsToMany(Task, {
        through: 'task_notification'
      })
    }
  }

  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notification',
    },
  )

  Notification.admin = {
    name: '通知',
    format: '{{ name }}',
    listFields: ['id', 'name', 'description'],
    filterFields: [],
    searchFields: ['name'],
    fields: {
      id: 'ID',
      name: '名称',
      description: {
        name: '描述',
        component: 'editor',
        format: {
          type: 'tooltip'
        }
      },
      type: {
        name: '通知类型',
        options: [
          {
            name: '通知类型1',
            value: '1'
          },
          {
            name: '通知类型2',
            value: '2'
          }
        ]
      },
      data: {
        name: '通知数据',
        component: 'textarea'
      }
    },

    associations: {
      Tasks: {
        visible: false
      }
    }
  }

  return Notification
}
