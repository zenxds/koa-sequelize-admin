const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Translate extends Model {
    static associate({ Key, Language }) {
      Translate.belongsTo(Key, {
        foreignKey: 'keyId'
      })

      Translate.belongsTo(Language, {
        foreignKey: 'languageId'
      })
    }
  }

  Translate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Translate',
      tableName: 'translate',
    },
  )

  Translate.admin = {
    name: '翻译',

    fields: {
      text: '内容'
    }
  }
  return Translate
}
