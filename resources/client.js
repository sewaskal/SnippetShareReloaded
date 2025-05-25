const config = require("../config.json");

function GetUsername()
{
    const username = config.username;
    let returnName = "";

    if (username.trim().length <= 0)
        returnName = `User${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    else
        returnName = config.username;

    return returnName;
}

function SaveUsername(username)
{

}

module.exports = { GetUsername, SaveUsername };