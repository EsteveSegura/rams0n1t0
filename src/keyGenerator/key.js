const crypto = require('crypto');
const fs = require('fs')
const secret = 'YouCantGetIt'; //This secret is not important

function sha256(string){
    return crypto.createHmac('sha256', secret).update(string).digest('base64');
}

function shuffleString(stringToShuffle) {
    let stringToArray = Array.from(stringToShuffle)
    for (let i = stringToArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stringToArray[i], stringToArray[j]] = [stringToArray[j], stringToArray[i]];
    }
    return stringToArray.toString().split(',').join('');
}


function createKeyFromData(arrFiles){
    let now = new Date().getTime() //actual timeStamp
    let randomNumber = Math.pow(Math.floor((Math.random() * 99) + 1), 9) * Math.floor((Math.random() * 9999) + 1) * Math.ceil(Math.random() * Math.random()) //Random number to avoid
    let key = now + arrFiles + randomNumber.toString() //String to hash
    let shuffleKey = shuffleString(key) //Shuffle the string
    let toHash = sha256(shuffleKey.toString()).substr(0,14) //Get only the first 14 characters
    fs.writeFile('./decrypt.key',toHash,() => { //Save the key
        console.log("Key saved.")
    })
    return toHash
}

module.exports = { createKeyFromData }