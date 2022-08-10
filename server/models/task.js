const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Task extends Model {
    static associate({ Notification, Login }) {
      Task.belongsTo(Login, {
        as: 'login'
      })

      Task.belongsToMany(Notification, {
        through: 'task_notification',
        as: 'notifications'
      })
    }
  }

  Task.init(
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
      cronTime: {
        type: DataTypes.STRING,
      },
      retry: {
        type: DataTypes.SMALLINT,
        defaultValue: 0
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      virtual: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.data
        }
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'task',
    },
  )

  Task.admin = {
    name: '任务',
    format: '{{ name }}',
    listFields: ['id', 'name', 'login', 'description'],
    filterFields: ['login'],
    searchFields: ['name'],
    fields: {
      id: 'ID',
      name: {
        name: '名称',
        tip: '这是一段Tip',
      },
      description: {
        name: '描述',
        component: 'textarea',
      },
    }
  }

  return Task
}
