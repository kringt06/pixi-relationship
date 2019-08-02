# pixi-relationship

使用 pixijs 实现关系图谱效果: [Demo](https://364734461.github.io/pixi-relationship/)

### Use

```shell
npm install pixi-relationship --save
```

```js
import PixiRelationship from 'pixi-relationship'
import data from '../test.json'

const app = new PixiRelationship({
  containerID: "container",
  backgroundColor: 0xceefff,
  placeholderImg: require("../images/test.jpg"),
  onClick: data => {
    console.log("onClick:", data);
    alert(JSON.stringify(data))
  },
  data: {
    links: data.links,
    nodes: data.nodes,
  },
  linksColors: [0x71b7ff, 0x509838, 0xfd8888, 0xfff36a]
});

app.init();
// app.destroy();
```

### API
#### 初始化参数说明

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| containerID | 容器ID | string | "pixi-relationship" | |
| applicationOptions | PIXI.Application初始化参数 | PIXI.Application options | | |
| backgroundRoundColor | 背景色值 | 0x... number | 0xceefff | | |
| nameStyle | 名称的样式 | (options) => PIXI.TextStyle | ... | |
| borderColor | 边框色值 | 0x...  number | 0x000000 |
| borderColorHover | 边框Hover色值 | 0x...  number | 0x598dff | |
| linksColors | 连线色值对象(对应data中的type) | Array<...> \| Object | [0x71b7ff, 0x509838, 0xfd8888, 0xfff36a] |
| linksTypeLabel | 连线色值对象说明 | Array<...> \| Object | ['爱情', '亲情', '友情'] | |
| placeholderImg | 默认占位图 | string | |
| onClick | 点击card事件 | | | |
| data | 数据源 | | | |

注意事项：

data 数据源格式要求
``` js
{
  "links": [
    {
      "from": "2636106",
      "name": "丈夫",
      "to": "432415",
      "type": 0
    },
    {
      "from": "432415",
      "name": "妻子",
      "to": "2636106",
      "type": 0
    }
    // 注意关系都是单向的，所以2个nodes之间的关系应该有2个links
    ...
  ],
  "nodes": [
    {
      "id": "2636106",
      "img": "http://...",
      "level": 0, // 0 表示第一层， 1 表示第二层， 2表示第三层
      "name": "陈希"
    }
    ...
  ]
}
```


linksColors 对象需要对应 data 中的 links type，如：
``` 
linksColors = [0x71b7ff, 0x509838, 0xfd8888, 0xfff36a];
data = {
  links: [
    {
      from: "2636106",
      name: "test",
      to: "432415",
      type: 0 // 此type值，连线颜色使用 linksColors[0] 
    }
  ],
  ...
}

or 

linksColors = {
  t1: 0x71b7ff, 
  t2: 0x509838
};
data = {
  links: [
    {
      from: "2636106",
      name: "test",
      to: "432415",
      type: "t1" // 此type值，连线颜色使用 linksColors["t1"] 
    }
  ],
  ...
}
```

linksTypeLabel 同上，若不传，则不显示 label。

#### 方法

继承于 [PIXI.Application](http://pixijs.download/release/docs/PIXI.Application.html) 对象。

```js
app.init() // 初始化

app.destroy() // 销毁

app.resizeViewport() // 重置viewport
```

### License

ISC
