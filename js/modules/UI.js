/**
 * This AssignmentUI module containing a single UI class with
 * static methods that performs the majority of the UI logic.
 *
 * @module AssignmentUI
 */
class UI {
  constructor() {}
}

UI.setupDefaults = function () {
  // width must add to 95% the other 5% is for the row id.
  UI.displaySpec = {
    ACTOR_NAME: {
      title: "Actor",
      width: "20%",
    },

    ACTOR_ID: {
      title: "Actor ID",
      width: "12%",
    },

    FILM_NAME: {
      title: "Movie",
      width: "32%",
    },

    YEAR_RELEASED: {
      title: "Released",
      width: "5%",
    },

    VOTES: {
      title: "Votes",
      width: "8%",
    },

    RATING: {
      title: "Rating",
      width: "5%",
    },

    FILM_ID: {
      title: "IMDB",
      width: "10%",
    },

    order: [
      "ACTOR_NAME",
      "ACTOR_ID",
      "FILM_NAME",
      "YEAR_RELEASED",
      "VOTES",
      "RATING",
      "FILM_ID",
    ],
  };
};

UI.start = function (db) {
  UI.db = db;
  UI.oldTop = null;
  UI.curPageIndex = 0;

  // Setup required settings
  UI.setupDefaults();

  // Setup relevant listeners

  let rzto = null;
  window.addEventListener("resize", function () {
    if (rzto) {
      clearTimeout(rzto);
    }
    rzto = setTimeout(UI.fixResize, 100);
  });

  document.querySelector("img#search").addEventListener("click", function (ev) {
    let keyIndex = UI.activeIndex();
    Search.show(keyIndex, null, function (foundTerm) {
      let select = document.querySelector("#findIndex");
      let keyName = select.options[select.selectedIndex].value;

      UI.gotoKeyItem(keyName, null, foundTerm, true);
    });

    ev.stopPropagation();
  });

  let thumbStyle = document.querySelector(".pageThumb").style;
  let origY = null;
  document
    .querySelector(".pageThumb")
    .addEventListener("mousedown", function (ev) {
      if (origY == null) {
        origY = ev.clientY;
        UI.oldTop = parseInt(thumbStyle.top);
      }
      document.querySelector("body").setAttribute("class", "disable-select");
    });

  document.addEventListener("wheel", function (ev) {
    if (Search.isShown()) {
      return;
    }
    UI.refreshTable(UI.curPageIndex + Math.sign(ev.deltaY) * UI.curPageSize);
    UI.adjustPageBar();
  });

  document.addEventListener("mousemove", function (ev) {
    if (origY) {
      delta = ev.clientY - origY;
      UI.movePageThumb(delta);
      UI.refreshTableBasedOnThumb();
    }
  });

  document.addEventListener("mouseup", function (ev) {
    if (origY) {
      delta = ev.clientY - origY;
      UI.movePageThumb(delta);
      UI.refreshTableBasedOnThumb();
    }
    document.querySelector("body").removeAttribute("class");
    origY = null;
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.code == "ArrowDown") {
      let delta = 1;
      if (ev.altKey) {
        let index = UI.activeIndex();
        let term = index.nth(UI.curPageIndex);
        let range = index.getRangeOf(term);
        delta = range[1] - UI.curPageIndex;
      }
      UI.refreshTable(UI.curPageIndex + delta);
      UI.adjustPageBar();
    } else if (ev.code == "ArrowUp") {
      let delta = 1;
      if (ev.altKey) {
        let index = UI.activeIndex();
        let term = index.nth(UI.curPageIndex);
        let range = index.getRangeOf(term);
        let nextTermIdx = range[0];
        if (nextTermIdx > 0) {
          // Get the previous range of the "different" term
          range = index.getRangeOf(index.nth(nextTermIdx - 1));
        }
        delta = UI.curPageIndex - range[0];
      }
      UI.refreshTable(UI.curPageIndex - delta);
      UI.adjustPageBar();
    } else if (ev.code == "PageUp") {
      UI.refreshTable(UI.curPageIndex - UI.curPageSize);
      UI.adjustPageBar();
    } else if (ev.code == "PageDown") {
      UI.refreshTable(UI.curPageIndex + UI.curPageSize);
      UI.adjustPageBar();
    } else if (ev.code == "Home") {
      UI.refreshTable(0);
      UI.adjustPageBar();
    } else if (ev.code == "End") {
      UI.refreshTable(UI.db.numOfRecords() - UI.curPageSize);
      UI.adjustPageBar();
    }
  });

  // Initialize the first display of data and resize the content
  // in the browser window.
  UI.fixResize();
};

