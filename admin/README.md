# koa-sequelize-admin

auto generate crud ui for sequelize with koa.js

## install

```
npm install koa-sequelize-admin --save
```

## config

* name: ''
* group: ''
* format: '{{ name }}'
* excludeFields: []
* listFields: []
* filterFields: []
* searchFields: []
* fields: {}
  * fields[key] or fields[key].name: ''
  * fields[key]
    * format
      * type: 'image' | 'link' | 'tooltip' | 'bytes'
      * text: '文本格式'
      * link: '链接格式'
    * component: 'input' | 'textarea' | 'password' | 'number' | 'select' | 'switch' | 'date' | 'time' | 'dateTime' | 'transfer' | 'editor'
    * required
    * defaultValue
    * options
    * tip
    * editable
* associations: {}
  * fields[key]
    * visible