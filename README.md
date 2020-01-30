<p align=center>

  <img width=300 src="https://i.imgur.com/2UkqjjG.png"/>

  <br>
  <span><strong>Rams0n1t0</strong> is a piece of software designed to encrypt our files and protect them from prying eyes. </span><br />
<img src="https://img.shields.io/badge/NodeJS-10.13.0-green"> 
<img src="https://img.shields.io/badge/License-MIT-blue">
<a href="http://girlazo.com"><img src="https://img.shields.io/badge/Website-up-green"></a>
<img src="https://img.shields.io/badge/Version-0.0.1-blue">
</p>


<p align="center">
  <a href="#tldr">TLDR</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#installation">Installation</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Usage</a>
</p>

## TLDR
**Rams0n1t0** analyzes the entire file tree starting with the folder that we specify and is only capable of performing actions forward, never backwards of the specified folder.

We use an **AES-256-CTR encryption**, an extremely strong algorithm, today it is practically **impossible to break** the algorithm.

<u>The author of this project is not responsible for the misuse / lost files in the use of the software</u>


## Installation

**NOTE**: NodeJS 10.13.0 or higher is required.

```bash
# clone the repo
$ git clone https://github.com/EsteveSegura/rams0n1t0.git

# change the working directory to insta-growth
$ cd rams0n1t0

# install NodeJS if is not installed

# this will show up the help message
$ cd src && node index -h
```

## Usage
The software has two main actions: **Encryption** and **decryption**, both actions must be done from the terminal.

**Encryption**
``` bash
# Encrypt the testArea folder included
$ node index --encrypt ../testArea
```

This process will **encrypt the entire tree of files from the folder specified in --encrypt** and also create a file "**decrypt.key**" in the folder where the program is being called, **this file is the most important when it comes to recovering our files**.

**Decryption**
``` bash
# Encrypt the testArea folder included
$ node index --decrypt ../testArea --key ./decrypt.key
```

**In the decryption process we will have to enter the correct .key file, if this does not happen, the program corrupts all our files becoming unrecoverable for ALWAYS.** This happens for security reasons and to avoid brute force attacks.

## License
MIT © Rams0n1t0
