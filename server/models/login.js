const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Login extends Model {
    static associate({ Task }) {
      Login.hasMany(Task, {
        foreignKey: 'loginId',
      })
    }
  }

  Login.init(
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
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: 'Login',
      tableName: 'login',
    },
  )

  Login.admin = {
    name: '登陆',
    format: '{{ name }}',
    listFields: ['id', 'name', 'description'],
    filterFields: ['name'],
    searchFields: ['name'],
    fields: {
      id: 'ID',
      name: '名称',
      description: {
        name: '描述',
        required: false
      },
      type: '登陆类型',
      data: {
        name: '登陆数据',
        component: 'textarea'
      }
    }
  }

  return Login
}
