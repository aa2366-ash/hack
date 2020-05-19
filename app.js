var gapi;
var arr = [];

//console.log("qwerty")
// Client ID and API key from the Developer Console
var CLIENT_ID = '231583243629-bkf61hl7jeg5vmlv2l94oqb5n5025ilm.apps.googleusercontent.com';
var API_KEY = 'AIzaSyABS1a6EEnLTIo8_EC4l916RN0YSjt7rvA';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://mail.google.com/';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var navarea = document.getElementById("first");
var tablehide = document.getElementById("tablebody")
var searchtable = document.getElementById("search")
searchtable.addEventListener("Submit", sendstring)
var sendmail = document.getElementById("recipient-send")
sendmail.addEventListener("click", callsend)
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        navarea.style.display = 'block';
        tablehide.style.display = 'block';
        list_id();

    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        signoutButton.style.display = 'none';
        navarea.style.display = 'none';
        tablehide.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    signoutButton.style.display = 'none';
    navarea.style.display = 'none';
    tablehide.style.display = 'none';

}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */

function callsend() {
    var message = document.getElementById("message-text").value
    var toadd = document.getElementById("recipient-name").value
    var sub = document.getElementById("recipient-subject").value
    var header_obj = {}
    header_obj['To'] = toadd
    header_obj['Subject'] = sub
    sendMessage(header_obj, message)
}

function sendMessage(headers_obj, message) {
    var email = '';

    for (var header in headers_obj)
        email += header += ": " + headers_obj[header] + "\r\n";
    email += "\r\n" + message;
    var bas = window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')

    var request = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': bas
        }
    });
    request.execute(function () {
        $("#alertmodel").modal('toggle');
        alert("Message sent successfully")
    });
}

function appendPre(a, b, c, d) {
    c = new Date(c);
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    c = c.getDate() + "\t " + months[c.getMonth()] + "\t" + c.getFullYear();
    var pre = document.getElementById('tablearea');
    //console.log(a,b,c)
    let temp = document.createElement('tr')
    let temp1 = document.createElement('td')
    temp1.innerText = a;
    let temp2 = document.createElement('td')
    temp2.innerText = b;
    temp.onclick = function () {
        modal123(d);
    }
    let temp3 = document.createElement('td')
    temp3.innerText = c;
    temp.appendChild(temp1)
    temp.appendChild(temp2)
    temp.appendChild(temp3)
    pre.appendChild(temp)
 
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
function inbox() {
    var pre = document.getElementById('tablearea');
    pre.innerHTML = " ";
    list_id();
}

function list_id() {
    return gapi.client.gmail.users.messages.list({
        "userId": 'me',
        "includeSpamTrash": false,
        "maxResults": 50,
        "labelIds": "INBOX",
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            for (let i = 0; i < response.result.messages.length; i++) {
                arr.push(response.result.messages[i].id);
            }
            for (let j = 0; j < arr.length - 1; j++) {
                getMail(arr[j]);
            }
        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" });
});

function sendstring() {
    event.preventDefault()
    let inputstr = document.getElementById("searchip").value;
    console.log(inputstr);
    var pre = document.getElementById('tablearea');
    pre.innerHTML = ""
    list_by_search(inputstr)

}

function list_by_search(a) {
    return gapi.client.gmail.users.messages.list({
        "userId": "me",
        "includeSpamTrash": false,
        "maxResults": 20,
        "labelIds": "INBOX",
        "q": a
    })
        .then(function (response) {
            console.log(response.result.messages)
            let arr1 = []
            // Handle the results here (response.result has the parsed body).
            for (let i = 0; i < response.result.messages.length; i++) {
                arr1.push(response.result.messages[i].id);
            }
            for (let j = 0; j < arr1.length; j++) {
                getMail(arr1[j]);
            }
        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" });
});


function getMail(a) {
    return gapi.client.gmail.users.messages.get({
        "userId": "me",
        "id": a,
        "format": "full"
    })
        .then(function (response) {
            let date1, from, subject;
            // Handle the results here (response.result has the parsed body).
            //console.log(response.result)
            //appendPre(response.result.payload.headers,response.result.snippet);
            //console.log(Base64.decode(response.result.payload.parts[1].body.data));
            //document.getElementById("result").innerHTML
            let modal2 = Base64.decode(response.result.payload.parts[1].body.data);
            for (let k = 0; k < response.result.payload.headers.length; k++) {
                //console.log(response.result.payload.headers[k].name)
                if (response.result.payload.headers[k].name == "Date")
                    date1 = response.result.payload.headers[k].value;
                else if (response.result.payload.headers[k].name == "From")
                    from = response.result.payload.headers[k].value;
                else if (response.result.payload.headers[k].name == "Subject")
                    subject = response.result.payload.headers[k].value;
            }

            appendPre(from, subject, date1, modal2);


        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" });
});







