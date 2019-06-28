import PixiRelationship from "../../dist";
import "../css/index.less";

const testImg = require("../images/test.jpg");

const app = new PixiRelationship({
  containerID: "container",
  backgroundColor: 0xceefff,
  placeholderImg: testImg,
  onClick: data => {
    console.log("onClick:", data);
  }
});

app.init();
// app.destroy();
