/**
 * This Assignment module houses the code or services required to power
 * the movie search project.
 *
 * @module Assignment
 */

/** @const {Object} Contains a list of keys used in the input data */
const DBKEYS = {
  ACTOR_NAME: "actorName",
  ACTOR_ID: "actorID",
  FILM_NAME: "filmName",
  YEAR_RELEASED: "yearReleased",
  VOTES: "votes",
  RATING: "rating",
  FILM_ID: "filmID",
};

/**
 * The Index class is used to represent an indirect mapping
 * to the original array data of the movie database.
 *
 * This class is used by the MovieDB class.
 */
class Index {
  /**
   * The constructor takes an array of elements and performs a
   * non-destructive merge sort. The sorted results can be
   * retrieved, and searched by its member functions.
   *
   * @param {[String]} arr The input array to be sorted.
   */
  constructor(arr) {
    if (!Array.isArray(arr)) {
      return;
    }

    /**
     * This is the input source array is used for reference only
     * and will not be modified.
     */
    this.arr = arr;

    /**
     * This is the index array used for sorting. It contains indexes
     * to the original data stored in arr.
     */
    this.iarr = new Array(arr.length);
    for (let index = 0; index < arr.length; index++) {
      this.iarr[index] = index;
    }

    this.sort();
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
        // The if statements handle special optimizations
        if (this.arr[this.iarr[seg.m - 1]] < this.arr[this.iarr[seg.m]]) {
          // If all the values to the left of middle is less than the ones
          // to the right then there is nothing to be done.

          return;
        } else if (seg.e - seg.b == 2) {
          // Simple swap for only a single element in each segment
          if (this.arr[this.iarr[seg.b]] > this.arr[this.iarr[seg.m]]) {
            let t = this.iarr[seg.b];
            this.iarr[seg.b] = this.iarr[seg.m];
            this.iarr[seg.m] = t;
          }
        } else if (seg.e - seg.b == 3) {
          // Manual handling of a 3 elements segment
          let b1 = seg.b + 1;
          let b2 = seg.b + 2;

          if (this.arr[this.iarr[seg.b]] > this.arr[this.iarr[b2]]) {
            let t = this.iarr[seg.b];
            this.iarr[seg.b] = this.iarr[b2];
            this.iarr[b2] = t;
          }
          if (this.arr[this.iarr[seg.b]] > this.arr[this.iarr[b1]]) {
            let t = this.iarr[seg.b];
            this.iarr[seg.b] = this.iarr[b1];
            this.iarr[b1] = t;
          }
          if (this.arr[this.iarr[b1]] > this.arr[this.iarr[b2]]) {
            let t = this.iarr[b1];
            this.iarr[b1] = this.iarr[b2];
            this.iarr[b2] = t;
          }
        } else if (seg.e - seg.b == 4) {
          // Manual handling of a 4 elements segment
          let b1 = seg.b + 1;
          let b2 = seg.b + 2;
          let b3 = seg.b + 3;

          if (this.arr[this.iarr[seg.b]] > this.arr[this.iarr[b3]]) {
            let t = this.iarr[seg.b];
            this.iarr[seg.b] = this.iarr[b3];
            this.iarr[b3] = t;
          }
          if (this.arr[this.iarr[seg.b]] > this.arr[this.iarr[b1]]) {
            let t = this.iarr[seg.b];
            this.iarr[seg.b] = this.iarr[b1];
            this.iarr[b1] = t;
          }
          if (this.arr[this.iarr[b1]] > this.arr[this.iarr[b2]]) {
            let t = this.iarr[b1];
            this.iarr[b1] = this.iarr[b2];
            this.iarr[b2] = t;
          }
          if (this.arr[this.iarr[b2]] > this.arr[this.iarr[b3]]) {
            let t = this.iarr[b2];
            this.iarr[b2] = this.iarr[b3];
            this.iarr[b3] = t;
          }
        } else {
          this.merge(seg.b, seg.m, seg.e);
        }
      }.bind(this)
    );
  }

  getRangeOf(term) {
    let to = -1;
    let from = this.getFirstIndexOf(term);
    if (from >= 0) {
      for (let i = from; i < this.iarr.length; i++) {
        to = i;
        if (this.nth(i) != term) {
          break;
        }
      }
    }
    if (to >= 0) {
      return [from, to];
    } else {
      return [];
    }
  }

  getFirstIndexOf(term) {
    let min = 0;
    let max = this.arr.length;
    let mid = Math.trunc((max + min) / 2);
    let r = -1;
    while (true) {
      let v = this.nth(mid);
      if (!v) {
        break;
      }
      let found = false;
      if (v == term) {
        // walk back to get the first instance of possible duplicates
        for (let i = mid; i >= 0; i--) {
          if (this.nth(i) != term) {
            found = true;
            break;
          } else {
            r = i;
          }
        }
        if (!found) {
          r = 0;
        }
        break;
      } else if (v > term) {
        max = mid;
        mid = Math.trunc((mid + min) / 2);
        if (mid == max) {
          break;
        }
      } else if (v < term) {
        min = mid;
        mid = Math.trunc((max + mid) / 2);
        if (mid == min) {
          break;
        }
      }
    }
    return r;
  }

  nth(idx) {
    if (Number.isInteger(idx) && idx >= 0 && idx <= this.iarr.length) {
      return this.arr[this.iarr[idx]];
    }
    return "";
  }

  rangeValues(from, to) {
    let start = from;
    let end = to;
    if (Array.isArray(from) && from.length == 2) {
      start = from[0];
      end = from[1];
    }
    if (
      Number.isInteger(start) &&
      Number.isInteger(end) &&
      start >= 0 &&
      end >= 0 &&
      start <= end
    ) {
      if (end == start) {
        return [this.nth(start)];
      } else {
        let r = new Array(end - start);
        this.iarr.slice(start, end).forEach(
          function (e, i) {
            r[i] = this.arr[e];
          }.bind(this)
        );
        return r;
      }
    }
    return [];
  }

  /**
   * Use map to perform a function for every element in the sorted array
   * in the sorted order.
   *
   * @param  {Function}  func   This is the function that will be called
   *                            for every element.
   *
   * @param  {Number}    start  An optional starting index
   *                            (defaults to first element).
   *
   * @param  {Number}    end    An optional ending index
   *                            (defaults to last element).
   */
  map(func, start = 0, end = this.iarr.length) {
    if (func) {
      this.iarr.slice(start, end).forEach(
        function (item, idx) {
          func(this.arr[item], idx);
        }.bind(this)
      );
    }
  }

  /**
   * A convenience method to print all elements in sorted order stored
   * in this index object.
   */
  print() {
    this.map(function (item, idx) {
      console.log(`${idx}: ${item}`);
    });
  }
}

class MovieDB {
  constructor(jsonDataFile) {
    this.indexes = {};

    let data = loadJSON(jsonDataFile);
    Object.keys(DBKEYS).forEach(
      function (key) {
        console.log(`==>Sorting for ${key}`);
        let testArray = data[DBKEYS[key]];

        let pst = performance.now();
        let index = new Index(testArray);
        let pet = performance.now();

        this.indexes[key] = index;

        let d = pet - pst;
        console.log(`merge time (ms): ${d}`);
      }.bind(this)
    );
  }
}