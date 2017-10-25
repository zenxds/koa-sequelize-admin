const DataTypes = require('sequelize').DataTypes
const User = require('./user')
const Project = require('./project')
const Profile = require('./profile')
const Image = require('./image')
const db = require('../db')
const admin = require('../../..')

const WorkerTasks = db.define('worker_tasks', {
  id : {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT,
    unique: 'worker_tasks'
  },
  projectId: {
    type: DataTypes.BIGINT,
    unique: 'worker_tasks'
  }
})

Project.belongsToMany(User, { as: 'workers', through: 'worker_tasks', foreignKey: 'projectId', constraints: false })
User.belongsToMany(Project, { as: 'tasks', through: 'worker_tasks', foreignKey: 'userId', constraints: false })

User.hasOne(Profile, {
  constraints: false
})
Profile.hasOne(User, {
  constraints: false
})

User.hasMany(Image, {
  constraints: false
})
Image.belongsTo(User, {
  constraints: false
})

admin.initAssociations()

const sync = async () => {
  await Image.sync()
  await Profile.sync()  
  await Project.sync()  
  await User.sync()
  await WorkerTasks.sync()
}

sync()