class Search {
  constructor() {}
}

document.querySelector("img#cancel").addEventListener("click", function (ev) {
  Search.hide();
  ev.stopPropagation();
});

let searchTimer = null;
document.querySelector("input").addEventListener("keyup", function (ev) {
  ev.stopPropagation();
  if (ev.code == "Enter") {
    let picks = document.querySelectorAll("div.searchPicksTable .col");
    if (!picks || picks.length == 0) {
      return;
    } else {
      // get the first term and refresh the page
      let foundTerm = picks[0].innerText;
      Search.hide();
      ev.target.searchCallback(foundTerm);
      return;
    }
  } else {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(Search.doSearch, 200, ev.target.value, false);
  }
});

Search.hide = function () {
  document
    .querySelector("div.search")
    .setAttribute("class", "search searchHide");
};

Search.isShown = function () {
  let s = document.querySelector("div.search");
  if (s.getAttribute("class") == "search searchShow") {
    return true;
  }
  return false;
};

Search.show = function (keyIndex, prompt, searchCallback) {
  if (Search.isShown()) {
    return;
  }

  let inputContainer = document.querySelector("div.searchItems.searchInput");
  if (!searchCallback) {
    inputContainer.setAttribute("style", "display: none");
  } else {
    inputContainer.removeAttribute("style");
  }

  let s = document.querySelector("div.search");

  let sLabel = document.querySelector("div.searchLabel");
  sLabel.innerHTML = prompt;

  let oldPicks = document.querySelector(".searchPicksTable");
  oldPicks.innerHTML = "";

  let w = 400;
  let h = 500;
  let wh = window.innerHeight;
  let ww = window.innerWidth;
  let top = Math.trunc((wh - h) / 2);
  let left = Math.trunc((ww - w) / 2);
  s.setAttribute(
    "style",
    `top: ${top}px; left: ${left}px; width: ${w}px; height: ${h}px;`
  );

  let rh = h - 125;
  let sr = document.querySelector("div.searchResults");
  sr.setAttribute("style", `height: ${rh}px; overflow-y: auto`);

  s.setAttribute("class", "search searchShow");
  let inputText = document.querySelector("input");
  inputText.keyIndex = keyIndex;
  inputText.searchCallback = searchCallback;
  inputText.value = "";
  inputText.focus();
};

Search.doSearch = function (term) {
  searchTimer = null;

  let input = document.querySelector("input");
  let keyIndex = input.keyIndex;
  let searchCallback = input.searchCallback;

  let oldPicks = document.querySelector(".searchPicksTable");
  let newPicks = document.createElement("div");
  newPicks.setAttribute("class", "searchPicksTable");

  let matches = keyIndex.search(term);
  matches.forEach(function (val) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    let elem = document.createElement("div");
    elem.setAttribute("class", "searchPick col");
    elem.innerHTML = val;
    row.appendChild(elem);
    newPicks.appendChild(row);
  });
  oldPicks.parentElement.replaceChild(newPicks, oldPicks);

  document.querySelectorAll("div.searchPicksTable .col").forEach(function (e) {
    e.addEventListener("click", function (ev) {
      let term = ev.target.innerText;
      Search.hide();
      searchCallback(term);
    });
  });
};
