var username;
var socket;
var connected = false;
var lastGrey = false; //Used to alternate color of messages;
var color = "#ff0000";


var color_list = [
    "#00FF00",
    "#0000FF",
    "#00FFFF",
    "#FF00FF",
    "#C0C0C0",
    "#800000",
    "#808000",
    "#008000",
    "#800080",
    "#008080",
    "#000080",
    "#800000",
    "#FF4500",
    "#FFD700",
    "#DAA520",
    "#808000",
    "#9ACD32",
    "#228B22",
    "#32CD32",
    "#20B2AA",
    "#00FFFF",
    "#5F9EA0",
    "#191970",
    "#4B0082",
    "#BA55D3",
    "#DA70D6",
]

var name_color_dict = {
    "Server": "#FF0000",
}

console.log("starting in client")

const stringToColour = (str) => {
    let ex = false
    let value = [0, 0, 0]
    while (!ex) {
        let hash = 0;
        str.split('').forEach(char => {
            hash = char.charCodeAt(0) + ((hash << 5) - hash)
        })
        let colour = '#'
        for (let i = 0; i < 3; i++) {
            value[i] = (hash >> (i * 8)) & 0xff
            // console.log("rgb value: ", value[i])
            colour += value[i].toString(16).padStart(2, '0')
        }
    }
}

function connect(text) {
    // console.log(text);
    text = text.split(" ");
    if (text[0] != "connect" || text.length < 2) {
        addMessage("ERROR", "To connect, type 'connect' followed by a username");
        return;
    }
    username = text.slice(1).join(' ');
    console.log(text + "\t" + username);
    socket = io.connect({ query: "username=" + username });
    connected = true;
    socket.on("newMessage", function (data) {
        addMessage(data.username, data.message);
    });
}

function addcolor(username) {
    index = Math.floor(Math.random() * color_list.length);
    name_color_dict[username] = color_list[index]
    // console.log("added ", name_color_dict[username], " for ", username, "[bak color] ", color_list[index])
    // console.log(name_color_dict)
}

function addMessage(username, message) {
    if (message == "")
        return 0
    if (name_color_dict[username]) {
        // console.log("found color: ", name_color_dict[username])
    } else {
        addcolor(username)
    }
    color = name_color_dict[username]
    // color = stringToColour(username)
    // console.log(color)

    //test all colors
    // color = color_list[count % color_list.length]
    // console.log(color)

    var li = $("<li></li>",
        {
            "class": "message",
            "style": "background-color:" + (lastGrey ? "white" : "#eee") + ";list-style-type:none;",
        });
    var colored_name = $("<label></label>",
        {
            "style": "color:" + color + ";",
        }
    ).text(username)


    var edlimiter = $("<span></span>").text(": ")
    var message_text = $("<span></span>").text(message)

    li.append(colored_name);
    li.append(edlimiter);
    li.append(message_text);

    $("#list").append(li);
    lastGrey = !lastGrey;
    $('input[name=messageText]').val("");
    scrollToBottom()
}
function scrollToBottom() {
    var $scrollableList = $('#list');
    $scrollableList[0].scrollIntoView(false)
}

$(document).ready(function () {
    $('button[name=sendMessage]').click(function (e) {
        if (!connected) {
            console.log("connecting");
            connect($("input[name=messageText]").val());
            console.log("text: " + $("input[name=messageText]").val());
            console.log("done connecting");
            socket.emit('newMessage', {
                'username': "Server", 'message': "User " + username +
                    " has connected."
            });
        } else {
            socket.emit('newMessage',
                { 'username': username, 'message': $('input[name=messageText]').val() });
        }
        return false;
    });
});


