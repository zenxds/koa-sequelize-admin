const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Role extends Model {
    static associate({ User }) {
      Role.belongsToMany(User, {
        through: 'user_role'
      })
    }
  }

  Role.init(
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
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'role',
    },
  )

  Role.admin = {
    name: '角色',
    format: '{{ name }}',
    searchFields: ['name'],
    fields: {
      id: 'ID',
      name: '角色名',
    }
  }

  return Role
}
