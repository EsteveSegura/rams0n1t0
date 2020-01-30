const fs = require('fs');
const keyGenerator = require('./keyGenerator/key')
const cryptoFunctions = require('./crypto/cryptoFunctions');

function getKey() {
    let myArgs = process.argv.slice(2);

    for (let i = 0; i < myArgs.length; i++) {
        if (myArgs[i].startsWith('--key')) {
            return myArgs[i + 1]
        }
    }
}

async function handleArgs() {
    let myArgs = process.argv.slice(2);
    let keyEncrypt = getKey()

    for (let i = 0; i < myArgs.length; i++) {
        if (myArgs[i].startsWith('-') || myArgs[i].startsWith('--')) {
            //console.log(`${myArgs[i]} : ${myArgs[i+1]}`) //Show all arguments

            if (myArgs[i].startsWith('-h')) {
                console.log(`--encrypt <Path>: The root folder to encrypt. All children in the file tree will be encrypted.\n--decrypt <Path>: The root folder to decrypt. All children in the file tree will be decrypted.\n--key <Path>: File containing our decryption key (.key). If we try to decrypt the files, with a modified key, all the files will be corrupted and unrecoverable as a security measure`)
                process.exit()
            }

            if (myArgs[i].startsWith('--encrypt')) {
                let rootFolder = myArgs[i + 1]
                await encryptFilesTree(rootFolder);
            }

            if (myArgs[i].startsWith('--decrypt')) {
                let rootFolder = myArgs[i + 1]
                let keyDecrypt = getKey()
                console.log(keyDecrypt)
                if (typeof keyDecrypt == "undefined") {
                    console.log("need a .key file in --key")
                    process.exit
                }
                await decryptFilesTree(rootFolder, keyEncrypt)
            }

        }
    }
}

//Get the file tree from the specified path forward
function traverseDirectory(dirname, callback) {
    let directory = [];
    fs.readdir(dirname, function (err, list) {
        dirname = fs.realpathSync(dirname);
        if (err) {
            return callback(err);
        }
        let listlength = list.length;
        list.forEach(function (file) {
            file = dirname + '\\' + file;
            fs.stat(file, function (err, stat) {
                directory.push(file);
                if (stat && stat.isDirectory()) {
                    traverseDirectory(file, function (err, parsed) {
                        directory = directory.concat(parsed);
                        if (!--listlength) {
                            callback(null, directory);
                        }
                    });
                } else {
                    if (!--listlength) {
                        callback(null, directory);
                    }
                }
            });
        });
    });
}

//Store the files that has extension in array
function getFilesToEncrypt(root) {
    return new Promise((resolve, reject) => {
        traverseDirectory(root, function (err, result) {
            if (err) {
                console.log(err);
            }
            let filterFiles = result.filter((path) => {
                let pathSplited = path.split('\\')
                let lastStringOnPath = pathSplited[pathSplited.length - 1]
                if (lastStringOnPath.includes('.')) {
                    return path
                }
            });
            resolve(filterFiles)
        });
    })
}

//Encrypt Files 
async function encryptFilesTree(rootFolder, cipherKey = false) {
    console.log("GO")
    let files = await getFilesToEncrypt(rootFolder)
    let keyToEncrypt = cipherKey
    if (!cipherKey) {
        keyToEncrypt = keyGenerator.createKeyFromData(files.toString());
        console.log(keyToEncrypt)
    }

    for (let i = 0; i < files.length; i++) {
        console.log(files[i])
        let actualFileToCrypt = await cryptoFunctions.readFileAndCrypt(files[i], keyToEncrypt)
        console.log(actualFileToCrypt)
    }
}

//Decrypt Files
async function decryptFilesTree(rootFolder, keyFile) {
    let files = await getFilesToEncrypt(rootFolder)
    fs.readFile(keyFile, async (err, keyToDecrypt) => {
        if (err) throw err;
        for (let i = 0; i < files.length; i++) {
            console.log(keyToDecrypt)
            console.log(files[i])
            if (files[i].endsWith(".crypt")) {
                let actualFileToCrypt = await cryptoFunctions.readFileAndDecrypt(files[i], keyToDecrypt)
                console.log(actualFileToCrypt)
            }
        }
    });
}



handleArgs()
