const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Namespace extends Model {
    static associate({ Project, Key }) {
      Namespace.belongsTo(Project, {
        foreignKey: 'projectId',
        as: 'project'
      })

      Namespace.hasMany(Key, {
        foreignKey: 'namespaceId',
        as: 'keys'
      })
    }
  }

  Namespace.init(
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
      virtual: {
        type: DataTypes.VIRTUAL,
        get() {
          return '1111'
        }
      },
    },
    {
      sequelize,
      modelName: 'Namespace',
      tableName: 'namespace',
      indexes: [
        {
          unique: true,
          fields: ['name', 'projectId']
        }
      ]
    },
  )

  Namespace.admin = {
    name: '空间',
    format: '{{ name }}',

    listFields: ['id', 'name', 'description', 'project', 'virtual'],
    filterFields: ['project'],

    fields: {
      name: '名称',
      description: {
        name: '描述',
        component: 'editor'
      },
      virtual: '虚拟字段'
    },

    associations: {
      keys: {
        visible: false
      }
    }
  }

  return Namespace
}
