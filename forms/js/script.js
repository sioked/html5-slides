/* Author: Ed Siok
A simple forms example
*/

$(document).ready(function() {

    if (document.getElementById("edit_link").contentEditable != null) {
        $("#edit_link").hide();
        var value;
        $('[contenteditable=true]').each(function() {
            if (value = window.localStorage.getItem($(this).attr('id')))
            {
                $(this).text(value);
            }
        });

        $('[contenteditable=true]').blur(function() {
            window.localStorage.setItem($(this).attr('id'), $(this).text());
            window.localStorage.setItem('timestamp', (new Date()).getTime());
            updateLog(true);
        });

        var updateLog = function(isNewSave) {
            var delta = 0;
            var log = document.querySelector('#log');

            if (window.localStorage.getItem('timestamp')) {
                log.setAttribute('style', 'display: block;');
                delta = ((new Date()).getTime() - (new Date()).setTime(window.localStorage.getItem('timestamp'))) / 1000;
                if (isNewSave) {
                    log.textContent = 'Saved. Content will be available after browser refresh/reopen.';
                    setTimeout(function() {
                        log.textContent = '';
                    },
                    3000);
                } else {
                    log.textContent = 'last saved: ' + delta + 's ago';
                }
            }
        }

        updateLog(false);
    }


});