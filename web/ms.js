class MergeSort {
  constructor(arr) {
    if (!Array.isArray(arr) || !arr.length) {
      return;
    }

    // This is the input source array
    this.arr = arr;

    // This is the index array used for sorting
    this.iarr = Array.apply(null, Array(arr.length)).map((_, idx) => {
      return idx;
    });
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

    if (i < leftLen) {
      this.iarr.splice(repl, leftLen - i, ...orig.slice(i, leftLen));
    }
    if (j < rightLen) {
      this.iarr.splice(repl, rightLen - j, ...orig.slice(leftLen + j));
    }

    // Use for instead of splice (seems to be slower)
    //
    // for (let k = i; k < leftLen; k++) {
    //   this.iarr[repl] = orig[k];
    //   repl++;
    // }
    // for (let k = j; k < rightLen; k++) {
    //   this.iarr[repl] = orig[leftLen + k];
    //   repl++;
    // }
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

let testArray = [
  "miwyg0nn98xlazn",
  "uzow1ofyc4vsknx",
  "wb7v6lqht5uphjw",
  "dz1mhh7a6u2ca6m",
  "637wpenuikbl7tt",
  "l7kk7lmre3ms5so",
  "gpkq8ncnbhqc2be",
  "v9lcxo43u7spnsl",
  "4k5wwzpcs30yiov",
  "28tcms4s0wpraeb",
  "jgimoire2aqatop",
  "zz6z4dzpxyp0n8l",
  "6lgsv5chkimvd7b",
  "hflwyysco3ta3pb",
  "l6c01pfe5iqvlem",
  "8h45v4g55k8qrba",
  "fgibaqhxxyrgd8o",
  "skdnspbtvsy17co",
  "1guep5mkb3ptv8z",
  "oj15ifgcnlmsq9d",
];

const sorter = new MergeSort(testArray);
let start = performance.now();
sorter.sort();
let end = performance.now();
console.log(`Execution time: ${end - start} ms`);
sorter.print();

start = performance.now();
testArray.sort();
end = performance.now();
console.log(`Built-in Execution time: ${end - start} ms`);
