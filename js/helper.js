var helper = (function() {

  var e = function(selector) {
    return document.querySelector(selector);
  };

  var eA = function(selector) {
    return document.querySelectorAll(selector);
  };

  var applyOptions = function(defaultOptions, options) {
    if (defaultOptions && options) {
      if (options) {
        for (var key in options) {
          if (key in defaultOptions) {
            defaultOptions[key] = options[key];
          }
        }
      }
      return defaultOptions;
    } else {
      return null;
    }
  };

  var _makeAddress = function(path) {
    var array;
    if (path.indexOf("[") != -1 && path.indexOf("]") != -1) {
      array = path.split(".").join(",").split("[").join(",").split("]").join(",").split(",");
      for (var i = 0; i < array.length; i++) {
        if (array[i] === "") {
          array.splice(i, 1);
        }
        if (!isNaN(parseInt(array[i], 10))) {
          array[i] = parseInt(array[i], 10);
        }
      }
    } else {
      array = path.split(".");
    }
    return array;
  };

  var setObject = function(options) {
    var defaultOptions = {
      path: null,
      object: null,
      newValue: null
    };
    if (options) {
      defaultOptions = applyOptions(defaultOptions, options);
    }
    var address = _makeAddress(defaultOptions.path);
    var _setData = function() {
      while (address.length > 1) {
        // shift off and store the first key
        var currentKey = address.shift();
        // if the key is not found make a new object
        if (!(currentKey in defaultOptions.object)) {
          // make an empty object in the current object level
          if (isNaN(currentKey)) {
            defaultOptions.object[currentKey] = {};
          } else {
            defaultOptions.object[currentKey] = [];
          }
        }
        // drill down the object with the first key
        defaultOptions.object = defaultOptions.object[currentKey];
      }
      var finalKey = address.shift();
      defaultOptions.object[finalKey] = defaultOptions.newValue;
    };
    if (defaultOptions.object !== null && defaultOptions.path !== null && defaultOptions.newValue !== null) {
      _setData();
    } else {
      return false;
    }
  };

  var getObject = function(options) {
    var defaultOptions = {
      object: null,
      path: null
    };
    if (options) {
      defaultOptions = applyOptions(defaultOptions, options);
    }
    var address = _makeAddress(defaultOptions.path);
    var _getData = function() {
      while (address.length > 1) {
        // shift off and store the first key
        var currentKey = address.shift();
        // if the key is not found make a new object
        if (!(currentKey in defaultOptions.object)) {
          // make an empty object in the current object level
          if (isNaN(currentKey)) {
            defaultOptions.object[currentKey] = {};
          } else {
            defaultOptions.object[currentKey] = [];
          }
        }
        // drill down the object with the first key
        defaultOptions.object = defaultOptions.object[currentKey];
      }
      var finalKey = address.shift();
      if (!(finalKey in defaultOptions.object)) {
        return "";
      } else {
        return defaultOptions.object[finalKey];
      }
    };
    if (defaultOptions.object !== null && defaultOptions.path !== null) {
      return _getData();
    } else {
      return false;
    }
  };

  function makeObject(string) {
    var _stringOrBooleanOrNumber = function(stringToTest) {
      if (stringToTest == "true") {
        return true;
      } else if (stringToTest == "false") {
        return false;
      } else if (stringToTest.indexOf("#") != -1) {
        return stringToTest.substr(1, kevValuePair[1].length);
      } else {
        return "\"" + stringToTest + "\"";
      };
    };
    // if argument is a string
    if (typeof string == "string") {
      // start building the object
      var objectString = "{";
      // split the string on comma not followed by a space
      // split on character if not followed by a space
      var items = string.split(/,(?=\S)/);
      // loop over each item
      for (var i = 0; i < items.length; i++) {
        // split each would be object key values pair
        // split on character if not followed by a space
        var kevValuePair = items[i].split(/:(?=\S)/);
        // get the key
        var key = "\"" + kevValuePair[0] + "\"";
        var value;
        // if the value has + with a space after it
        if (/\+(?=\S)/.test(kevValuePair[1])) {
          // remove first + symbol
          kevValuePair[1] = kevValuePair[1].substr(1, kevValuePair[1].length);
          // split the would be values
          // split on character if not followed by a space
          var all_value = kevValuePair[1].split(/\+(?=\S)/);
          // if there are multiple values make an array
          value = "["
          for (var q = 0; q < all_value.length; q++) {
            value += _stringOrBooleanOrNumber(all_value[q]) + ",";
          };
          // remove last comma
          value = value.substr(0, value.length - 1);
          // close array
          value += "]"
        } else {
          value = _stringOrBooleanOrNumber(kevValuePair[1]);
        };
        objectString += key + ":" + value + ",";
      };
      // remove last comma
      objectString = objectString.substr(0, objectString.length - 1);
      // close object
      objectString += "}";
      var object = JSON.parse(objectString);
      return object;
    } else {
      return false;
    };
  };

  function sortObject(object, key) {
    object.sort(function(a, b) {
      var textA = a[key];
      var textB = b[key];
      if (textA < textB) {
        return -1;
      } else if (textA > textB) {
        return 1;
      } else {
        return 0;
      };
      // return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    return object;
  };

  return {
    e: e,
    eA: eA,
    getObject: getObject,
    setObject: setObject,
    makeObject: makeObject,
    sortObject: sortObject,
    applyOptions: applyOptions
  };

})();
