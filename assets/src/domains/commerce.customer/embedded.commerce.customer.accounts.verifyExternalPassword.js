/**
 * Implementation for embedded.commerce.customer.accounts.verifyExternalPassword

 * This custom function will receive the following context object:
{
  "exec": {
    "setSuccess": {
      "parameters": [
        {
          "type": "bool"
        }
      ]
    }
  },
  "get": {
    "clearTextPassword": {
      "parameters": [],
      "return": {
        "type": "string"
      }
    },
    "externalPassword": {
      "parameters": [],
      "return": {
        "type": "string"
      }
    }
  }
}


 */
const drupal = require('drupal-hash');

module.exports = function(context, callback) {
  var stored = context.get.externalPassword();
  var password = context.get.clearTextPassword();
  var success = drupal.checkPassword(password, stored);

  context.exec.setSuccess(success);

  callback();
};
