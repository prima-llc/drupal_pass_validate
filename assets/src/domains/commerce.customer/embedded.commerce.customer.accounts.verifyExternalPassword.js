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

module.exports = function(context, callback) {
  callback();
};