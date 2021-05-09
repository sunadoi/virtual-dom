import { render } from "./render";
import { isEventAttr, isTextChild, isVNode } from "./utils";

const hasChanged = (oldNode, newNode) => {
  if (typeof oldNode !== typeof newNode) {
    return "TYPE";
  }

  if (isTextChild(oldNode) && isTextChild(newNode)) {
    if (oldNode.children[0] !== newNode.children[0]) {
      return "TEXT";
    }
  }

  if (isVNode(oldNode) && isVNode(newNode)) {
    if (oldNode.tagName !== newNode.tagName) {
      return "NODE";
    }

    if (JSON.stringify(oldNode.attrs) !== JSON.stringify(newNode.attrs)) {
      return "ATTR";
    }
  }

  return "NONE";
};

const updateAttrs = (target, oldAttrs, newAttrs) => {
  for (const attr in oldAttrs) {
    if (!isEventAttr(attr)) {
      target.removeAttribute(attr);
    }
  }

  for (const attr in newAttrs) {
    if (!isEventAttr(attr)) {
      target.setAttribute(attr, newAttrs[attr]);
    }
  }
};

/*
  parent: 基本となる要素
  newNode: 新しい仮想DOM
  oldNode: 以前の仮想DOM
  index: childrenのindex

  parentは最初rootの要素であり、この関数内で再起的に呼び出される
*/
export const patch = (parent, newNode, oldNode, index = 0) => {
  // oldNodeがない。主に初期レンダリング
  if (!oldNode) {
    parent.appendChild(render(newNode));
  }

  const childNode = parent.childNodes[index];
  // 新しい仮想DOMのnodeがなければ、リアルDOMでもその要素を削除する
  if (!newNode) {
    parent.removeChild(childNode);
  }
  const type = hasChanged(oldNode, newNode);

  switch (type) {
    case "TYPE":
    case "TEXT":
    case "NODE":
      parent.replaceChild(render(newNode), childNode);
      return;

    case "ATTR":
      updateAttrs(childNode, oldNode.attrs, newNode.attrs);
      return;
  }

  // type === "NONE"
  if (newNode.tagName) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      patch(childNode, newNode.children[i], oldNode.children[i], i);
    }
  }
};