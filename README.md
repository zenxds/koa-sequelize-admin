# koa-sequelize-admin

auto generate crud ui for sequelize with koa.js

## install

```
npm install koa-sequelize-admin --save
```

## config

* name: ''
* group: ''
* fields: []
* listFields: []
* listFilters: []
* searchFields: []

* meta: {}
  * meta[key] or meta[key].name: ''
  * meta[key].format.type: 'time' | 'datetime' | 'image' | 'link' | 'tooltip'
  * meta[key].format.text: ''
  * meta[key].format.link: ''
  * meta[key].component: 'input' | 'select' | 'textarea' | 'transfer' | 'editor'
  * meta[key].required
  * meta[key].helpMsg
  * meta[key].editable
  * meta[key].options
  * meta[key].defaultValue