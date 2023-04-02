// db = new MovieDB("./small_data.json");
db = new MovieDB("./DO_NOT_TOUCH/data.json");

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

refreshTable = function () {
  let oldTable = document.querySelector(".resultTable");
  oldTable.innerHTML = "";

  // Starter sizes but will be dynamically adjusted
  const rowHeight = 28;
  let wh = window.innerHeight;

  // create the table

  let newTable = document.createElement("div");
  newTable.setAttribute("class", "resultTable");

  let sortKey = "ACTOR_NAME";
  let pageIndex = 0;
  let pageSize = wh / rowHeight;

  addHeaderRow(newTable);

  for (let i = pageIndex; i < pageIndex + pageSize; i++) {
    let r = db.recordBySortKeyAt(sortKey, i);
    addRecordRow(newTable, r);
  }

  document.querySelector(".content").replaceChild(newTable, oldTable);

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

refreshTable();

let rzto = null;
handlerResize = function () {
  if (rzto) {
    clearTimeout(rzto);
  }
  rzto = setTimeout(refreshTable, 40);
};

window.addEventListener("resize", handlerResize);
