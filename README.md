# Pocketest #
## javascript simulated end-to-end testing

Pocketest is javascript engine (jQuery plugin) for creating simulated end users for end-to-end testing of web applications.
You could specify successful actions and their callback as well as fallbacks of unwanted events.
Pocketest allowes you to create infinite number of virtual users and simulate interactions between them asynchronously.

## How to use

First, you need to write your test with steps of your test.


## Create your test

Tests syntax.

pockeTest.group([group_name]);
pockeTest.test([test_name]).then([action]).then([action]).then([action])... ;
pockeTest.test([test_name_2]).then([action]).then([action]).then([action])... ;

pockeTest.group([group_name_2]);
pockeTest.test([test_name_3]).then([action]).then([action]).then([action])... ;



