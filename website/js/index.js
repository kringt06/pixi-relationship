import PixiRelationship from "../../dist";
import "../css/index.less";
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
    linksType: ['爱情', '亲情', '友情']
  },
});

app.init();
// app.destroy();