window.onunload = function () {};
window.onpageshow = function (event) { if (event.persisted) window.location.reload() }; // for safari

var ua = navigator.userAgent.toLowerCase();
if((ua.indexOf('iphone') != -1) || (ua.indexOf('android') != -1) && (ua.indexOf('mobile') != -1) && (ua.indexOf('sc-01c') == -1)) {
    document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">');
} else if (ua.indexOf('ipad') != -1) {
    document.write('<meta name="viewport" content="width=1100, user-scalable=no">');
}