const express = require('express');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const router = express.Router();

const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

//Reading file from computer
let testFile = fs.readFileSync("D:/ryoshi_metadata.json");
//Creating buffer for ipfs function to add file to the system
let testBuffer = new Buffer.from(testFile);

router.get(
    '/',
    async (req, res) => {
        console.log('addfile');
        ipfs.files.add(testBuffer, function (err, file) {
            if (err) {
                console.log(err);
                return res.status(400).json({ errors: err });
            }
            console.log(file);
            res.json({ file });
        })
    }
);