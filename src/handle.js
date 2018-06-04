const fs = require('fs');
const path = require('path');


/**
 *
 * @param {*} origin
 * @param {*} aim
 */
function copy(origin, aim) {
    fs.createReadStream(origin).pipe(fs.createWriteStream(aim));
}

/**
 *
 * @param {*} dir
 * @param {*} callback
 */
function travelSync(dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        let pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            callback(pathname, 'dir');
            travelSync(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

/**
 *
 * @param {*} headerPath
 * @param {*} flagBegin
 * @param {*} flagEnd
 */
function getAimCode(headerPath, flagBegin, flagEnd) {
    fs.readFile(headerPath, (err, html) => {
        if (!err) {
            let aimData = html.toString();
            let sliceStart = aimData.indexOf(flagBegin);

            let sliceEnd = aimData.indexOf(flagEnd) +
                flagEnd.length + 2;

            let aim = aimData.slice(sliceStart, sliceEnd);
            console.log(aim);
        }
    });
}

getAimCode('./app/footer.html', '<!-- footer begin -->', '<!-- footer end -->');

/**
 * 创建目录
 * @param {*} path
 */
function copyDir(path) {
    fs.mkdir(path, function(err) {
        if (!err) console.log(path + ' 目录创建成功!');
    });
}

/**
 *
 */
function cutIndex() {
    fs.readFile('./app/index.html', function(err, html) {
        if (!err) {
            let indexData = html.toString();
            topStart = 0,
                topEnd = indexData.indexOf('<!-- index begin -->');
            contentStart = indexData.indexOf('<!-- index begin -->'),
                contentEnd = indexData.indexOf('<!-- index end -->') +
                '<!-- index end -->'.length + 2;
            bottomStart = indexData.indexOf('<!-- index end -->') +
                '<!-- index end -->'.length + 2;

            top = indexData.slice(topStart, topEnd),
                content = indexData.slice(contentStart, contentEnd),
                bottom = indexData.slice(bottomStart);
            console.log(top + 'top打印结束');
            console.log(content + 'content打印结束');
            console.log(bottom + '\n bottom打印结束');
        }
    });
}

cutIndex();

/**
 *
 */
travelSync('./app', (pathname, fileType) => {
    if (pathname && fileType === 'file') {
        let publicPath = pathname.replace('app', 'public');
        copy(pathname, publicPath);
    } else if (pathname && fileType === 'dir') {
        let publicPath = pathname.replace('app', 'public');
        copyDir(publicPath);
    }
});


travelSync('./app', function(pathname, fileType) {
    let publicPath = '';
    if (pathname && fileType === 'file') {
        // app/header.html
        publicPath = pathname.replace('app', 'public');
        copy(pathname, publicPath);
    } else if (pathname && fileType === 'dir') {
        // app/css
        publicPath = pathname.replace('app', 'public');
        copyDir(publicPath);
    }

    fs.readFile('./app/header.html', function(err, html) {
        if (!err) {
            let headerData = html.toString();
            // sliceStart只需要找到字符串的索引位置即可
            let sliceStart = headerData.indexOf('<!-- header begin -->');
            // sliceEnd找到字符串的位置后，加上字符串本身的长度再加2是一个换行符的
            let sliceEnd = headerData.indexOf('<!-- header end -->') + '<!-- header end -->'.length + 2;
            let header = headerData.slice(sliceStart, sliceEnd);
        }

        fs.readFile('./app/footer.html', function(err, html) {
            if (!err) {
                let footerData = html.toString();
                // sliceStart只需要找到字符串的索引位置即可
                let sliceStart = footerData.indexOf('<!-- footer begin -->');
                // sliceEnd找到字符串的位置后，加上字符串本身的长度再加2是一个换行符的
                let sliceEnd = footerData.indexOf('<!-- footer end -->') + '<!-- footer end -->'.length + 2;
                let footer = footerData.slice(sliceStart, sliceEnd);
            }

            fs.readFile('./app/index.html', function(err, html) {
                if (!err) {
                    let indexData = html.toString();
                    let topStart = 0,
                        topEnd = indexData.indexOf('<!-- index begin -->');
                    let contentStart = indexData.indexOf('<!-- index begin -->'),
                        contentEnd = indexData.indexOf('<!-- index end -->') + '<!-- index end -->'.length + 2;
                    let bottomStart = indexData.indexOf('<!-- index end -->') + '<!-- index end -->'.length + 2;

                    let top = indexData.slice(topStart, topEnd),
                        content = indexData.slice(contentStart, contentEnd),
                        bottom = indexData.slice(bottomStart);
                }
                let indexChunk = top + header + content + footer + bottom;
                fs.writeFile('./public/index.html', indexChunk, function(err) {
                    if (!err) console.log('文件处理成功！');
                });
            });
        });
    });
});
