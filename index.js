/**
 * Builder
 * @author zsx<zsx@zsxsoft.com>
 */
var express = require('express');
var path = require('path');
var Promise = require("bluebird");
var request = require("request");
var async = require("async");
var fs = Promise.promisifyAll(require('fs'));

var app = new express();
var queueReady = ["server"];

var pageWidth = 1900; // Magic number!
var pageHeight = 3800;

var config = {
    port: 3000, 
    update_existed_stargazers: false,
	locale: process.env.locale || '',
	rawLocale: process.env.locale || ''
}
var httpServer = "http://127.0.0.1:" + config.port + "/";

if (config.locale)
	config.locale = '.' + config.locale;

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
 * @param string language
 * @param int deep
 * @return string     
 */
var buildReadme = function buildReadme(object, language, deep) {
    var deeper = deep + 1;
    var deepString = "\t".repeat(deep) + "- ";
    var ret = [];
    var lang = typeof object.languages == "undefined" ? object.name : object.languages[language];
    lang = lang || object.name;

    ret.push((function(deepString, name, url, github) {
        var haveUrl = !!url;
        var haveGitHub = !!github;
        return deepString + (haveUrl ? "[" : "") + name + (haveUrl ? "](" + url + ")" : "") + (haveGitHub ? " [\[GitHub\]](" + github + ")" : "");
    })(deepString, lang, object.url, object.github));
    if (object.children) {
        object.children.map(function(value, index) {
            ret.push(buildReadme(value, language, deeper));
        });
    }
    return ret.join("\n");
}

var actions = {
    /**
     * Update the stargazers of the GitHub repo
     * Be careful! There have the rate limit!
     * @see  https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
     * @return Promise<any>
     */
    updatestargazers: function updatestargazers() {
        return new Promise(function(resolve, reject) {
            var originalData = JSON.parse(fs.readFileSync('./ux/WebFrontEndStack.json', "utf-8")); // Require will lock the file.
            var getGitHubApi = function(github) {
                var githubArray = github.split("/");
                // I want a sprintf T_T
                return "https://api.github.com/repos/" + githubArray[3] + "/" + githubArray[4];
            };
            var q = async.queue(function(object, callback) {
                if (!object.github || (!config.update_existed_stargazers && object.stargazers)) {
                    callback(false);
                    return;
                }
                var githubUrl = getGitHubApi(object.github);
                console.log("Getting " + githubUrl);
                request({
                    url: githubUrl,
                    headers: {
                        "User-Agent": "https://github.com/unruledboy/WebFrontEndStack" // GitHub required user-agent
                    }
                }, function(err, res, body) {
                    if (!err && res.statusCode == 200) {
                        var json = JSON.parse(body);
                        if (json === null) {
                            callback(false);
                            return;
                        }
                        object.stargazers = json.stargazers_count;
                        callback(true);
                    } else {
                        if (res.statusCode == 403) { // Out of API limit!
                            console.error("Out of GitHub API limit!");
                            console.error("The limit will be reset when " + new Date(res.headers['x-ratelimit-reset'] * 1000));
                            q.kill();
                            reject("Out of GitHub API limit!");
                        }
                        callback(false);
                    }
                });

            }, 5);
            var addQueue = function addQueue(object) {
                q.push(object, function(err) {
                    if (err) console.log(object.name + " = " + object.stargazers);
                });
                if (object.children) {
                    object.children.forEach(function(val) {
                        addQueue(val);
                    });
                }
            };
            addQueue(originalData);
            q.push({ // For some reason, the ``drain`` will not be called.
                noRequest: true
            }, function() {
                fs.writeFileAsync('./ux/WebFrontEndStack.json', JSON.stringify(originalData), "utf-8").then(function() {
                    resolve();
                });
            });
            return q;
        })
    },
    /**
     * For running phantomjs to take a screenshot for the webpage
     * @return Promise<any>
     */
    phantomjs: function phantomjs() {
        var json = require('./ux/WebFrontEndStack.json');
        var phantom = require('phantom');
        promisify(phantom);        
        // What the fucking API
        var resolver = Promise.defer();
        var buildByLanguage = function(language) {
            var displayLanguage = language == "" ? "en" : language;
            var ph;
            var page;
            return phantom.createAsync().then(function(phantom) {
                ph = phantom;
                promisify(ph);
                console.log("Created Phantomjs for " + displayLanguage);
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
                console.log("Opening " + httpServer + "?locale=" + language + " for " + displayLanguage);
                return page.openAsync(httpServer + "?locale=" + language);
            }).then(function(status) {
                console.log("Rendered HTML, the image will be saved after 2 seconds.");
                if (status == "success") {
                    return Promise.delay(2000);
                } else {
                    throw status;
                }
            }).then(function() {
                return page.renderAsync(path.join(__dirname, 'Web Front End Stack' + (language == "" ? "" : ".") + language + '.png'));
            }).then(function() {
                console.log("The image(" + displayLanguage + ") saved successfully!");
                page.close();
                ph.exit();
            });
        };
        resolver.promise.then(buildByLanguage(""));
        for (var item in json.languages) {
            resolver.promise.then(buildByLanguage(item));
        }
        return resolver.promise;
    },

    /**
     * To rebuild the README.md
     * @return Promise<any>
     */
    readme: function readme() {
        var json = require('./ux/WebFrontEndStack.json');
        var resolver = Promise.defer();
        var buildByLanguage = function(language) {
            return Promise.resolve().then(function() {
                return fs.readFileAsync('./README' + (language == "" ? "" : ".") + language + '.md', "utf-8");
            }).then(function(fileContent) {
                var ret = buildReadme(json, language, 0);
                fileContent = fileContent.replace(/<\!--BUILD_START-->[\d\D]+?<\!--BUILD_END-->/, "{%BuildStart%}")
                return fs.writeFileAsync('./README' + (language == "" ? "" : ".") + language + '.md', fileContent.replace("{%BuildStart%}", "<!--BUILD_START-->\n\n" + ret + "\n\n<!--BUILD_END-->", "utf-8"));
            }).then(function() {
                console.log('Readme' + (language == "" ? "" : ":") + language + ' built successfully!');
            })
        };
        resolver.promise.then(buildByLanguage(""));
        for (var item in json.languages) {
            resolver.promise.then(buildByLanguage(item));
        }
        return resolver.promise;
    },
    /**
     * To start an express server
     * @return Promise<any>
     */
    server: function server() {
        return new Promise(function(resolver, reject) {
            return app
                .set('port', config.port)
                .set('view engine', 'html')
                .use(express.static(path.join(__dirname, '/ux')))
                .use('/', function(req, res) {
                    res.redirect('/WebFrontEndStack.htm?locale=' + req.query.locale);
                })
                .listen(config.port, function() {
                    console.info('Express started on: http://127.0.0.1:' + config.port);
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
    } else if (val[0] == "-" && val.indexOf("=") >= 0) {
        var obj = val.split("=");
        var name = obj[0].split("--")[1];
        var value = obj[1];
        config[name] = value;
    }
});

var promise = Promise.all(queue);
if (queue.length > 1) { // for somebody who only want to start the server.
    console.log("You can press Ctrl+C to exit if tasks finished.")
    promise.then(function() {
        console.log("OK!");
        process.exit(0);
    });
}
