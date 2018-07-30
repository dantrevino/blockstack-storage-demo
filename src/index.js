import React, { Component } from "react";
import { render } from "react-dom";
import createLocalStorageDriver from "./data/drivers/localStorageDriver";
import MultiFileCollectionService from "./data/MultiFileCollectionService";
import SingleFileCollectionService from "./data/SingleFileCollectionService";

// NOTE: see that we are using a localstorage driver
// If you use this flow, you can swap out the localstorage
// driver with the blockstack driver in `data/drivers/blockstackDriver`
const storage = createLocalStorageDriver();

const multiFile = new MultiFileCollectionService({
  type: "multi-file-items",
  storage
});

const singleFile = new SingleFileCollectionService({
  type: "single-file-items",
  storage
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singleFileItems: [],
      multiFileItems: []
    };
  }

  async componentDidMount() {
    const multiFileItems = await multiFile.getItems();
    const singleFileItems = await singleFile.getItem();
    this.setState({
      multiFileItems,
      singleFileItems: Object.keys(singleFileItems).map(
        key => singleFileItems[key]
      )
    });
  }

  addItemSingle = async () => {
    const response = await singleFile.createItem({
      title: "Single File Item"
    });
    const items = await singleFile.getItem();
    this.setState({
      singleFileItems: Object.keys(items).map(key => items[key])
    });
  };

  updateItemSingle = async id => {
    const response = await singleFile.updateItem({
      id,
      title: "Updated Single File Item"
    });
    const items = await singleFile.getItem();
    this.setState({
      singleFileItems: Object.keys(items).map(key => items[key])
    });
  };

  addItemMulti = async () => {
    const response = await multiFile.createItem({
      title: "Multi File Item"
    });
    const items = await multiFile.getItems();
    this.setState({ multiFileItems: items });
  };

  updateItemMulti = async id => {
    const response = await multiFile.updateItem({
      id,
      title: "Updated Multi File Item"
    });
    const items = await multiFile.getItems();
    this.setState({ multiFileItems: items });
  };

  render() {
    return (
      <div>
        <div style={{ padding: "20px" }}>
          <h1>Blockstack Storage Demonstration</h1>
          <p>
            This sandbox shows two ways to organize your collection data.{" "}
            <a href="https://www.blockstack.org" target="_blank">
              For more information, visit the tutorial.
            </a>
          </p>

          <p>
            NOTE: for the sandbox, we're interacting with localstorage instead
            of Blockstack via a swappable driver. The Blockstack driver is
            included in the codebase as well. You can view localstorage data in
            browser developer tools. If you're using Chrome, just go to the
            developer tools by pressing F12, then go to the Application tab. In
            the Storage section expand Local Storage. After that, you'll see all
            your browser's local storage there.
          </p>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ padding: "20px", flex: "0 0 50%" }}>
            <h4>Multi File Collection</h4>
            <button onClick={this.addItemMulti}>Add MultiFile Item</button>
            <ul>
              {this.state.multiFileItems.map(item => (
                <li key={item.id}>
                  {item.title} - {item.id}&nbsp;
                  <button onClick={() => this.updateItemMulti(item.id)}>
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: "20px", flex: "0 0 50%" }}>
            <h4>Single File Collection</h4>
            <button onClick={this.addItemSingle}>Add SingleFile Item</button>
            <ul>
              {this.state.singleFileItems.map(item => (
                <li key={item.id}>
                  {item.title} - {item.id}&nbsp;
                  <button onClick={() => this.updateItemSingle(item.id)}>
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
