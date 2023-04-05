class Search {
  constructor(searchCallback) {
    this.searchCallback = searchCallback;

    document.querySelector("img#cancel").addEventListener(
      "click",
      function (ev) {
        this.hide();
        ev.stopPropagation();
      }.bind(this)
    );

    this.searchTimer = null;
    document.querySelector("input").addEventListener(
      "keyup",
      function (ev) {
        ev.stopPropagation();
        if (ev.code == "Enter") {
          let picks = document.querySelectorAll("div.searchPicksTable .col");
          if (!picks || picks.length == 0) {
            return;
          } else {
            // get the first term and refresh the page
            let foundTerm = picks[0].innerText;
            this.hide();
            this.searchCallback(foundTerm);
            return;
          }
        } else {
          if (this.searchTimer) {
            clearTimeout(this.searchTimer);
          }
          this.searchTimer = setTimeout(
            this.doSearch.bind(this),
            200,
            ev.target.value,
            false
          );
        }
      }.bind(this)
    );
  }

  hide() {
    document
      .querySelector("div.search")
      .setAttribute("class", "search searchHide");
  }

  isShown() {
    let s = document.querySelector("div.search");
    if (s.getAttribute("class") == "search searchShow") {
      return true;
    }
    return false;
  }

  show(keyIndex, prompt) {
    if (this.isShown()) {
      return;
    }

    this.keyIndex = keyIndex;

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
    inputText.value = "";
    inputText.focus();
  }

  doSearch(term) {
    this.searchTimer = null;

    let oldPicks = document.querySelector(".searchPicksTable");
    let newPicks = document.createElement("div");
    newPicks.setAttribute("class", "searchPicksTable");

    let matches = this.keyIndex.search(term);
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

    document.querySelectorAll("div.searchPicksTable .col").forEach(
      function (e) {
        e.addEventListener(
          "click",
          function (ev) {
            let term = ev.target.innerText;
            this.hide();
            this.searchCallback(term);
          }.bind(this)
        );
      }.bind(this)
    );
  }
} // end of Search class
