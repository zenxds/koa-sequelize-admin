const { Model, DataTypes } = require('sequelize')
const crypto = require('crypto')

module.exports = (sequelize) => {
  class AuthToken extends Model {
    static associate({ User }) {
      AuthToken.belongsTo(User)
    }

    static generate() {
      return crypto.randomBytes(30).toString('hex')
    }
  }

  AuthToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'AuthToken',
      tableName: 'auth_token',
    },
  )

  AuthToken.admin = {
    name: 'Token',
    format: '{{ token }}',
    listFields: ['id', 'token', 'description'],
    filterFields: ['token'],
    searchFields: ['token'],
    fields: {
      id: 'ID',
      token: 'Token',
      description: {
        name: '描述',
        required: false
      },
    }
  }

  return AuthToken
}
