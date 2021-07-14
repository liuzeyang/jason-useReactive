'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nextTick = require('next-tick');
var react = require('react');
var reactivity = require('@vue/reactivity');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var nextTick__default = /*#__PURE__*/_interopDefaultLegacy(nextTick);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function shouldUpdate(changes, oldChanges) {
  if (changes.length !== oldChanges.length) {
    return true;
  }

  for (var i = 0; i < changes.length; i++) {
    if (oldChanges[i] !== changes[i]) {
      return true;
    }
  }

  return false;
}

var useForceUpdate = function useForceUpdate() {
  var _useReducer = react.useReducer(function (s) {
    return s + 1;
  }, 0),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      forceUpdate = _useReducer2[1];

  return forceUpdate;
};
function useEffection(fn, options, changes) {
  var _effectionRef$current;

  var effectionRef = react.useRef({});

  if (!effectionRef.current.effection) {
    effectionRef.current = {
      effection: reactivity.effect(fn, options),
      changes: changes !== null && changes !== void 0 ? changes : []
    };
  } else if (changes && changes.length && shouldUpdate(changes, (_effectionRef$current = effectionRef.current.changes) !== null && _effectionRef$current !== void 0 ? _effectionRef$current : [])) {
    reactivity.stop(effectionRef.current.effection);
    effectionRef.current = {
      effection: reactivity.effect(fn, options),
      changes: changes !== null && changes !== void 0 ? changes : []
    };
  }

  var stopEffect = function stopEffect() {
    return reactivity.stop(effectionRef.current.effection);
  };

  react.useEffect(function () {
    return stopEffect;
  }, []);
  return effectionRef.current.effection;
}

function useReactive(fn, options, changes) {
  var forceUpdate = useForceUpdate();
  var jobRef = react.useRef(null);
  var shouldRunRef = react.useRef(false);

  var notify = function notify(fn) {
    var job = jobRef.current;
    jobRef.current = null;

    if (job !== null) {
      var value = (options === null || options === void 0 ? void 0 : options.scheduler) ? options === null || options === void 0 ? void 0 : options.scheduler(job) : job();
      if (value === undefined) return fn();
      forceUpdate();
    }

    return fn();
  };

  var effection = useEffection(fn, _objectSpread2(_objectSpread2({}, options), {}, {
    scheduler: function scheduler(effect) {
      if (options === null || options === void 0 ? void 0 : options.async) {
        jobRef.current = effect;

        if (!shouldRunRef.current) {
          shouldRunRef.current = true;
          nextTick__default['default'](function () {
            return notify(function () {
              return shouldRunRef.current = false;
            });
          });
        }
      } else {
        var value = effect();

        if (value) {
          forceUpdate();
        }
      }
    },
    lazy: true
  }), changes);
  return effection && effection();
}

exports.useReactive = useReactive;
