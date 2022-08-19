const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Project extends Model {
    static associate({ Namespace }) {
      Project.hasMany(Namespace, {
        foreignKey: 'projectId',
        as: 'spaces'
      })
    }
  }

  Project.init(
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
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'project',
    },
  )

  Project.admin = {
    name: '项目',
    format: '{{ name }}',

    fields: {
      name: '名称',
      description: '描述'
    },

    associations: {
      spaces: {
        visible: false
      }
    }
  }
  return Project
}
