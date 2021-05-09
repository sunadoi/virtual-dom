import { patch } from "./patch";

export const app = ({ root, initialState, view, actions }) => {
  const $el = document.querySelector(root);

  // 初期化
  let oldNode
  let state = initialState;

  const dispatcher = function (actions) {
    const dispatchedActions = {};

    for (const key in actions) {
      const action = actions[key];

      dispatchedActions[key] = (option) => {
        setState(action(state, option));
        renderDOM();
      };
    }
    return dispatchedActions;
  };

  const setState = function (newState) {
    if (state !== newState) {
      state = newState;
    }
  };

  // これがDOMの組み立て。stateを置き換える
  const updateNode = function () {
    newNode = view(state, dispatcher(actions));
  };

  const renderDOM = function () {
    // stateが新しいものに更新される
    // 新しいstateによって作られた仮想DOMオブジェクトがnewNodeに格納される
    updateNode();
    // 新しく作成した仮想DOMオブジェクトと現在の仮想DOMオブジェクトを比較して、変更があった部分のみを変更している。
    // そうすると$elの内容が変更されてこれがマウントされる
    patch($el, newNode, oldNode);
    // その後、新しい仮想DOMオブジェクトを現在の仮想DOMオブジェクトに置き換える
    oldNode = newNode;
  };

  renderDOM();
};