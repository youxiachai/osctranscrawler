/**
 * @author: youxiachai
 * @Date: 13-6-23
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */

var cheerio = require('cheerio');
var request = require('request');
var mkdirp = require('mkdirp');
var pathUtil = require('path');
var urlUtil = require('url');
var fs = require('fs');
/**
 * 后边考虑用string buffer 实现
 * @param body html 文本
 */
exports.parseList = function (body) {
    var $ = cheerio.load(body);

    var resultContent = "";

    $('div.article').each(function (index, item) {
        var $item = $(item);

        // var dateTime = '<div>' + $item.find('dd.remark').html() + '</div>';

        $item.find('dd.remark').remove();

        var $dt = $item.find('dt');

        //  $dt.find('a').after(dateTime);

        var itemPath = $item.find('dt a').attr('href').split('/');

        var pathUrl = '/' + itemPath[itemPath.length - 2] + "/" + itemPath[itemPath.length - 1];

        $dt.find('a').attr("href", pathUrl).removeAttr("target");

        $dt.replaceWith("<header><h5>" + $item.find('dt').html() + "</h5></header>");

        var $dd = $item.find('dd.content');
        var itemText = $dd.text();
        $dd.replaceWith("<div>" + itemText + "</div>");

        var $itemContent = $item.children();
        $itemContent.replaceWith("<li><div class='content'>" + $itemContent.html() + "</div></li>");
        resultContent += $item.html();
    });

    return "<ul class='nav nav-list'>" + resultContent + '</ul>';
};

/**
 *获取列表里面文章链接
 * @param body
 */
exports.parseTitleUrl = function (body) {
    var titleUrl = new Array();
    $ = cheerio.load(body);
    $('div.article').each(function (index, item) {
        var $body = $(item);
        //console.log($body.find('dt a').attr('href'));
        titleUrl.push($body.find('dt a').attr('href'));
    });
    return titleUrl;
};

/**
 *
 * @param body String
 * @param imageDb Array
 * @param cb
 * @returns {*}
 */
exports.parseArticle = function (body, cb) {
    var imageDb = new Array();
    var $ = cheerio.load(body);

    //获取标题
    var title = $('div.Article div.Top h1').text();
    //移除翻译者
    $('td.translater').remove();
    $('table').addClass("table").addClass("table-striped").addClass("table-bordered").addClass("table-hover");

    //记录图片链接
    $('img').each(function (index, item) {
        var imgUrl = $(item).attr('src');

        if (!imgUrl.indexOf('http')) {
            imageDb.push(imgUrl);
            $(item).attr('src', imgUrl.replace('http://static.oschina.net', ''));
        }

    });

    var contentHtml = "";
    $('div.Body').children('div').each(function (index, item) {


        var itemText = $(this).find('div.TextContent').html();

        $(this).find('table.paragraph_chs').replaceWith("" + itemText + "");

        contentHtml += $(this).html();
    });
//   console.log(contentHtml);
    contentHtml = "<div class='container-fluid content'>" + contentHtml + "</div>"

    return cb(contentHtml, imageDb);
};


/**
 *
 * @param imageUrl
 * @param downloadDir
 * @param fileName
 */
var requestHttp = function (imageUrl, downloadDir, fileName, cb) {
    mkdirp(downloadDir, function (err) {
        if (err) {
            cb(err, null);
        } else {
            fs.exists(downloadDir + fileName, function (exists) {
                console.log(exists);
                // 对于流的处理没做好，得研究一下api才行。。。
                if (!exists) {
                    var imageStream = fs.createWriteStream(downloadDir + fileName);
                    imageStream.on('error', function (err) {
                        console.log('error-->' + err);
                        cb(err, null);
                    });
                    request(imageUrl,function (error, response, body) {
                        if (error) {
                            cb(error, null);
                            //fail del the file
                            //暂时失败不重试
                            fs.unlink(downloadDir + fileName, function () {
                                console.log(response + "error" + error);
                                cb(error, null);
                            });
                        } else {
                            //返回成功的链接
                            console.log("download--success" + imageUrl);
                            cb(null, imageUrl);

                        }
                    }).pipe(imageStream);
                }
            });
        }
    });
};

/**
 *
 * @param imageDb
 * @param downloadDir
 * @returns {*}
 */
exports.pageImgDownload = function (imageDb, downloadDir, cb) {
    var pattern = /\b\?t=\w*\b/i;
    for (var i in imageDb) {
        var imageUrl = imageDb[i].replace(pattern, '');
        var fileName = urlUtil.parse(imageUrl);
        requestHttp(imageUrl, downloadDir, fileName.path, cb);
    }
};