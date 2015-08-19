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

var pageWidth = 1900; // Magic number!
var pageHeight = 3800;

String.prototype.repeat = function(count) {
    return new Array(count + 1).join(this);
}
/**
 * Use to build a promise for some fucking async api.
 * @param  object object       
 **/
var promisify = function promisify(object) {
    for (var key in object) {
        (function(key, asyncKey) {
            object[asyncKey] = function() {
                var resolver = Promise.defer();
                var len = arguments.length;
                var argu = new Array(len + 1);
                for (var i = 0; i < len; i++) { // I think a Array.from is more convenient.
                    argu[i] = arguments[i];
                }
                argu[len] = function() {
                    resolver.resolve.apply(resolver, arguments); // Callback arguments
                };
                object[key].apply(object, argu);
                return resolver.promise;
            }
        })(key, key + "Async");
    }
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
    var ret = [];
    ret.push((function(deepString, name, url) {
        var haveUrl = !!url;
        return deepString + (haveUrl ? "[" : "") + object.name + (haveUrl ? "](" + url + ")" : "");
    })(deepString, object.name, object.url));
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
            promisify(phantom);

                // What the fucking API
            return phantom.createAsync().then(function(phantom) {
                ph = phantom;
                promisify(ph);
                console.log("Created Phantomjs");
                return ph.createPageAsync();
            }).then(function(pg) {
                page = pg;
                promisify(pg);
                return page.setAsync('viewportSize', {
                    width: pageWidth,
                    height: pageHeight
                });
            }).then(function() {
                console.log("Set viewportSize");
                return page.openAsync(httpServer);
            }).then(function(status) {
                console.log("Rendered HTML, the image will be saved after 2 seconds.");
                if (status == "success") {
                    return Promise.delay(2000);
                } else {
                    return reject(status);
                }
            }).then(function() {
                return page.renderAsync(path.join(__dirname, 'Web Front End Stack.png'));
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
