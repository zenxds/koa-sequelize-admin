const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Key extends Model {
    static associate({ Namespace, Translate }) {
      Key.belongsTo(Namespace, {
        foreignKey: 'namespaceId',
        as: 'namespace'
      })

      Key.hasMany(Translate, {
        foreignKey: 'keyId',
        as: 'translates'
      })
    }
  }

  Key.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Key',
      tableName: 'key',
      indexes: [
        {
          unique: true,
          fields: ['name', 'namespaceId']
        }
      ]
    },
  )

  Key.admin = {
    name: '条目',

    filterFields: ['namespace'],
    searchFields: ['name'],

    fields: {
      name: '名称',
      description: '描述'
    },

    associations: {
      translates: {
        visible: false
      }
    }
  }
  return Key
}
