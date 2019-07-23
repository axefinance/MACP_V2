var appConfig = {
    'serverUrl': "http://192.168.1.204:92"
}

var initiateNotification = function (){
        if ($.signalR) {

        }
        var user = JSON.parse(sessionStorage.getItem('userData'));

        var userId = user.user_id;


        $.connection.hub.logging = true
        $.connection.hub.qs = { 'userId': userId }
        $.connection.hub.url = appConfig.serverUrl + "/signalr";
        var chatHub = $.connection.chatHub

    chatHub.client.broadcastMessage = function (name, message) {
                gNotificationCount = message;

        if(message!="0")
            document.getElementById(gScreenType+"NotificationsCount").innerHTML="<span class='badge color-red'>"+gNotificationCount+"</span>";
    }
    $.connection.hub.start({ withCredentials: false, jsonp: true, transport: "longPolling" })
            .done(function () {
                console.log("Connected successfully to SignalR");
            })
            .fail(function (err) {
                console.log("Unable to connect to SignalR "+err);
            })
}

var initiateSignalR = function(contacts, messageContent){
    if ($.signalR) {

    }
    var user = JSON.parse(sessionStorage.getItem('userData'));

    var userId = user.user_id;


    $.connection.hub.logging = true
    $.connection.hub.qs = { 'userId': userId }
    $.connection.hub.url = appConfig.serverUrl + "/signalr";
    var chatHub = $.connection.chatHub

chatHub.client.broadcastMessage = function (name, message) {
            gNotificationCount = message;

    if(message!="0")
        document.getElementById(gScreenType+"NotificationsCount").innerHTML="<span class='badge color-red'>"+gNotificationCount+"</span>";
}
$.connection.hub.start({ withCredentials: false, jsonp: true, transport: "longPolling" })
        .done(function () {
            console.log("Connected successfully to SignalR");
            chatHub.server.send(contacts, messageContent);

        })
        .fail(function (err) {
            console.log("Unable to connect to SignalR "+err);
        })

}