UI.gotoKeyItem = function (keyName, posIndex, value, closeSearch = true) {
  let startRowIndex = 0;
  if (posIndex) {
    startRowIndex = posIndex;
  }
  if (value) {
    startRowIndex = UI.db.indexes[keyName].getFirstIndexOf(value);
  }

  let curIndex = UI.displaySpec.order.indexOf(keyName, 0);

  UI.displaySpec.order.splice(curIndex, 1);
  UI.displaySpec.order.splice(0, 0, keyName);

  UI.curPageIndex = startRowIndex;
  UI.fixResize(closeSearch);
};

UI.switchKey = function (ev, startRowIndex = 0, givenIndex) {
  let index = givenIndex;
  if (!index) {
    index = ev.currentTarget.index;
  }

  let name = index.keyName;
  if (!index.isReady()) {
    console.log(`${name} index is not ready yet! Try again later.`);
    return;
  }
  UI.gotoKeyItem(name, startRowIndex);
};

UI.addHeaderRow = function (table) {
  let rowElem = document.createElement("div");
  rowElem.setAttribute("class", "row");

  // Row index filler
  let elem = document.createElement("div");
  elem.setAttribute("class", "header");
  elem.setAttribute("style", "width: 8%");
  elem.appendChild(document.createTextNode(" "));
  rowElem.appendChild(elem);

  UI.displaySpec.order.forEach(function (ck, i) {
    let spec = UI.displaySpec[ck];
    let elem = document.createElement("div");
    elem.index = UI.db.indexes[ck];
    elem.setAttribute("class", "header");
    elem.setAttribute(
      "style",
      "width: " + spec.width + (i == 0 ? "; color: yellow" : "")
    );

    let icon = "";
    if (ck == "ACTOR_NAME") {
      icon =
        '<img src="images/links.svg" width="25px" height="25px" id="links"/>';
    }

    elem.innerHTML =
      `<div style="display:flex; margin: 0; pading: 0;` +
      `flex-direction: row; column-gap: 10px; align-items: baseline;">` +
      `${icon}<div>${spec.title}</div></div>`;

    rowElem.appendChild(elem);

    if (i > 0) {
      elem.setAttribute("class", "header clickable");
      elem.addEventListener("click", UI.switchKey);
    }
  });

  table.appendChild(rowElem);
};

UI.addRecordRow = function (table, r) {
  let rowElem = document.createElement("div");
  rowElem.setAttribute("class", "row");

  let elem = document.createElement("div");
  elem.setAttribute("class", "col");
  elem.appendChild(document.createTextNode(r.i + 1));
  rowElem.appendChild(elem);

  UI.displaySpec.order.forEach(function (ck, i) {
    let elem = document.createElement("div");
    elem.index = UI.db.indexes[ck];
    let text = r[ck];
    if (ck == "FILM_ID") {
      text = `<a href="https://www.imdb.com/title/${text}/" target="_blank">${text}</a>`;
    } else if (ck == "ACTOR_ID") {
      text = `<a href="https://www.imdb.com/name/${text}/" target="_blank">${text}</a>`;
    }

    elem.setAttribute("class", "col" + (i > 0 ? " clickable" : ""));
    elem.innerHTML = text;

    rowElem.appendChild(elem);

    if (i > 0 && ck != "FILM_ID" && ck != "ACTOR_ID") {
      elem.addEventListener("click", function (ev) {
        let term = ev.target.innerText;
        UI.switchKey(ev, elem.index.getFirstIndexOf(term), elem.index);
      });
    }
  });

  table.appendChild(rowElem);
};

