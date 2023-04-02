// db = new MovieDB("./small_data.json");
db = new MovieDB("./DO_NOT_TOUCH/data.json");

const minHeight = 400;
const minWidth = 750;

let displayOrder = [
  "ACTOR_NAME",
  "ACTOR_ID",
  "FILM_NAME",
  "YEAR_RELEASED",
  "VOTES",
  "RATING",
  "FILM_ID",
];

addHeaderRow = function (table) {
  let rowElem = document.createElement("div");
  rowElem.setAttribute("class", "row");

  // Row index filler
  let elem = document.createElement("div");
  elem.setAttribute("class", "header");
  elem.appendChild(document.createTextNode(" "));
  rowElem.appendChild(elem);

  displayOrder.forEach(function (ck) {
    let elem = document.createElement("div");
    elem.setAttribute("class", "header");
    elem.appendChild(document.createTextNode(ck));
    rowElem.appendChild(elem);
  });

  table.appendChild(rowElem);
};

addRecordRow = function (table, r) {
  let rowElem = document.createElement("div");
  rowElem.setAttribute("class", "row");

  let elem = document.createElement("div");
  elem.setAttribute("class", "col");
  elem.appendChild(document.createTextNode(r.i + 1));
  rowElem.appendChild(elem);

  displayOrder.forEach(function (ck) {
    let elem = document.createElement("div");
    elem.setAttribute("class", "col");
    elem.appendChild(document.createTextNode(r[ck]));
    rowElem.appendChild(elem);
  });

  table.appendChild(rowElem);
};

fixResize = function () {
  refreshTable();
  adjustPageBar();
};

adjustPageBar = function () {
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
  let thumbPos = headerHeight;
  pt.setAttribute(
    "style",
    "width: 20px; height: 20px; border-radius: 10px; left: 0px; top: " +
      thumbPos +
      "px;"
  );
};

refreshTable = function (pageIndex = 0) {
  let oldTable = document.querySelectorAll(".resultTable")[0];

  // Starter sizes but will be dynamically adjusted
  const rowHeight = 28;
  let wh = window.innerHeight;

  // create the table

  let newTable = document.createElement("div");
  newTable.setAttribute("class", "resultTable");

  let sortKey = "ACTOR_NAME";
  let pageSize = wh / rowHeight;

  addHeaderRow(newTable);

  for (let i = pageIndex; i < pageIndex + pageSize; i++) {
    let r = db.recordBySortKeyAt(sortKey, i);
    addRecordRow(newTable, r);
  }

  oldTable.parentElement.replaceChild(newTable, oldTable);

  let allRows = document.querySelectorAll(".row");
  if (allRows && allRows.length > 0) {
    let curRow = allRows.length - 1;
    let lastRow = allRows[curRow];
    while (lastRow.offsetTop + lastRow.clientHeight > wh) {
      lastRow.remove();
      curRow--;
      lastRow = allRows[curRow];
    }
  }
};

fixResize();

let rzto = null;
handlerResize = function () {
  if (rzto) {
    clearTimeout(rzto);
  }
  rzto = setTimeout(fixResize, 40);
};

window.addEventListener("resize", handlerResize);

let thumbStyle = document.querySelector(".pageThumb").style;
let oldTop = null;
let origY = null;
document
  .querySelector(".pageThumb")
  .addEventListener("mousedown", function (ev) {
    if (origY == null) {
      origY = ev.clientY;
      oldTop = parseInt(thumbStyle.top);
    }
    document.querySelector("body").setAttribute("class", "disable-select");
  });

movePageThumb = function (delta) {
  let pt = document.querySelector(".pageThumb");
  let pb = document.querySelector(".pageBar");
  let tb = document.querySelector(".resultTable");
  let minTop = tb.children[0].clientHeight;
  let maxTop = minTop + pb.clientHeight - pt.clientHeight;
  let newTop = oldTop + delta;
  if (newTop < minTop) {
    newTop = minTop;
  }
  if (newTop > maxTop) {
    newTop = maxTop;
  }
  pt.style.top = newTop + "px";
};

refreshPageAtIndex = function () {
  let pt = document.querySelector(".pageThumb");
  let pb = document.querySelector(".pageBar");
  let tb = document.querySelector(".resultTable");
  let minTop = tb.children[0].clientHeight;
  let maxTop = minTop + pb.clientHeight - pt.clientHeight;
  refreshTable(
    Math.trunc(
      ((parseInt(pt.style.top) - minTop) * db.numOfRecords()) /
        (maxTop - minTop)
    )
  );
};

document.addEventListener("mousemove", function (ev) {
  if (origY) {
    delta = ev.clientY - origY;
    movePageThumb(delta);
    refreshPageAtIndex();
  }
});

document.addEventListener("mouseup", function (ev) {
  if (origY) {
    delta = ev.clientY - origY;
    movePageThumb(delta);
    refreshPageAtIndex();
  }
  document.querySelector("body").removeAttribute("class");
  origY = null;
});
