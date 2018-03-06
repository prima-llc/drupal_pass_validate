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
const crypto = require('crypto');
const itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

module.exports = function(context, callback) {
  var stored = context.get.externalPassword();
  var password = context.get.clearTextPassword();

  if (stored.substr(0, 2) == 'U$') {
    // This may be an updated password from user_update_7000(). Such hashes have
    // 'U' added as the first character an need an extra MD5.
    stored = stored.substr(1);
    password = crypto.createHash('md5').update(password).digest('hex');
  }

  if (password.length > 512) {
    return callback("Password is way too long.");
  }

  var setting = stored.substr(0, 12);
  if (setting.charAt(0) != '$' || setting.charAt(2) != '$') {
    return callback("Stored hash is malformed.");
  }

  var log2_count = itoa64.indexOf(setting.charAt(3));
  if (log2_count < 7 || log2_count > 30) {
    return callback("Stored hash has too few or too many hash iterations.");
  }

  var salt = setting.substr(4, 8);
  if (salt.length != 8) {
    return callback ("Stored hash's salt must be 8 characters.");
  }

  var count = 1 << log2_count;

  var hash = crypto.createHash('sha512').update(salt + password).digest();
  do {
    hash = crypto.createHash('sha512').update(Buffer.concat([hash, Buffer.from(password)])).digest();
    count = count - 1
  } while (count > 0);

  var output = setting + encode64(hash);

  context.exec.setSuccess(output.substr(0, 55));

  callback();
};

function encode64(input) {
  var count = input.length,
      value = 0,
      i = 0,
      j = 0,
      output = Buffer.allocUnsafe(Math.ceil(8 * input.length / 6));

  do {
    value = input[i++];
    output.writeUInt8(itoa64.charCodeAt(value & 0x3f) & 0xff, j++);
    if (i < count) {
      value |= input[i] << 8;
    }
    output.writeUInt8(itoa64.charCodeAt((value >> 6) & 0x3f) & 0xff, j++);
    if (i++ >= count) {
      break;
    }
    if (i < count) {
      value |= input[i] << 16;
    }
    output.writeUInt8(itoa64.charCodeAt((value >> 12) & 0x3f) & 0xff, j++);
    if (i++ >= count) {
      break;
    }
    output.writeUInt8(itoa64.charCodeAt((value >> 18) & 0x3f) & 0xff, j++);
  } while (i < count);

  return output.toString('ascii');
}
