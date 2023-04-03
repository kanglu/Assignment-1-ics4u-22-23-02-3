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
    rzto = setTimeout(UI.fixResize, 40);
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
      UI.refreshTable(UI.curPageIndex + 1);
    } else if (ev.code == "ArrowUp") {
      UI.refreshTable(UI.curPageIndex - 1);
    } else if (ev.code == "PageUp") {
      UI.refreshTable(UI.curPageIndex - UI.curPageSize);
    } else if (ev.code == "PageDown") {
      UI.refreshTable(UI.curPageIndex + UI.curPageSize);
    } else if (ev.code == "Home") {
      UI.refreshTable(0);
    } else if (ev.code == "End") {
      UI.refreshTable(UI.db.numOfRecords() - UI.curPageSize);
    }
  });

  // Initialize the first display of data and resize the content
  // in the browser window.
  UI.fixResize();
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
    elem.curOrderIndex = i;
    elem.setAttribute("class", "header");
    elem.setAttribute(
      "style",
      "width: " + spec.width + (i == 0 ? "; color: yellow" : "")
    );
    elem.appendChild(document.createTextNode(spec.title));
    rowElem.appendChild(elem);

    elem.addEventListener(
      "click",
      function (ev) {
        let index = ev.target.index;
        let name = index.keyName;
        if (!index.isReady()) {
          console.log(`${name} index is not ready yet! Try again later.`);
          return;
        }
        let curIndex = ev.target.curOrderIndex;

        UI.displaySpec.order.splice(curIndex, 1);
        UI.displaySpec.order.splice(0, 0, name);

        UI.curPageIndex = 0;
        UI.fixResize();
      }.bind(this)
    );
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

  UI.displaySpec.order.forEach(function (ck) {
    let elem = document.createElement("div");
    elem.setAttribute("class", "col");
    elem.appendChild(document.createTextNode(r[ck]));
    rowElem.appendChild(elem);
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

UI.refreshTable = function (pageIndex = 0) {
  if (pageIndex < 0) {
    pageIndex = 0;
  }
  if (pageIndex > UI.db.numOfRecords() - UI.curPageSize) {
    pageIndex = UI.db.numOfRecords() - UI.curPageSize;
  }

  let oldTable = document.querySelectorAll(".resultTable")[0];

  // Starter sizes but will be dynamically adjusted
  const rowHeight = 28;
  let wh = window.innerHeight;

  // create the table

  let newTable = document.createElement("div");
  newTable.setAttribute("class", "resultTable");

  let sortKey = UI.displaySpec.order[0];
  UI.curPageSize = Math.trunc(wh / rowHeight);

  UI.addHeaderRow(newTable);

  for (let i = pageIndex; i < pageIndex + UI.curPageSize; i++) {
    let r = UI.db.recordBySortKeyAt(sortKey, i);
    UI.addRecordRow(newTable, r);
  }

  oldTable.parentElement.replaceChild(newTable, oldTable);

  let allRows = document.querySelectorAll(".row");
  if (allRows && allRows.length > 0) {
    let curRow = allRows.length - 1;
    let lastRow = allRows[curRow];
    while (lastRow.offsetTop + lastRow.clientHeight > wh) {
      lastRow.remove();
      UI.curPageSize--;
      curRow--;
      lastRow = allRows[curRow];
    }
  }

  UI.curPageIndex = pageIndex;
};

UI.fixResize = function () {
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
