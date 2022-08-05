const { DataTypes } = require('sequelize')

exports.attributeComponentMap = {
  input: [
    DataTypes.STRING,
  ],
  textarea: [
    DataTypes.TEXT,
  ],
  select: [
    DataTypes.ENUM
  ],
  number: [
    DataTypes.BIGINT,
    DataTypes.INTEGER,
    DataTypes.FLOAT,
    DataTypes.DOUBLE,
    DataTypes.DECIMAL
  ],
  switch: [
    DataTypes.BOOLEAN
  ],
  date: [
    DataTypes.DATEONLY
  ],
  dateTime: [
    DataTypes.DATE,
  ]
}

exports.associationComponentMap = {
  'BelongsTo': 'select',
  'BelongsToMany': 'transfer',
  'HasOne': 'select',
  'HasMany': 'transfer'
}
