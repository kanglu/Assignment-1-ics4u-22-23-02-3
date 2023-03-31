const data = loadJSON("./DO_NOT_TOUCH/data.json");

const DBKEYS = {
  ACTOR_NAME: "actorName",
  ACTOR_ID: "actorID",
  FILM_NAME: "filmName",
  YEAR_RELEASED: "yearReleased",
  VOTES: "votes",
  RATING: "rating",
  FILM_ID: "filmID",
};

class MergeSort {
  constructor(arr) {
    if (!Array.isArray(arr) || !arr.length) {
      return;
    }

    // This is the input source array
    this.arr = arr;

    // This is the index array used for sorting
    this.iarr = new Array(arr.length);
    for (let index = 0; index < arr.length; index++) {
      this.iarr[index] = index;
    }

    // this.iarr = Array.apply(null, Array(arr.length)).map((_, idx) => {
    //   return idx;
    // });
  }

  // Optionally set the input array after construction
  setArr(arr) {
    this.arr = arr;
  }

  // Use map to perform a function for every element in the sorted array
  map(func) {
    if (func) {
      this.iarr.forEach(
        function (item, idx) {
          func(this.arr[item], idx);
        }.bind(this)
      );
    }
  }

  merge(b, m, e) {
    let i = 0;
    let j = 0;
    const leftLen = m - b;
    const rightLen = e - m;

    let orig = this.iarr.slice(b, e);
    let repl = 0;
    while (i < leftLen && j < rightLen) {
      repl = b + i + j;
      if (this.arr[orig[i]] < this.arr[orig[leftLen + j]]) {
        this.iarr[repl] = orig[i];
        i++;
      } else {
        this.iarr[repl] = orig[leftLen + j];
        j++;
      }
    }

    repl = b + i + j;

    // Using splice seem to have stack size limitations
    //
    // if (i < leftLen) {
    //   this.iarr.splice(repl, leftLen - i, ...orig.slice(i, leftLen));
    // }
    // if (j < rightLen) {
    //   this.iarr.splice(repl, rightLen - j, ...orig.slice(leftLen + j));
    // }

    for (let k = i; k < leftLen; k++) {
      this.iarr[repl] = orig[k];
      repl++;
    }
    for (let k = j; k < rightLen; k++) {
      this.iarr[repl] = orig[leftLen + k];
      repl++;
    }
  }

  sort() {
    let segReqProcB = [0];
    let segReqProcE = [this.arr.length];

    let newIndex = 0;
    let segments = [];

    while (newIndex < segReqProcB.length) {
      let finished = segReqProcB.length;
      let procIdx = newIndex;
      while (procIdx < finished) {
        let b = segReqProcB[procIdx];
        let e = segReqProcE[procIdx];
        let m = Math.trunc((e + b) / 2);
        segments.push({
          b: b,
          e: e,
          m: m,
        });
        if (m - b > 1) {
          segReqProcB.push(b);
          segReqProcE.push(m);
        }
        if (e - m > 1) {
          segReqProcB.push(m);
          segReqProcE.push(e);
        }
        procIdx++;
      }
      newIndex = finished;
    }

    segments.reduceRight(
      function (_, seg) {
        this.merge(seg.b, seg.m, seg.e);
      }.bind(this)
    );
  }

  print() {
    this.map(function (item, idx) {
      console.log(`${idx}: ${item}`);
    });
  }
}

Object.keys(DBKEYS).forEach(function (key) {
  console.log(`==>Sorting for ${key}`);
  let testArray = data[DBKEYS[key]];
  let sorter = new MergeSort(testArray);
  let start = performance.now();
  sorter.sort();
  let end = performance.now();
  console.log(`Execution time: ${end - start} ms`);

  start = performance.now();
  testArray.sort();
  end = performance.now();
  console.log(`Built-in Execution time: ${end - start} ms`);

  sorter = null;
});
