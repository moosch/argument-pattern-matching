/**
 * Find the datatype of an input.
 * @param {*} a - Any datatype
 * @returns {String} - The datatype of a as a string.
 */
const getDataType = (a) => {
  if (a === undefined) {
    return 'Undefined';
  }
  if (a === null) {
    return 'Null';
  }
  return (a).name || ((a).constructor && (a).constructor.name);
}

function formattingError() {
  throw new Error(`There is a formatting error somewhere.
Your definition should look something like this:
m.add = ({ a: Number, b: Number }) => {
  return a + a;
};
or even:
m.add = ({ a: Number, b: Number }) => a + a;
`);
}

/**
 * Creates an object of methods
 * @param {String} name - The name of our function
 */
const fpm = (name) => {
  if (!name || name === '' || typeof name !== 'string') {
    throw new Error('You must specify a function name');
  }

  // Store patterns as object
  const patterns = {};

  // Initial
  const ctx = this;

  /**
   * Split stringified arguments to array of argument names and types
   * @param {String} str - Stringified arguments
   * @returns {Array}
   */
  const convertToArgs = (str) =>
    str.split(',')
      .map((arg) => {
        const pair = arg.trim().split('=');
        if (pair.length < 2) {
          if (pair.length === 1) {
            throw new TypeError(`Argument ${pair[0]} required an input type`);
          }
          throw new TypeError(`Invalid argument setup`);
        }
        return pair.map((item, k) => item.trim());
      });

  const mergeArgTypes = (...args) => {
    if (!args || args.length === 0) {
      return '_';
    }
    return args.map((arg) => arg[1]).join(',');
  };

  /**
   * Get the arguments and argument types from stringified function
   * @param {*} str - Stringified function definition
   * @returns {Array|Error}
   */
  const getArgs = (str) => {
    const regExp = /\(([^)]+)\)/;
    const matches = regExp.exec(str);
    if (matches.length === 0) {
      formattingError();
    }

    // The first one will be a string of an object.
    return convertToArgs(matches[0].substring(1, matches[0].length-1));
  }

  /*
  Could search for number of arguments first
  Then try for type matches. May be faster...
  */
  const attemptMatch = (...args) => {
    const key = args.map((arg) => getDataType(arg)).join(',');
    if (!patterns[key]) {
      // throw or silent fail?
      throw new Error('Unable to find a function pattern match');
    }
    return patterns[key](...args);
  }

  // Define the function within this context
  ctx[name] = () => {};

  const o = {};
  Object.defineProperty(o, 'add', {
    set(fn) {
      const fnStr = fn.toString();
      // Extract arguments from function string
      const args = getArgs(fnStr);
      // Convert function argument types to a comma separated string
      const key = mergeArgTypes(...args);
      // patterns[key] = new Function('a', 'b', 'return a + b');
      patterns[key] = fn;
      // May need to use Function.caller to maintain caller context
      ctx[name] = attemptMatch;
    },
  });
  return o;
};

module.exports = fpm;
