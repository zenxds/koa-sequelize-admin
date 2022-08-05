import { Sequelize, Model, Association } from 'sequelize'

class AuthToken extends Model {}

const attributes = AuthToken.getAttributes()

// attributes['a'].o