function GenerateUsername()
{
    return `User${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
}

module.exports = { GenerateUsername };