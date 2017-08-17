'use strict';

const pageObject = require('./lib/page-object');
const isFunction = require('lodash/isFunction');

/**
 * Creates the nemo plugin. It sets the page object utilities inside the nemo instance as:
 * nemo.page
 * @example
 * {
 *  "plugins": {
 *    "nemo-objects": {
 *      "module": "nemo-objects",
 *      "arguments": [
 *        {
 *           "pagesLocation": "/path/to/pages"
 *        }
 *      ]
 *    }
 *  }
 * }
 * 
 * @param {Object} opts 
 * @param {Object} nemo 
 * @param {Function} callback 
 */
function createPageObject(opts, nemo, callback) {
  if (arguments.length === 2) {
    nemo = opts;
    callback = nemo;
    opts = {};
  }

  const names = ['countryLanding'];
  const modules = ['./test/pages/countryLanding'];

  modules.forEach((modulePath, index) => {
    const pageModel = require(modulePath);
    const page = pageObject(nemo);
    const model = pageModel(page, nemo);
    
    Object.keys(model).forEach((key) => {
      const method = model[key];
  
      if (isFunction(method)) {
        model[key] = method.bind(model, model);
      }
    });
  
    // TODO: Load page objects based on the provided path
    nemo.objects = {
      [names[index]]: model,
    };
  });

  callback();
};

module.exports = {
  setup: createPageObject,
};