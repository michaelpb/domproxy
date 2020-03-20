const axios = require('axios');
const VirtualDom = require('./VirtualDom');

class Client {
  constructor(data) {
    this.setHtml(data || blankDocument);
    this.latestPatch = null;
    this.initialVdom = null;
  }

  receiveResponse(response) {
    this.updateDom(response.data);
  }

  updateDom(newHTML) {
    const patch = this.vdom.diffAndUpdate(newHTML)
    this.latestPatch = patch;
  }

  setHtml(newHtml) {
    this.vdom = new VirtualDom(newHtml);
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


/*

  htmlToVdom(html) {
    const vdom = convertHTML({
      // TODO: Allow configuration of a key= attribute
      //getVNodeKey: function (attributes) {
      //    return attributes.key;
      //},
    }, html);

    return vdom;
  }
  updateDom(newHtml) {
    const newVdom = this.htmlToVdom(newHtml);
    const patches = diff(newVdom, this.vdom);
    this.vdom = newVdom;
    //const patches = diff(this.vdom, newVdom);
    //this.latestPatch = serializePatch(patches);
    patch(this.dom, patches);
    //console.log(this.dom.window.document.innerHTML);
    this.latestPatch = serializePatches(patches);
    this.initialVdom = serializeVdom(this.vdom);
  }

  setHtml(newHtml) {
    this.dom = new JSDOM(newHtml);
    this.vdom = this.htmlToVdom(newHtml);
    this.initialVdom = serializeVdom(this.vdom);
  }
*/


// const jsdom = require("jsdom");
//const { JSDOM } = jsdom;
// WRITE MY OWN VDOM:
// Using others is not worth it
// https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060
// Use JSDom just for DOM api
// - Then write simple diffing algo
// - Generate patch
// - Write simple flat patch application algo

/*
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const serializePatch = require('vdom-serialized-patch/serialize');
const applyPatch = require('vdom-serialized-patch/patch');
//const serializePatches = require('vdom-serialize/serializePatches');
const {serializePatches, serializeVdom} = require('./vdomserialize');
const VNode = require('virtual-dom/vnode/vnode');
const VText = require('virtual-dom/vnode/vtext');

const convertHTML = require('html-to-vdom')({ VNode, VText });

const blankDocument = '<!DOCTYPE html><html></html>';
*/


module.exports = Client;
