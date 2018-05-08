#! /usr/bin/env node
const commander = require('commander');
const fs = require('fs');
// const path = require('path');

commander.version('2.15.1')
    .option('-a --aaa', 'aaaaaa')
    .option('-b --bbb', 'bbbbbb')
    .option('-c --ccc [name]', 'ccccc');


commander
    .command('init <extensionId>')
    .description('init extension project')
    .action((extensionId) => {
        console.log(`init Extension Project "${extensionId}"`);

        fs.open( __dirname + '/cm-cli.json', 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('myfile does not exist');
                    return;
                }

                throw err;
            }

            let buffer = new Buffer(255);
            // 每一个汉字utf8编码是3个字节，英文是1个字节
            fs.read(fd, buffer, 0, 9, 3, function(err, bytesRead, buffer) {
                if (err) {
                    throw err;
                } else {
                    // 读取完后，再使用fd读取时，基点是基于上次读取位置计算；
                    fs.read(fd, buffer, 0, 9, null,
                        (err, bytesRead, buffer) => {
                        // console.log(bytesRead);
                        // console.log(buffer.slice(0, bytesRead).toString());
                    });
                }
            });

            // readMyData(fd);
        });
        // todo something you need
    });

if ( commander.aaa ) {
    console.log('aaa');
}

if ( commander.bbb ) {
    console.log('bbb');
}

if ( commander.ccc ) {
    console.log('ccc', commander.ccc);
}

commander.parse(process.argv);

