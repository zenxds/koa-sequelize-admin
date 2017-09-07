# sequelize-admin

auto generate crud ui for sequelize with koa.js

## install

```
npm install sequelize-admin --save
```

## how to use

add a admin file, and register model

```
const Admin = require('sequelize-admin')
const admin = new Admin()

const UploadRecord = require('../model/uploadRecord')

admin.register(DetectRecord, {
  displayName: '检测记录',
  format: '{{ id }}',
  attributes: {
    id: 'ID',
    path: '路径'
  }
})
```

add router

```
router.get('/admin/', async(ctx, next) => {
  await ctx.render('admin', {})
})
router.use('/admin', admin.router.routes())
```

in admin template

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>sequelize admin</title>
  <link rel="shortcut icon" type="image/x-icon" href="https://www.dingxiang-inc.com/favicon.ico">
  <link href="/dist/main.css rel="stylesheet">
  <script>
    var pageConfig = {
      isPopup: location.href.indexOf('popup=1') > -1,
      user: '{{ user | dump | safe }}'
    }
  </script>
</head>
<body>
  <div id="app"></div>
  <script src="/dist/vendor.js"></script>
  <script src="/dist/main.js"></script>
</body>
</html>
```

then you can get an admin ui

![screenshot](./screenshot.png)

## ui code

[sequelize-admin-ui](https://github.com/zenxds/sequelize-admin-ui)