UI.adjustPageBar = function () {
  let pb = document.querySelector(".pageBar");
  let tb = document.querySelector(".resultTable");
  let headerHeight = tb.children[0].clientHeight;
  let pbHeight = tb.clientHeight - headerHeight;
  pb.setAttribute(
    "style",
    "width: 14px; border-radius: 7px; height: " +
      pbHeight +
      "px; left: 3px; top: " +
      headerHeight +
      "px;"
  );

  let pt = document.querySelector(".pageThumb");
  let minTop = headerHeight;
  let maxTop = minTop + pb.clientHeight - pt.clientHeight;
  let thumbPos = Math.trunc(
    (UI.curPageIndex * (maxTop - minTop)) / UI.db.numOfRecords() + minTop
  );
  pt.setAttribute(
    "style",
    "width: 20px; height: 20px; border-radius: 10px; left: 0px; top: " +
      thumbPos +
      "px;"
  );
};

UI.createFilmNodeRow = function (film) {
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  let elem = document.createElement("div");
  elem.setAttribute("class", "searchPick col");
  let filmElem = document.createElement("div");
  filmElem.setAttribute("class", "filmNode");

  let filmLine = document.createElement("div");
  filmLine.setAttribute("class", "filmLine");
  filmLine.appendChild(document.createTextNode(" "));
  filmElem.appendChild(filmLine);

  let filmBox = document.createElement("div");
  filmBox.setAttribute("class", "filmBox");
  filmBox.appendChild(document.createTextNode(film));
  filmElem.appendChild(filmBox);

  elem.appendChild(filmElem);
  row.appendChild(elem);

  filmBox.addEventListener("click", function (ev) {
    // temporary move the popup to the upper right corner
    let spopup = document.querySelector(".search");
    spopup.style.top = "10px";
    spopup.style.left = null;
    spopup.style.right = "10px";
    let term = ev.target.innerText;

    // refresh the table with new context
    UI.gotoKeyItem("FILM_NAME", null, term, false);
  });
  return row;
};

UI.createActorNodeRow = function (actor) {
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  let elem = document.createElement("div");
  elem.setAttribute("class", "searchPick col");
  let actorElem = document.createElement("div");
  actorElem.setAttribute("class", "actorNode");

  let actorBox = document.createElement("div");
  actorBox.setAttribute("class", "actorBox");
  actorBox.appendChild(document.createTextNode(actor));
  actorElem.appendChild(actorBox);

  elem.appendChild(actorElem);
  row.appendChild(elem);

  actorElem.addEventListener("click", function (ev) {
    // temporary move the popup to the upper right corner
    let spopup = document.querySelector(".search");
    spopup.style.top = "10px";
    spopup.style.left = null;
    spopup.style.right = "10px";
    let term = ev.target.innerText;

    // refresh the table with new context
    UI.gotoKeyItem("ACTOR_NAME", null, term, false);
  });
  return row;
};

UI.showActorConnections = function (path) {
  // Too lazy - repurpose the Search dialog.
  Search.show(null, "Connection Results:");

  let oldPicks = document.querySelector(".searchPicksTable");
  let newPicks = document.createElement("div");
  newPicks.setAttribute("class", "searchPicksTable");

  // Show number of connections
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  let elem = document.createElement("div");
  elem.setAttribute("class", "searchPick col");
  elem.innerHTML = `Connections: ${path.length}`;
  row.appendChild(elem);
  newPicks.appendChild(row);

  // Spacer row
  row = document.createElement("div");
  row.setAttribute("class", "row");
  elem = document.createElement("div");
  elem.setAttribute("class", "searchPick col");
  elem.innerHTML = "&nbsp;";
  row.appendChild(elem);
  newPicks.appendChild(row);

  if (path.length == 0) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    let elem = document.createElement("div");
    elem.setAttribute("class", "searchPick col");
    elem.innerHTML = "No Connections Found!";
    row.appendChild(elem);
    newPicks.appendChild(row);
  } else {
    path.reverse().forEach(function (node, i) {
      if (i == 0) {
        let fromActorName = UI.db.actorNameForID(node.fromActor);
        newPicks.appendChild(UI.createActorNodeRow(fromActorName));
      }

      let filmName = UI.db.filmNameForID(node.film);
      newPicks.appendChild(UI.createFilmNodeRow(filmName));

      let toActorName = UI.db.actorNameForID(node.actor);
      newPicks.appendChild(UI.createActorNodeRow(toActorName));
    });
  }
  oldPicks.parentElement.replaceChild(newPicks, oldPicks);
};

