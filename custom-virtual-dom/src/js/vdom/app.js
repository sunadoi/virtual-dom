import { render } from "./render";

export const app = ({ root, initialState, view }) => {
  const $el = document.querySelector(root);
  let newNode = view(initialState);

  const renderDOM = function () {
    $el.appendChild(render(newNode));
  };

  renderDOM();
};