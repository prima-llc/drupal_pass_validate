/**
 * This is a scaffold for unit tests for the custom function for
 * `embedded.commerce.customer.accounts.verifyExternalPassword`.
 * Modify the test conditions below. You may:
 *  - add special assertions for code actions from Simulator.assert
 *  - create a mock context with Simulator.context() and modify it
 *  - use and modify mock Mozu business objects from Simulator.fixtures
 */

'use strict';

var Simulator = require('mozu-action-simulator');
var assert = Simulator.assert;

var actionName = 'embedded.commerce.customer.accounts.verifyExternalPassword';

describe('drupal_pass_validate implementing embedded.commerce.customer.accounts.verifyExternalPassword', function () {

  var action;

  before(function () {
    action = require('../src/domains/commerce.customer/embedded.commerce.customer.accounts.verifyExternalPassword');
  });

  it('validates "password" password', function(done) {

    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      // more assertions
      done();
    };

    var context = Simulator.context(actionName, callback);

    // modify context as necessary
    context.get.externalPassword = function() { return '$S$DEXNLCKGllCnq38t4HqfXE4fMDZdeTXyNK93akBf0RbUW4YpRD6E' };
    context.get.clearTextPassword = function() { return 'password' };
    context.exec.setSuccess = function(succeeded) { assert.ok(succeeded) };

    Simulator.simulate(actionName, action, context, callback);
  });

  it('validates "password" with a different salt', function(done) {

    var callback = function(err) {
      assert.ok(!err, "Callback was called with an error: " + err);
      // more assertions
      done();
    };

    var context = Simulator.context(actionName, callback);

    // modify context as necessary
    context.get.externalPassword = function() { return '$S$DFhrExoOUvIZqb6jSMdbg9irujs8A6DQU299BwGrjB0MkpktWzhW' };
    context.get.clearTextPassword = function() { return 'password' };
    context.exec.setSuccess = function(succeeded) { assert.ok(succeeded) };

    Simulator.simulate(actionName, action, context, callback);
  });


});