UI.addActorLinksBinding = function () {
  document.querySelector("img#links").addEventListener("click", function (ev) {
    Search.show(
      UI.db.indexes["ACTOR_NAME"],
      `Actor Connection: Pick the first actor:`,
      function (pick) {
        let actor1 = pick;
        Search.show(
          UI.db.indexes["ACTOR_NAME"],
          `<div style="line-height:1.5em">Actor Connection:</div>` +
            `<div style="line-height:1.5em"><span style="color: yellow">${actor1}</span> chosen;</div>` +
            `<div>Please pick the second actor:</div>`,
          function (pick) {
            let actor2 = pick;
            let actorIndex = UI.db.indexes["ACTOR_NAME"];
            let recOfActor1 = UI.db.recordByIndexForTerm(actorIndex, actor1);
            let recOfActor2 = UI.db.recordByIndexForTerm(actorIndex, actor2);
            let path = UI.db.findConnectionsBetweenActors(
              recOfActor1.ACTOR_ID,
              recOfActor2.ACTOR_ID
            );
            UI.showActorConnections(path);
          }
        );
      }
    );
    ev.stopPropagation();
  });
};

UI.refreshTable = function (pageIndex = 0) {
  if (pageIndex < 0) {
    pageIndex = 0;
  }
  if (pageIndex > UI.db.numOfRecords() - UI.curPageSize) {
    pageIndex = UI.db.numOfRecords() - UI.curPageSize;
  }

  let oldTable = document.querySelectorAll(".resultTable")[0];

  // Starter sizes but will be dynamically adjusted
  let firstRow = document.querySelector(".resultTable .row");
  const rowHeight = firstRow ? firstRow.nextElementSibling.clientHeight : 30;
  let wh = window.innerHeight;

  // create the table

  let newTable = document.createElement("div");
  newTable.setAttribute("class", "resultTable");

  let sortKey = UI.displaySpec.order[0];
  UI.curPageSize = Math.trunc((wh - 175) / rowHeight - 2);

  UI.addHeaderRow(newTable);

  for (let i = pageIndex; i < pageIndex + UI.curPageSize; i++) {
    let r = UI.db.recordBySortKeyAt(sortKey, i);
    UI.addRecordRow(newTable, r);
  }

  oldTable.parentElement.replaceChild(newTable, oldTable);

  let allRows = document.querySelectorAll(".row");
  if (allRows && allRows.length > 0) {
    for (let i = 0; i < allRows.length; i++) {
      if (allRows[i].offsetTop + allRows[i].clientHeight > wh) {
        allRows[i].remove();
      }
    }
  }

  UI.addActorLinksBinding();

  UI.curPageIndex = pageIndex;
};

UI.fixResize = function (closeSearch = true) {
  if (closeSearch) {
    Search.hide();
  }
  UI.refreshTable(UI.curPageIndex);
  UI.adjustPageBar();
};

UI.movePageThumb = function (delta) {
  let pt = document.querySelector(".pageThumb");
  let pb = document.querySelector(".pageBar");
  let tb = document.querySelector(".resultTable");
  let minTop = tb.children[0].clientHeight;
  let maxTop = minTop + pb.clientHeight - pt.clientHeight;
  let newTop = UI.oldTop + delta;
  if (newTop < minTop) {
    newTop = minTop;
  }
  if (newTop > maxTop) {
    newTop = maxTop;
  }
  pt.style.top = newTop + "px";
};

UI.activeIndex = function () {
  let curKey = UI.displaySpec.order[0];
  return UI.db.indexes[curKey];
};

UI.refreshTableBasedOnThumb = function () {
  let pt = document.querySelector(".pageThumb");
  let pb = document.querySelector(".pageBar");
  let tb = document.querySelector(".resultTable");
  let minTop = tb.children[0].clientHeight;
  let maxTop = minTop + pb.clientHeight - pt.clientHeight;
  UI.refreshTable(
    Math.trunc(
      ((parseInt(pt.style.top) - minTop) * UI.db.numOfRecords()) /
        (maxTop - minTop)
    )
  );
};
