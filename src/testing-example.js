/**
 * Created by Peter Baus on 11/3/2015.
 */


$(document).ready(function(){

    start();

});





function start() {

    var pockeTest = $.pockeTest();

    pockeTest.define.action('wait 2 seconds', function (assert) {
        assert.wait(2000);
    });

    pockeTest.group('Testing of form');
    pockeTest.test('Test if we could send the form')
        .then(function (assert) {
            $('#website').val('http://www.example.com');

            assert.done();
        })
        .then('wait 2 seconds')
        .then(function (assert) {
            assert.navigate('testing-example2.html');

        })
        .then(function (assert) {
            $('#message').html('Some example text');
            
            assert.wait(1500);

        })
        .then(function (assert) {
            $('#submitbutton').click();

            assert.done();
        });

    //
    // pockeTest.define.action('set url', function(assert) {
    //     assert.setUser($('#cm-user-actions > span:eq(1)').text().trim());
    //
    //     assert.done();
    // });
    // pockeTest.define.action('wait for chat peer-to-peer connection',function(assert){
    //     assert.waitFor("peer-to-peer connection", function() {
    //         if (window.app._peer.connections.hasOwnProperty(assert.get('contactPeerId'))) {
    //
    //             for (var i = 0; i < window.app._peer.connections[assert.get('contactPeerId')].length; i++) {
    //                 var connection = window.app._peer.connections[assert.get('contactPeerId')][i];
    //
    //                 if (connection.label == 'chat' && connection.open) {
    //                     return true;
    //                 }
    //             }
    //         }
    //         return false;
    //     });
    //
    // });
    // pockeTest.define.action('other user go offline', function(assert) {
    //     console.debug('other user go offline');
    //     assert.waitFor('other user go offline', function() {
    //         var ret = false;
    //         $('#cm-contact-list-contacts > li').each(function() {
    //             if ($(this).find('a').attr('data-userid') == assert.get('contactUserId')) {
    //
    //                 if (!$(this).hasClass('online')) {
    //                     ret = true;
    //
    //                 }
    //
    //             }
    //         });
    //
    //         return ret;
    //     });
    // });
    // pockeTest.define.action('other user go online', function(assert) {
    //     console.debug('other user go online');
    //     assert.waitFor('other user go online', function() {
    //         var ret = false;
    //         $('#cm-contact-list-contacts > li').each(function() {
    //             if ($(this).find('a').attr('data-userid') == assert.get('contactUserId')) {
    //
    //                 if ($(this).hasClass('online')) {
    //                     ret = true;
    //                 }
    //
    //             }
    //         });
    //
    //         return ret;
    //     });
    // });
    //
    // pockeTest.group("Chat");
    // pockeTest.test("Chat message").then('set user name').user('test').then(function(assert){
    //
    //     assert.waitFor("incoming message", function(){
    //         if ($(".cm-chat-container").find('div.message').length > 0) {
    //             return true;
    //         }
    //     });
    //
    // }).user('test1').then(function(assert){
    //
    //     assert.equal(1,1);
    //
    //     $('#cm-contact-list-contacts > li').each(function() {
    //         if ($(this).find('span.username:first').text() == 'test') {
    //             $(this).find('a').click();
    //             assert.set('contactUserId',$(this).find('a').attr('data-userid'));
    //             assert.set('contactPeerId',$(this).find('a').attr('data-peerid'));
    //
    //             assert.done();
    //             return false;
    //         }
    //     });
    //
    // }).then('wait for peer-to-peer connection',function(assert){
    //
    //     $('input.message-input').val("Sample text");
    //
    //     assert.waitFor("peer-to-peer connection", function() {
    //         if (window.app._peer.connections.hasOwnProperty(assert.get('contactPeerId'))) {
    //
    //             for (var i = 0; i < window.app._peer.connections[assert.get('contactPeerId')].length; i++) {
    //                 var connection = window.app._peer.connections[assert.get('contactPeerId')][i];
    //
    //                 if (connection.label == 'chat' && connection.open) {
    //                     return true;
    //                 }
    //             }
    //         }
    //         return false;
    //     });
    //
    // }).then('post sample text',function(assert){
    //
    //     var sendButton = $('button.message-send[data-userid=' + assert.get('contactUserId') + ']');
    //     if (sendButton) {
    //         $('input.message-input').val("Sample text");
    //         sendButton.click();
    //     }
    //     assert.done();
    //
    // }).user('test').then('find user with incoming message',function(assert) {
    //
    //     $('#cm-contact-list-contacts > li').each(function() {
    //
    //         if ($(this).find('span.uc').text() != '') {
    //             $(this).find('a').click();
    //             assert.set('contactUserId',$(this).find('a').attr('data-userid'));
    //             assert.set('contactPeerId',$(this).find('a').attr('data-peerid'));
    //
    //             assert.done();
    //             return false;
    //         }
    //     });
    //
    //
    // }).then('wait for message to appear on screen',function(assert) {
    //
    //     assert.waitFor("incoming message", function(){
    //         if ($(".cm-chat-container").find('div.message').length > 0) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    //
    // }).then('post reply text',function(assert) {
    //
    //     var sendButton = $('button.message-send[data-userid=' + assert.get('contactUserId') + ']');
    //     if (sendButton) {
    //         $('input.message-input').val("Reply text");
    //         sendButton.click();
    //     }
    //     assert.done();
    //
    // }).user('test1').then('wait for reply message',function(assert) {
    //
    //     assert.failWhen("there is more than one chat container", function() {
    //         if (false) {
    //             return true;
    //         }
    //     });
    //
    //     assert.waitFor("reply message", function(){
    //         var messageArrived = false;
    //         $(".cm-chat-container").find('div.message').each(function() {
    //             $(this).find('.bubble').each(function() {
    //                 if ($(this).text().trim() == 'Reply text') {
    //                     messageArrived = true;
    //                 }
    //             });
    //
    //         });
    //
    //         return messageArrived;
    //     });
    //
    // }).allUsers().then(function(assert) {
    //
    //     assert.done();
    //
    // });
    //
    // pockeTest.test("Chat message after refresh").then('set user name').user('test').then(function(assert){
    //
    //     assert.waitFor("incoming message", function(){
    //         if ($(".cm-chat-container").find('div.message').length > 0) {
    //             return true;
    //         }
    //     });
    //
    // }).user('test1').then(function(assert){
    //
    //     assert.equal(1,1);
    //
    //     $('#cm-contact-list-contacts > li').each(function() {
    //         if ($(this).find('span.username:first').text() == 'test') {
    //             $(this).find('a').click();
    //             assert.set('contactUserId',$(this).find('a').attr('data-userid'));
    //             assert.set('contactPeerId',$(this).find('a').attr('data-peerid'));
    //
    //             assert.done();
    //             return false;
    //         }
    //     });
    //
    // }).then('wait for peer-to-peer connection',function(assert){
    //
    //     $('input.message-input').val("Sample text 2");
    //
    //     assert.waitFor("peer-to-peer connection", function() {
    //         if (window.app._peer.connections.hasOwnProperty(assert.get('contactPeerId'))) {
    //
    //             for (var i = 0; i < window.app._peer.connections[assert.get('contactPeerId')].length; i++) {
    //                 var connection = window.app._peer.connections[assert.get('contactPeerId')][i];
    //
    //                 if (connection.label == 'chat' && connection.open) {
    //                     return true;
    //                 }
    //             }
    //         }
    //         return false;
    //     });
    //
    // }).then('post sample text',function(assert){
    //
    //     var sendButton = $('button.message-send[data-userid=' + assert.get('contactUserId') + ']');
    //     if (sendButton) {
    //         $('input.message-input').val("Sample text 2");
    //         sendButton.click();
    //     }
    //     assert.done();
    //
    // }).user('test').then('find user with incoming message',function(assert) {
    //
    //     $('#cm-contact-list-contacts > li').each(function() {
    //
    //         if ($(this).find('span.username:first').text() == 'test1') {
    //             $(this).find('a').click();
    //             assert.set('contactUserId',$(this).find('a').attr('data-userid'));
    //             assert.set('contactPeerId',$(this).find('a').attr('data-peerid'));
    //
    //             assert.done();
    //             return false;
    //         }
    //     });
    //
    // }).then('wait for message to appear on screen',function(assert) {
    //
    //     assert.waitFor("incoming message", function(){
    //         var messageArrived = false;
    //         $(".cm-chat-container").find('div.message').each(function() {
    //             $(this).find('.bubble').each(function() {
    //                 if ($(this).text().trim() == 'Sample text 2') {
    //                     messageArrived = true;
    //                 }
    //             });
    //
    //         });
    //
    //         return messageArrived;
    //     });
    //
    // }).then('post reply text',function(assert) {
    //
    //     var sendButton = $('button.message-send[data-userid=' + assert.get('contactUserId') + ']');
    //     if (sendButton) {
    //         $('input.message-input').val("Reply text 2");
    //         sendButton.click();
    //     }
    //     assert.done();
    //
    // }).user('test1').then('wait for reply message',function(assert) {
    //
    //     assert.failWhen("there is more than one chat container", function() {
    //         if (false) {
    //             return true;
    //         }
    //     });
    //
    //     assert.waitFor("reply message", function(){
    //         var messageArrived = false;
    //         $(".cm-chat-container").find('div.message').each(function() {
    //             $(this).find('.bubble').each(function() {
    //                 if ($(this).text().trim() == 'Reply text 2') {
    //                     messageArrived = true;
    //                 }
    //             });
    //
    //         });
    //
    //         return messageArrived;
    //     });
    //
    // }).then(function(assert) {
    //
    //     assert.reload();
    //
    // }).user('test').then('other user go offline').then('other user go online').then('wait for sending', function(assert) {
    //
    //     assert.waitFor('awailable button', function() {
    //         if ($('button.message-send[data-userid=' + assert.get('contactUserId') + ']').hasClass('online')) {
    //             return true;
    //         }
    //     });
    //
    // }).then('write message', function(assert) {
    //
    //     var sendButton = $('button.message-send[data-userid=' + assert.get('contactUserId') + ']');
    //     if (sendButton) {
    //         $('input.message-input').val("Other text");
    //
    //     }
    //
    //     assert.waitFor('sending of message', function() {
    //         sendButton.click();
    //         if ($('input.message-input').val() == '') {
    //             return true;
    //         }
    //     });
    //
    // }).user('test1').then('wait for reply message',function(assert) {
    //
    //     assert.failWhen("there is more than one chat container", function() {
    //         if (false) {
    //             return true;
    //         }
    //     });
    //
    //     assert.waitFor("other message", function(){
    //         $('#cm-contact-list-contacts > li').each(function() {
    //
    //             if ($(this).find('span.username:first').text() == 'test') {
    //                 $(this).find('a').click();
    //
    //                 return false;
    //             }
    //         });
    //
    //         var messageArrived = false;
    //         $(".cm-chat-container").find('div.message').each(function() {
    //             $(this).find('.bubble').each(function() {
    //                 if ($(this).text().trim() == 'Other text') {
    //                     messageArrived = true;
    //                 }
    //             });
    //
    //         });
    //
    //         return messageArrived;
    //     });
    //
    // }).then('wait for sending of final message', function(assert) {
    //     var sendButton = $('button.message-send[data-userid=' + assert.get('contactUserId') + ']');
    //     if (sendButton) {
    //         $('input.message-input').val("Final message");
    //     }
    //
    //     assert.waitFor('sending of message', function() {
    //         console.debug("CHECK",assert.get('contactUserId'));
    //         sendButton.click();
    //         if ($('input.message-input').val() == '') {
    //             return true;
    //         }
    //     });
    //
    // }).user('test').then('wait for final message', function(assert) {
    //
    //     assert.waitFor("final message receiving", function(){
    //         var messageArrived = false;
    //         $(".cm-chat-container").find('div.message').each(function() {
    //             $(this).find('.bubble').each(function() {
    //                 if ($(this).text().trim() == 'Final message') {
    //                     messageArrived = true;
    //                 }
    //             });
    //
    //         });
    //
    //         return messageArrived;
    //     });
    //
    // });
    //
    //
    // pockeTest.group('Notifications');
    // pockeTest.test("Send notification").user('test').then('other user go offline').user('test1').then(function(assert) {
    //
    //     assert.reload();
    //
    // }).user('test').then('open notification popup', function(assert) {
    //
    //     $('a[data-action="ui.notification.popup"]').each(function() {
    //         if ($(this).attr('data-userid') == assert.get('contactUserId')) {
    //             $(this).click();
    //
    //             return false;
    //         }
    //     });
    //
    //     assert.done();
    //
    // }).then('wait for dialog', function(assert) {
    //     assert.waitFor('dialog to show', function() {
    //         if ($('div#notify-user')) {
    //             return true;
    //         }
    //     });
    // }).then('send notification', function(assert) {
    //     $('#notify-user').find('#notification-5:first').click();
    //     $('#notify-user').find('#customMessageCollapse:first').find('textarea:first').html('This is custom testing notification.');
    //     $('#notify-user').find('button[data-action="notification.send"]').click();
    //
    //     assert.done();
    // }).then('wait for confirm modal', function(assert) {
    //
    //     assert.waitFor('confirm modal', function() {
    //         if ($('#simple-modal').length) {
    //             return true;
    //         }
    //     });
    //
    // }).then('close modal', function(assert) {
    //
    //     $('#simple-modal').find('button[data-action="ui.modal.close"]:first').click();
    //
    //     assert.done();
    //
    // }).user('test1').then('click on other user',function(assert) {
    //
    //     $('#cm-contact-list-contacts > li').each(function() {
    //
    //         if ($(this).find('span.username:first').text() == 'test') {
    //             $(this).find('a').click();
    //
    //             assert.done();
    //             return false;
    //         }
    //     });
    //
    // }).then('check notification status', function(assert) {
    //
    //     assert.waitFor('1 notification', function() {
    //         if ($('.navbar-contactlist:first li.notificationManager:first .badge.notifications:first').text() == '1') {
    //             console.debug($('.navbar-contactlist:first li.notificationManager:first .badge.notifications:first').text());
    //             return true;
    //         }
    //     });
    //
    // }).then('open notification', function(assert) {
    //
    //     $('.navbar-contactlist:first li.notificationManager:first a:first').click();
    //
    //     assert.done();
    //
    // }).then('read notification', function(assert) {
    //
    //     assert.waitFor('notification exists', function() {
    //         var ret = false;
    //         $('#notification-area #notificationList li').each(function() {
    //             if ($(this).find('.notification-message:first').text() == 'This is custom testing notification.' && $(this).find('.notification-sender:first').text() == 'test') {
    //                 ret = true;
    //             }
    //         });
    //         return ret;
    //     });
    //
    // }).then('delete notification', function(assert) {
    //
    //     $('#notification-area #notificationList li').each(function() {
    //         if ($(this).find('.notification-message:first').text() == 'This is custom testing notification.' && $(this).find('.notification-sender:first').text() == 'test') {
    //             $(this).find('button[data-action="notification.delete"]').click();
    //         }
    //     });
    //
    //     assert.done();
    //
    // }).then('wait for confirm modal', function(assert) {
    //
    //     assert.waitFor('confirm modal', function() {
    //         if ($('#simple-modal')) {
    //             return true;
    //         }
    //     });
    //
    // }).then('close modal', function(assert) {
    //
    //     $('#simple-modal').find('button[data-action="ui.modal.close"]:first').click();
    //
    //     assert.done();
    //
    // }).then('check if notification is deleted', function(assert) {
    //
    //     assert.waitFor('notification is deleted', function() {
    //         var ret = true;
    //         $('#notification-area #notificationList li').each(function() {
    //             if ($(this).find('.notification-message:first').text() == 'This is custom testing notification.' && $(this).find('.notification-sender:first').text() == 'test') {
    //                 ret = false;
    //             }
    //         });
    //         return ret;
    //     });
    //
    // }).user('test').then('other user go online').then('wait', function(assert) {
    //
    //     assert.wait(12000);
    //
    // }).allUsers().then(function(assert) {
    //
    //     assert.done();
    //
    // });
    //
    //
    //
    // pockeTest.group('Calling');
    // pockeTest.test('Init call').then('set user name').user('test').then('click on contact',function(assert){
    //
    //     $('#cm-contact-list-contacts > li').each(function() {
    //         if ($(this).find('span.username:first').text() == 'test1') {
    //             $(this).find('a').click();
    //             assert.set('contactUserId',$(this).find('a').attr('data-userid'));
    //             assert.set('contactPeerId',$(this).find('a').attr('data-peerid'));
    //
    //             assert.done();
    //             return false;
    //         }
    //     });
    //
    // }).then('wait for chat peer-to-peer connection').then('init call',function(assert) {
    //
    //     $("section[data-userid='"+assert.get('contactUserId')+"'] .js-action[data-action='call.init']:first").click();
    //
    //     assert.done();
    // }).user('test1').then('detect modal',function(assert) {
    //     assert.waitFor('incoming call', function() {
    //         if ($("body #call-modal").length > 0) {
    //             return true;
    //         }
    //     });
    // }).then('accept call',function(assert) {
    //     $("body #call-modal .js-action[data-action='call.accept']:first").click();
    //
    //     assert.done();
    // }).user('test').then(function(assert) {
    //     assert.waitFor('accepting call', function() {
    //         if ($("body #call-modal").length == 0) {
    //             return true;
    //         }
    //     });
    // }).allUsers().then(function(assert) {
    //     assert.waitFor('open video window', function() {
    //         if ($('.cm-av-frame').hasClass('open')) {
    //             return true;
    //         }
    //     })
    // });


}
