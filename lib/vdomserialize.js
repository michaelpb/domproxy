/*
The MIT License (MIT)

Copyright (c) 2015 Jari Voutilainen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var VNode = require('virtual-dom/vnode/vnode');
var VPatch = require('virtual-dom/vnode/vpatch');
var VText = require('virtual-dom/vnode/vtext');

module.exports.serializePatches = function(obj){

    obj = iterate(obj);
    return obj;
};

module.exports.deserializePatches = function(obj){

    for ( var prop in obj ){
        if ( obj.hasOwnProperty(prop)) {
            obj[prop] = createNode(obj[prop]);
        }
    }
    return obj;
};

function createNode(obj){
    var node = '';
    if ( obj['#type']) {
        if (obj['#type'] == 'VirtualPatch') {
            obj.patch = createNode(obj.patch);
            node = new VPatch(obj.type, obj.vNode, obj.patch);
            return node;
        }
        else if (obj['#type'] == 'VirtualText') {
            node = new VText(obj.text);
            return node;
        }
        else if (obj['#type'] == 'VirtualNode') {
            var children = [];
            for (var child in obj.children) {
                if ( obj.children.hasOwnProperty(child)) {
                    children.push(createNode(obj.children[child]))
                }
            }
            node = new VNode(obj.tagName, obj.properties, children);
            return node;
        }
    }
    else if (Array.isArray(obj)){
        var arr = [];
        for ( var i in obj ){
            if ( obj.hasOwnProperty(i)) {
                arr.push(createNode(obj[i]))
            }
        }
        obj = arr;
    }
    return obj;
}

function iterate(obj){
    for (var prop in obj ){
        if ( obj.hasOwnProperty(prop)) {
            if (Array.isArray(obj[prop])) {
                obj[prop] = iterate(obj[prop])
            }
            else {
                if (obj[prop] && obj[prop].constructor && (
                    obj[prop].constructor.name == 'VirtualNode' ||
                    obj[prop].constructor.name == 'VirtualPatch' ||
                    obj[prop].constructor.name == 'VirtualText')) {
                    console.log("found node: " + obj[prop].constructor.name);
                    obj[prop]['#type'] = obj[prop].constructor.name;
                    obj[prop] = iterate(obj[prop])
                }
            }
        }
    }

    return obj;
}
