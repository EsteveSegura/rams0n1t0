const crypto = require('crypto');
const fs = require('fs');
const algorithm = "aes-256-ctr";

/* 
    Promise that is requires a file & key.
    Then read the file, encrypts it with AES256
    and delete original file, leaving a .crypt file

    MyPicture.jpg -> MyPicture.jpg.crypt
*/
function readFileAndCrypt(fileToEncrypt,key){
    return new Promise((resolve,reject) => {
        let cipher = crypto.createCipher(algorithm,key);
        fs.readFile(fileToEncrypt, (err,data) => {
            let dataBuffer = Buffer.from(data,'hex')
            let crypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
            fs.writeFile(`${fileToEncrypt}.crypt`,crypted,() => {
                fs.unlink(fileToEncrypt,(err)=>{
                    if(err) reject(err)
                })
                resolve(`${fileToEncrypt} crypted.`)
            })
        })
    });
}

/* 
    Promise that is requires a file & key.
    Then read the file, descrypts it with AES256 and key
    and delete .crypt file, leaving the original file

    MyPicture.jpg.crypt -> MyPicture.jpg
*/
function readFileAndDecrypt(fileToDecrypt,key){
    return new Promise((resolve,reject) => {
        let decipher = crypto.createDecipher(algorithm,key);
        console.log("Descifrador")
        console.log(decipher)
        fs.readFile(fileToDecrypt,(err,data) => {
            if(err) reject(err);
            let dataBuffer = Buffer.from(data,'binary');
            let decrypt = Buffer.concat([decipher.update(dataBuffer),decipher.final()]);
            let extOk = fileToDecrypt.replace('.crypt','')
            fs.writeFile(extOk, decrypt, () => {
                fs.unlink(fileToDecrypt,(err)=>{
                    if(err) reject(err)
                })
                
                resolve(`${fileToDecrypt} decrypted.`)
            });
        })
    });
}

module.exports = { readFileAndCrypt, readFileAndDecrypt }