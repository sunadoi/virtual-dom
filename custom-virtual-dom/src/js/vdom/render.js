import { isEventAttr } from "./utils";

const setAttrs = (target, attrs) => {
  for (const attr in attrs) {
    if (isEventAttr(attr)) {
      // onclickのonを削除してaddEventListenerでclickイベントを登録
      target.addEventListener(attr.slice(2), attrs[attr]);
    } else {
      // attrがclassとかだったらそのままセット
      target.setAttribute(attr, attrs[attr]);
    }
  }
};

function renderElement({ tagName, attrs, children }) {
  const $el = document.createElement(tagName);

  setAttrs($el, attrs);

  for (const child of children) {
    $el.appendChild(render(child));
  }

  return $el;
}

export function render(vNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode); // <p>text</p>
  }
  return renderElement(vNode);
}