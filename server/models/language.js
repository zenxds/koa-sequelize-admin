const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Language extends Model {
    static associate({ Translate }) {
      Language.hasMany(Translate, {
        foreignKey: 'languageId'
      })
    }
  }

  Language.init(
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
      modelName: 'Language',
      tableName: 'language',
    },
  )

  Language.admin = {
    name: '语言',

    format: '{{ name }}'
  }
  return Language
}
