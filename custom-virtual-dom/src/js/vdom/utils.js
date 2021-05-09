
export const isEventAttr = (attr) => {
  return /^on/.test(attr);
};

export const isVNode = (node) => {
  return typeof node !== "string";
};

export const isTextChild = (node) => {
  return (
    node &&
    node.children &&
    node.children.length > 0 &&
    typeof node.children[0] === "string"
  );
};