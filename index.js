/**
 * Builder
 * @author zsx<zsx@zsxsoft.com>
 */
var express = require('express');
var path = require('path');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));

var app = new express();
var queueReady = ["server"];
var port = process.env.PORT || 3000;
var httpServer = "http://127.0.0.1:" + port + "/";

var pageWidth = 2200; // Magic number!
var pageHeight = 3600;

String.prototype.repeat = function(count) {
    var ret = [];
    while (count--) {
        ret.push(this);
    }
    return ret.join("");
}
/**
 * Use to build a promise for some fucking async api.
 * @param  object object       
 * @param  string method       
 * @param  array otherArguments
 * @return Promise<any>
**/
var promiseFactory = function promiseFactory(object, otherArguments) {
    var resolver = Promise.defer();
    var argu = otherArguments;
    if (!(argu instanceof Array)) {
        argu = [];
    }
    argu.push(function() {
        resolver.resolve.apply(resolver, arguments);
    });
    object.apply(object, argu);
    return resolver.promise;
}

/**
 * Recursion to generate readme
 * @param object object
 * @param int deep
 * @return string     
 */
var buildReadme = function buildReadme(object, deep) {
    var deeper = deep + 1;
    var deepString = "\t".repeat(deep) + "- ";
    var ret = [deepString + object.name];
    if (object.children) {
        object.children.map(function(value, index) {
            ret.push(buildReadme(value, deeper));
        });
    }
    return ret.join("\n");
}

var actions = {
    /**
     * For running phantomjs to take a screenshot for the webpage
     * @return Promise<any>
     */
    phantomjs: function phantomjs() {
        return new Promise(function(resolve, reject) {
            var phantom = require('phantom');

            var ph;
            var page;

            // What the fucking API
            return promiseFactory(phantom.create).then(function(phantom) {
                ph = phantom;
                console.log("Created Phantomjs");
                return promiseFactory(ph.createPage);
            }).then(function(pg) {
                page = pg;
                return promiseFactory(page.set, ['viewportSize', {
                    width: pageWidth,
                    height: pageHeight
                }]);
            }).then(function(err) {
                console.log("Set viewportSize");
                return promiseFactory(page.open, [httpServer]);
            }).then(function(status) {
                console.log("Rendered HTML, the image will be save after 2 seconds.");
                if (status == "success") {
                    return Promise.delay(2000);
                } else {
                    return reject(status);
                }
            }).then(function() {
                return promiseFactory(page.render, [path.join(__dirname, 'Web Front End Stack.png')]);
            }).then(function() {
                console.log("The image saved successfully!");
                return resolve();
            }).then(function() {
                page.close();
                ph.exit();
            });
        });
    },

    /**
     * To rebuild the README.md
     * @return Promise<any>
     */
    readme: function readme() {
        var json = require('./ux/WebFrontEndStack.json');
        return Promise.resolve().then(function() {
            return fs.readFileAsync("./README.md", "utf-8");
        }).then(function(fileContent) {
            var ret = buildReadme(json, 0);
            fileContent = fileContent.replace(/<\!--BUILD_START-->[\d\D]+?<\!--BUILD_END-->/, "{%BuildStart%}")
            return fs.writeFileAsync("./README.md", fileContent.replace("{%BuildStart%}", "<!--BUILD_START-->\n\n" + ret + "\n\n<!--BUILD_END-->", "utf-8"));
        }).then(function() {
            console.log('Readme built successfully!');
        })
    },
    /**
     * To start an express server
     * @return Promise<any>
     */
    server: function server() {
        return new Promise(function(resolver, reject) {
            return app
                .set('port', port)
                .set('view engine', 'html')
                .use(express.static(path.join(__dirname, '/ux')))
                .use('/', function(req, res) {
                    res.redirect('/WebFrontEndStack.htm');
                })
                .listen(port, function() {
                    console.info('Express started on: http://127.0.0.1:' + port);
                    resolver(app);
                });
        });
    }
};

var queue = [actions.server()];
process.argv.forEach(function(val) {
    if (val in actions) {
        console.info("Task: " + val);
        queue.push(actions[val]());
    }
});

var promise = Promise.all(queue);
if (queue.length > 1) { // for somebody who only want to start the server.
    promise.then(function() {
        console.log("OK!");
        process.exit(0);
    });
}
