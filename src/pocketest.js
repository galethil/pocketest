/**
 * Created by Peter Baus on 11/11/2015.
 */

/*
Tests syntax.

pockeTest.group([group_name]);
pockeTest.test([test_name]).then([action]).then([action]).then([action])... ;
pockeTest.test([test_name_2]).then([action]).then([action]).then([action])... ;

pockeTest.group([group_name_2]);
pockeTest.test([test_name_3]).then([action]).then([action]).then([action])... ;
*/



(function( $ ){
    $.extend({
        pockeTest: function (options) {
            // pocketest plugin
            var self = this;

            // Create the defaults once
            var pluginName = 'pockeTest',
                defaults = {
                    startOn: {
                        type: "confirm",
                        text: "Run tests?",
                        timeout: 2000
                    },
                    fallBackTime: 40000,
                    actionTime: 100
                };

            self._options = {};

            //set from options
            if (typeof options == 'object') {

                //startOn option
                self._options.startOn = {};
                if (options.hasOwnProperty('startOn')) {
                    if (options.startOn.hasOwnProperty('type')) {
                        if (options.startOn.type == 'confirm') {
                            self._options.startOn.type = 'confirm';
                            if (options.startOn.hasOwnProperty('text') && typeof options.startOn.text == 'string') {
                                self._options.startOn.text = options.startOn.text;
                            } else {
                                self._options.startOn.text = defaults.startOn.text;
                            }
                            if (options.startOn.hasOwnProperty('timeout') && typeof options.startOn.timeout == 'number') {
                                self._options.startOn.timeout = options.startOn.timeout;
                            } else {
                                self._options.startOn.timeout = defaults.startOn.timeout;
                            }
                        } else if (options.startOn.type == 'auto') {
                            self._options.startOn.type = 'auto';
                            if (options.startOn.hasOwnProperty('timeout') && typeof options.startOn.timeout == 'number') {
                                self._options.startOn.timeout = options.startOn.timeout;
                            } else {
                                self._options.startOn.timeout = defaults.startOn.timeout;
                            }
                        }
                    } else {
                        self._options.startOn = defaults.startOn;
                    }
                }
            } else {
                self._options = defaults;
            }

            self._testQueue = [];
            self._queue = [];
            self._definedActions = {};
            self._definedWaitFors = {};
            self._definedFailWhens = {};
            self._queueCounter = 0;
            self._actionDone = true;
            self._testsStarted = false;
            self._values = {};
            self._testName = "";
            self._actualGroup = null;
            self._actualUser = null;
            self._actualUserOnPage = null;
            self._waitingCounter = 0;
            self._waitForTimeout = null;
            self._globalFailWhen = [];
            self._actionFailWhen = [];
            self._reports = [];
            self._fallBackTimeout = null;
            self._fallBackTime = 40000;
            self._skipActions = 0;
            self._skipActionsCounter = 0;


            self._finish = function() {

                //clear fallback timeout
                self._clearFallbackTimeout();
                //clear wait for timeout
                self._clearWaitForTimeout();

                var reports = "";

                var printingGroup = null;
                var printingTest = null;


                for (var r = 0; r < self._reports.length; r++) {
                    var report = self._reports[r];

                    //group
                    if (typeof report.group == "string" && report.group != printingGroup) {
                        reports += '<strong>'+report.group+'</strong>';
                        reports += "\n<br />";
                        printingGroup = report.group;
                    }


                    //test
                    if (typeof report.test == "string" && report.test != printingTest) {
                        reports += '&nbsp;'+report.test+'';
                        reports += "\n<br />";
                        printingTest = report.test;
                    }

                    if (report.success) {
                        reports += '&nbsp;&nbsp;<span style="color:#008000">&#10004; ';
                    } else {
                        reports += '&nbsp;&nbsp;<span style="color:#ff0000;">&#10006; ';
                    }
                    reports += report.message;

                    reports += "</span>\n<br />";

                }

                reports += "All tests ended!";

                //alert(reports);

                $('#pockeTest_report').remove();

                $('body').append('<div id="pockeTest_report" style="width: 600px; height: 400px; position: fixed; ' +
                    'top: 50px; left: '+ ($( document ).width()-600)/2 + 'px; ' +
                    'background-color: #ffffff; border: solid 5px #cccccc; padding: 20px; ' +
                    'font: normal 13px Tahoma, Geneva, sans-serif; z-index: 99999;">' +
                    '<div style="width: 100%; text-align: right;">' +
                    '<span class="close" style="cursor: pointer;">&#10006;</span></div>' +
                    '<div>'+reports+'</div>' +
                    '</div>');

                $('#pockeTest_report .close').click(function() {
                    $(this).parent().parent().remove();
                });

                //clear cokkies
                self._clearCookies();
            };

            self.assert = {
                _test: null,
                _user: null,
                _group: null,
                _name: null,
                done: function() {
                    //
                    setTimeout(function(){
                        self._actionDone = true;

                        if (self._queue.length > 0) {
                            do {
                                var nextAction = self._queue.shift();
                                self._queueCounter++;

                            } while (self._queue.length > 0 && (nextAction.user != self._actualUserOnPage && nextAction.user !== null && nextAction.hasOwnProperty('user'))); // && !(nextAction.user === null || typeof nextAction.user != "undefined")

                            self.action(self.assert,nextAction);
                        } else {
                            self._finish();
                        }
                    },500);
                },
                fail: function() {

                    if (self._queue.length > 0) {
                        do {
                            var nextAction = self._queue.shift();
                            self._queueCounter++;

                        } while (self._queue.length > 0 && nextAction.test != self._testName); // && !(nextAction.user === null || typeof nextAction.user != "undefined")

                        self._queueCounter--;
                        self._queue.unshift(nextAction);

                        self.action(self.assert,{
                                action:function(assert) {
                                    assert.report(false, 'Test failed');

                                    assert.done();
                                },
                                user: this._user,
                                test: this._test,
                                group: this._group,
                                name: this._name
                            }
                        );
                    } else {
                        self._finish();
                    }
                },
                ok: function() {
                    for (var ai = 0; ai < arguments.length; ai++) {
                        if (arguments[ai] !== true) {
                            return false;
                        }
                    }
                    return true;
                },
                report: function(success, reportText) {
                    var report = {
                        user: this._user,
                        group: this._group,
                        test: this._test,
                        name: this._name,
                        success: success
                    };

                    report['message'] = reportText;

                    self._reports.push(report);

                    self._cookieSaveReports();
                },
                equal: function() {
                    var returnValue = true;
                    var reportText = "";
                    for (var ai = 1; ai < arguments.length; ai++) {
                        if (arguments[ai] !== arguments[ai-1]) {
                            returnValue = false;
                            break;
                        }
                    }

                    if (returnValue) {
                        reportText = "variables are equal";
                    } else {
                        reportText = "provided variables are not equal";
                    }

                    self.assert.report(returnValue, reportText);

                    return returnValue;
                },
                set: function(name, value) {
                    self._values[name] = value;

                    self._cookieSaveValues();
                },
                get: function(name) {
                    if (self._values.hasOwnProperty(name)) {
                        return self._values[name];
                    } else {
                        return null;
                    }

                },
                setUser: function(user) {
                    if (typeof user != "string") return false;

                    self._actualUserOnPage = user;
                },
                getUser: function() {
                    return self._actualUserOnPage;
                },
                waitFor: function(description, condition) {
                    self._waitForTimeout = null;

                    //check for global fallbacks
                    for (var gf = 0; gf < self._globalFailWhen.length; gf++) {
                        if (self._globalFailWhen[gf].condition() === true) {
                            self.assert.fail();
                            return;
                        }
                    }

                    //check for action fallbacks
                    for (var af = 0; af < self._actionFailWhen.length; af++) {
                        if (self._actionFailWhen[af].condition() === true) {
                            self.assert.fail();
                            return;
                        }
                    }

                    if (typeof condition == "function") {
                        console.debug('waitFor');
                        if (condition() === true) {
                            console.debug('waitFor condition == true');
                            self.assert.done();
                        } else {
                            self._waitForTimeout = setTimeout(function() {
                                self.assert.waitFor(description, condition);
                            },1000);
                        }

                    } else {
                        //todo error
                        console.debug("Error waitFor", description, condition);
                    }

                },
                failWhen: function(description, condition) {
                    self._actionFailWhen.push({
                        description: description,
                        condition: condition
                    });
                },
                globalFailWhen: function(description, condition) {
                    self._actionFailWhen.push({
                        description: description,
                        condition: condition
                    });
                },
                reload: function() {

                    self._skipActionsCounter++;
                    self._saveCookieState();

                    setTimeout(function() {
                        window.location.reload();
                    },200);
                },
                navigate: function(url) {
                    self._skipActionsCounter++;
                    self._queueCounter++;
                    self._saveCookieState();

                    setTimeout(function() {
                        window.location.href = url;
                    },200);

                },
                wait: function(timeout) {
                    if (typeof timeout != "number") timeout = 1000;

                    setTimeout(function() {
                        self.assert.done();
                    },timeout);
                }
            };

            self.test = function(name) {

                self._testName = name;

                self.allUsers();

                if (self._actionDone) {

                    //reset to new test if hash is present
                    if (window.location.hash) {
                        if (window.location.hash.substr(1) == 'pocketest-new-test') {
                            self._clearCookies();

                            window.location.hash = '';
                        }
                    }
                    //check for cookies
                    self._cookieLoadReports();
                    self._loadCookieState();

                    if (self._reports.length > 0) {
                        self.action(self.assert, self._formatAction((function(self) {
                            return function(assert) {

                                self.assert.report(true, 'Test started');

                                assert.done();
                            }
                        })(self)));
                    } else if (self._options.startOn.type == 'confirm') {
                        self._actionDone = false;

                        if (self._queueCounter > 0) {
                            self.action(self.assert, self._formatAction((function(self) {
                                return function(assert) {

                                    self.assert.report(true, 'Test started');

                                    assert.done();
                                }
                            })(self)));
                        } else {
                            setTimeout(function() {

                                if (confirm(self._options.startOn.text)) {
                                    self.action(self.assert, self._formatAction((function(self) {
                                        return function(assert) {

                                            self.assert.report(true, 'Test started');

                                            assert.done();
                                        }
                                    })(self)));
                                }
                            },self._options.startOn.timeout);
                        }


                    } else if (self._options.startOn.type == 'auto') {
                        self._actionDone = false;

                        setTimeout(function() {
                            self.action(self.assert, self._formatAction((function(self) {
                                return function(assert) {

                                    self.assert.report(true, 'Test started');

                                    assert.done();
                                }
                            })(self)));

                        },self._options.startOn.timeout);

                    }


                } else {

                    self._queue.push(self._formatAction(function(assert) {
                        assert.report(true, 'Test started');

                        assert.done();
                    }));

                }

                return self;
            };

            self.then = (function(assert) {
                return function(name, action) {

                    if (typeof action == 'undefined' && typeof name == 'function') {
                        action = name;
                        name = '';
                    } else if (typeof action == 'undefined' && typeof name == 'string') {
                        if (self._definedActions.hasOwnProperty(name)) {
                            action = self._definedActions[name];
                            name = '';
                        }
                    }

                    //reset action fallbacks
                    self._actionFailWhen = [];


                    self._queue.push(self._formatAction(action, name));

                    return self;

                }
            })(self.assert);

            self._formatAction = function(action, name) {
                if (typeof action != "function") {
                    console.error("Action is not a function");
                }

                var queueAction = {};
                queueAction['action']  = action;

                if (self._actualUser !== null) {
                    queueAction['user'] = self._actualUser;
                }
                queueAction['test'] = self._testName;
                if (self._actualGroup !== null) {
                    queueAction['group'] = self._actualGroup;
                }
                if (typeof name == 'string') {
                    queueAction['name'] = name;
                }

                return queueAction;
            };

            self._clearFallbackTimeout = function() {
                if (self._fallBackTimeout !== null) clearTimeout(self._fallBackTimeout);
            };

            self._clearWaitForTimeout = function() {
                if (self._waitForTimeout !== null) clearTimeout(self._waitForTimeout);
            };

            self._resetFallbackTimeout = function(assert) {
                self._clearFallbackTimeout();
                self._fallBackTimeout = setTimeout(function() {
                    assert.fail();
                }, self._fallBackTime);

            };

            self.action = function(assert, action) {
                //start an action
                self._actionDone = false;

                self._resetFallbackTimeout(assert);

                //todo skip
                self._skipActionsCounter++;
                self._saveCookieState();

                if (self._skipActionsCounter < self._skipActions) {
                    self.assert.done();
                    return self;
                }

                //console log action start
                console.debug("Starting action: "+assert._name);

                if (typeof action.action == "function") {
                    assert._test = action.test;
                    assert._user = action.user;
                    assert._group = action.group;
                    assert._name = action.name;

                    action.action(assert);
                } else {
                    console.debug("Trying to run a non-function");
                }

                return self;
            };

            self.endTest = function() {

            };

            self.group = function(group) {
                self._actualGroup = group;
            };

            self.endGroup = function() {
                self._actualGroup = null;
            };

            self.user = function(user) {
                self._actualUser = user;

                return self;
            };

            self.allUsers = function() {
                self._actualUser = null;

                return self;
            };

            self._loadCookieState = function() {
                var user = self._readCookie('pockeTest_user');

                if (user) {
                    self._user = user;

                    self._actualUser = self._readCookie('pockeTest_actualUser');
                    self._actualUserOnPage = self._readCookie('pockeTest_actualUserOnPage');
                    self._queueCounter = parseInt(self._readCookie('pockeTest_queueCounter'));
                    self._skipActions = parseInt(self._readCookie('pockeTest_skipActions'));
                    try {
                        self._values = JSON.parse(self._readCookie('pockeTest_values'));
                    } catch (e) {
                        console.error("Error parsing values from cookies.");
                    }

                }

                self._clearCookies();
            };

            self._saveCookieState = function() {
                self._createCookie('pockeTest_user', self._user);
                self._createCookie('pockeTest_actualUser', self._actualUser);
                self._createCookie('pockeTest_actualUserOnPage', self._actualUserOnPage);
                self._createCookie('pockeTest_queueCounter', self._queueCounter);
                self._createCookie('pockeTest_skipActions', self._skipActionsCounter);

                self._cookieSaveValues();
            };

            self._cookieSaveValues = function() {
                self._createCookie('pockeTest_values', JSON.stringify(self._values));
            };

            self._cookieSaveReports = function() {
                self._createCookie('pockeTest_reports', JSON.stringify(self._reports));
            };

            self._cookieLoadReports = function() {

                var cookieReports = self._readCookie('pockeTest_reports');
                if (cookieReports) {

                    try {
                        var cookieReportsParsed = JSON.parse(cookieReports);


                    } catch (e) {
                        console.error("Error parsing reports. "+e);
                    }

                    if (typeof cookieReportsParsed == 'object') {
                        for (var i = cookieReportsParsed.length-1; i >= 0; i--) {
                            self._reports.unshift(cookieReportsParsed[i]);
                        }
                    }

                }

            };

            self._clearCookies = function() {
                self._eraseCookie('pockeTest_user');
                self._eraseCookie('pockeTest_actualUser');
                self._eraseCookie('pockeTest_actualUserOnPage');
                self._eraseCookie('pockeTest_queueCounter');
                self._eraseCookie('pockeTest_skipActions');
                self._eraseCookie('pockeTest_reports');
                self._eraseCookie('pockeTest_values');
            };

            self._createCookie = function(name,value) {

                var date = new Date();
                date.setTime(date.getTime()+(7*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();

                document.cookie = name+"="+value+expires+"; path=/";
            };

            self._readCookie = function(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            };

            self._eraseCookie = function(name) {
                self._createCookie(name,"",-1);
            };


            self.define = {
                action: function(name, action) {
                    //todo validation
                    self._definedActions[name] = action;
                },
                waitFor: function(name, condition) {
                    //todo validation
                    self._definedWaitFors[name] = condition;
                },
                failWhen: function(name, condition) {
                    //todo validation
                    self._definedFailWhens[name] = condition;
                }
            };

            return self;
        }
    });

})( jQuery );