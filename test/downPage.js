/**
 * @author: youxiachai
 * @Date: 13-6-23
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */

var request = require('request');
var fs = require('fs');

/**
 * type = 1 为原文
 * type = 2 为译文
 *
 * page 为页码
 * @param type
 * @param page
 */
var dowloadTestList = function(type, page){
    var listUrl = 'http://www.oschina.net/translate/list?type='+ type +'&p=' + page;
    request.get(listUrl).pipe(fs.createWriteStream(__dirname + '/testlist.html'));
}

/**
 * 下载文章
 * @param pageUrl
 */
var downloadTestPage = function(pageUrl){

    var arr = pageUrl.split("/");
    request.get(pageUrl).pipe(fs.createWriteStream(__dirname + '/' + arr[arr.length - 1] + '.html'));

}

dowloadTestList(2, 1);
//downloadTestPage('http://www.oschina.net/translate/85-operational-rules');