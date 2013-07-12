//= require_self

STDLIB = {};

STDLIB.splitString = (function(){
  var boxedString = Object("a");
  return boxedString[0] != "a" || !(0 in boxedString);
})();


STDLIB.negativeDate = -62198755200000;
STDLIB.negativeYearString = "-000001";

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

STDLIB.toInteger = function(n) {
  n = +n;
  if (n !== n) { // isNaN
    n = 0;
  } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
    n = (n > 0 || -1) * Math.floor(Math.abs(n));
  }
  return n;
}

STDLIB.isPrimitive = function(input) {
  var type = typeof input;
  return (
    input === null ||
    type === "undefined" ||
    type === "boolean" ||
    type === "number" ||
    type === "string"
  );
}

STDLIB.toPrimitive = function(input) {
  var val, valueOf, toString;
  if (STDLIB.isPrimitive(input)) {
    return input;
  }
  valueOf = input.valueOf;
  if (typeof valueOf === "function") {
    val = valueOf.call(input);
    if (STDLIB.isPrimitive(val)) {
      return val;
    }
  }
  toString = input.toString;
  if (typeof toString === "function") {
    val = toString.call(input);
    if (STDLIB.isPrimitive(val)) {
      return val;
    }
  }
  throw new TypeError();
}

// ES5 9.9
// http://es5.github.com/#x9.9
STDLIB.toObject = function (o) {
  if (o == null) { // this matches both null and undefined
    throw new TypeError("can't convert "+o+" to object");
  }
  return Object(o);
};
