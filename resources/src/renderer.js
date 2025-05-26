var current_username = "debil";

window.electronAPI.onUsernameInit((username) => {
    console.log("Odebrany username:", username);
    current_username = username;
    document.querySelector("#username_input").value = username;
});

console.log(window.electronAPI);

class Message {
    constructor(author, message)
    {
        this.author = author;
        this.message = message;
    }

    CopyMessage(msg)
    {
        navigator.clipboard.writeText(msg);
    }

    CreateMessage()
    {
        const chat = document.querySelector("#msgContainer");

        var container = document.createElement('div');
        var username_text = document.createElement('p');
        var message_text = document.createElement('p');
        var copy_button = document.createElement('button');

        container.className = "MessageObj";
        username_text.className = 'username';
        message_text.className = 'message';
        copy_button.className = "copyBtn";


        username_text.textContent = this.author;
        message_text.textContent = this.message;
        copy_button.textContent = "Kopiuj";

        copy_button.addEventListener('click', () => {
            CopyMessage(this.message);
        });

        if (this.author === "[HOST]")
        {
            container.id = "HostMessage";
        }

        // username_text.appendChild(copy_button);

        container.appendChild(username_text);
        container.appendChild(message_text);

        chat.appendChild(container);
        container.scrollIntoView()
    }
}

function ChangeUsername()
{
    current_username = document.querySelector("#username_input").value;
    window.electronAPI.saveUsername();

    if (current_username == "[HOST]")
    {
        current_username = "no chyba nie";
        document.querySelector("#username_input").value = "no chyba nie";
    }
}

window.electronAPI.getMessages().then((msgs) =>{
    msgs.forEach(msg => {
        var mess = new Message(msg.author, msg.message);
        mess.CreateMessage();
    });

    console.log("wczytano wiadomości z serwera");

})

window.electronAPI.onNewMessage((msg) => {
    console.log("Nowa wiadomość:", msg);

    var mess = new Message(msg.author, msg.message);
    mess.CreateMessage();
    window.location.reload();
});

function SendMessage()
{
    var message = document.querySelector("textarea").value;

    if (message.length <= 0) return;

    document.querySelector("textarea").value = "";
    window.electronAPI.sendMessage({author: current_username, message: message});

    // var mess = new Message(current_username, message);
    // mess.CreateMessage();


    // window.electronAPI.getMessages().then((msgs) =>{
    //     console.log(msgs);
    // })
}