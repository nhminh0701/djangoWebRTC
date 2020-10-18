var protocolScheme = window.location.protocol === 'http:' ? 'ws' : 'wss';
var connection = new WebSocket(`${protocolScheme}://${window.location.host}/ws/videostream/${ROOM_ID}/`)
var name = "";

var loginInput = document.querySelector('#loginInput');
var loginBtn = document.querySelector('#loginBtn');

var otherUsernameInput = document.querySelector('#otherUsernameInput');
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn');
var msgInput = document.querySelector("#msgInput");
var sendMsgBtn = document.querySelector("#sendMsgBtn");
var connectedUser, myConnection, dataChannel;



var handleDataChannelMessageReceived = function (event) {
    console.log("Got message: ", event.data);
}
var handleDataChannelError = function (error) {
    console.log("Error: ", error);
}
var handleChannelCallback = function (event) {
    dataChannel = event.channel;
    dataChannel.onmessage = handleDataChannelMessageReceived;
    dataChannel.onerror = handleDataChannelError;
}



// when a user clicks the login button
loginBtn.addEventListener('click', function(event) {
    name = loginInput.nodeValue;

    if (name.length > 0) {
        send({
            type: 'login',
            name,
        })
    }
})

// handle messages from the server
connection.onmessage = function (message) {
    var data = JSON.parse(message.data);
    console.log('Got message', data);

    switch (data.type) {
        case "login":
            onLogin(data.success);
            break;
        case "offer":
            onOffer(data.offer, data.name);
            break;
        case "answer":
            onAnswer(data.answer);
            break;
        case "candidate":
            onCandidate(data.candidate);
        default:
            break;
    }
};

// When a user logs in
function onLogin(success) {
    if (success === false) {
        alert("Oops...try a different username");
    } else {
        // Creating our RTCPeerConnection object

        var configuration = {
            "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
        };

        myConnection = new webkitRTCPeerConnection(configuration);
        console.log("RTCPeerConnection object was create");
        console.log(myConnection);
        myConnection.ondatachannel = handleChannelCallback;

        // Setup ice handling
        // When the browser finds an ice candidate we send it to another peer
        myConnection.onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: 'candidate',
                    candidate: event.candidate
                });
            }
        };

        openDataChannel();
    }
};

connection.onopen = function () {
    console.log("Conncted");
};

connection.onerror = function (err) {
    console.log("Got error", err);
}

// Alias for sending messages in JSON format
function send(message) {
    if (connectedUser) {
        message.name = connectedUser;
    }

    connection.send(JSON.stringify(message))
}

connectToOtherUsernameBtn.addEventListener("click", function () {
    var otherUsername = otherUsernameInput.value;
    connectedUser = otherUsername;

    if (otherUsername.length > 0) {
        // Make an offer
        myConnection.createOffer(function (offer) {
            console.log();
            send({
                type: "offer",
                offer,
            });

            myConnection.setLocalDescription(offer);
        }, function (error) {
            alert("An error has occurred.");
        });
    }
});

// WHen somebody wants to call us
function onOffer(offer, name) {
    connectedUser = name;
    myConnection.setRemoteDescription(new RTCSessionDescription(offer));

    myConnection.createAnswer(function (answer) {
        myConnection.setLocalDescription(answer);

        send({
            type: "answer",
            answer,
        });


    }, function (error) {
        alert("oops...error");
    });
}

// when another user answers to our offer
function onAnswer(answer) {
    myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// When we got ice candidate from another user
function onCandidate(candidate) {
    myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// Create data channel
function openDataChannel() {
    var dataChannelOptions = {
        reliable: true,
    }

    dataChannel = myConnection.createDataChannel("myDataChannel", dataChannelOptions);

    dataChannel.onerror = handleDataChannelError;

    dataChannel.onmessage = handleDataChannelMessageReceived;
}

// When a user clicks the send message button
sendMsgBtn.addEventListener("click", function(event) {
    console.log("send message");
    var val = msgInput.value;
    dataChannel.send(val);
})