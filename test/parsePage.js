/**
 * @author: youxiachai
 * @Date: 13-6-23
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var parser = require('../lib/pageparser');
/**
 *
 */
var listConvert = function () {
    var listHtml = fs.readFileSync(__dirname + '/testlist.html').toString();
    // console.log(listHtml);


    fs.writeFileSync(__dirname + '/resultList.html', parser.parseList(listHtml));
};

var listTitleUrl = function () {
    var listHtml = fs.readFileSync(__dirname + '/testlist.html').toString();
    parser.parseTitleUrl(listHtml);
};

var articleConvert = function () {
    var imgDb = new Array();
    var article = fs.readFileSync(__dirname + '/85-operational-rules.html').toString();
    parser.parseArticle(article, imgDb, function (result, db) {
        // fs.writeFileSync(__dirname+ '/parseArticle.html', result);
        console.log(db);
    });
}

var imageDownload = function () {
    var imageDb = [ 'http://static.oschina.net/uploads/user/6/13834_50.jpg',
        'http://static.oschina.net/uploads/user/279/559323_50.jpg?t=1371811789000',
        'http://static.oschina.net/uploads/user/80/161585_50.jpg?t=1371744126000',
        'http://static.oschina.net/uploads/user/117/235793_50.jpg?t=1369147977000',
        'http://static.oschina.net/uploads/user/511/1022959_50.jpg?t=1371372053000',
        'http://static.oschina.net/uploads/user/121/242958_50.jpg',
        'http://static.oschina.net/uploads/user/45/91321_50.jpg?t=1370880575000',
        'http://static.oschina.net/uploads/user/64/129214_50.jpg?t=1368418960000',
        'http://static.oschina.net/uploads/user/468/937625_50.jpg?t=1363676123000',
        'http://static.oschina.net/uploads/user/124/248849_50.jpg?t=1371690180000',
        'http://static.oschina.net/uploads/user/3/6973_50.jpg?t=1370442993000' ];
    var dir = __dirname + '/image/';

    parser.pageImgDownload(imageDb, dir, function(err, successUrl){
        if(err){
            console.log(err);
        }else{
            console.log(successUrl);
        }
    });

}


//listConvert();

//listTitleUrl();

//articleConvert();

imageDownload();