const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');

const blankDocument = '<!DOCTYPE html><html></html>';

const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const serializePatch = require('vdom-serialized-patch/serialize');
const applyPatch = require('vdom-serialized-patch/patch');
//const serializePatches = require('vdom-serialize/serializePatches');
const {serializePatches} = require('./vdomserialize');

class Client {

  constructor(data) {
    this.setHtml(data || blankDocument);
    this.lastPatches = null;
  }

  receiveResponse(response) {
    this.updateDom(response.data);
  }

  updateDom(newHtml) {
    const newDom = new JSDOM(newHtml);
    const oldHtmlTag = this.dom.window.document.querySelector('html');
    const newHtmlTag = newDom.window.document.querySelector('html');
    console.log(newHtmlTag.innerHTML);
    console.log(oldHtmlTag.innerHTML);
    const patches = diff(oldHtmlTag, newHtmlTag);
    //this.latestPatch = serializePatch(patches);
    this.latestPatch = serializePatches(patches);
  }

  setHtml(newHtml) {
    this.dom = new JSDOM(newHtml);
  }

  sendRequest(callback) {
    // Make a request for a user with a given ID
    axios.get('https://news.ycombinator.com/')
      .then((response) => {
        // handle success
        console.log(Object.keys(response));
        this.receiveResponse(response);
        callback();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  }

}



module.exports = Client;
