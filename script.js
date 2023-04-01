// db = new MovieDB("./small_data.json");
db = new MovieDB("./DO_NOT_TOUCH/data.json");

refreshTable = function () {
  let oldTable = document.querySelector(".resultTable");
  oldTable.innerHTML = "";

  // Starter sizes but will be dynamically adjusted
  const headerHeight = 250;
  const rowHeight = 28;

  let ww = window.innerWidth;
  let wh = window.innerHeight;

  // create the table

  let newTable = document.createElement("div");
  newTable.setAttribute("class", "resultTable");

  let sortKey = "ACTOR_NAME";
  let pageIndex = 0;
  let pageSize = (wh - headerHeight) / rowHeight;

  for (let i = pageIndex; i < pageIndex + pageSize; i++) {
    let rowElem = document.createElement("div");
    rowElem.setAttribute("class", "row");

    let r = db.recordBySortKeyAt(sortKey, i);

    for (const [key, value] of Object.entries(r)) {
      let elem = document.createElement("div");
      elem.setAttribute("class", "col");
      elem.appendChild(document.createTextNode(value));
      rowElem.appendChild(elem);
    }

    newTable.appendChild(rowElem);
  }

  document.querySelector("body").replaceChild(newTable, oldTable);

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
