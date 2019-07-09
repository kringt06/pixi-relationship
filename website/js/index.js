import PixiRelationship from "../../dist";
import "../css/index.less";
import data from '../test.json'

const app = new PixiRelationship({
  containerID: "container",
  backgroundColor: 0xceefff,
  placeholderImg: require("../images/test.jpg"),
  onClick: data => {
    console.log("onClick:", data);
  },
  data: {
    links: data.links,
    nodes: data.nodes
  }
});

app.init();
// app.destroy();