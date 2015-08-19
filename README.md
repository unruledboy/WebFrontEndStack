# Localization
中文: 
http://www.cnblogs.com/unruledboy/p/WebFrontEndStack.html


# WebFrontEndStack
Web front-end stack: browsers, platforms, libraries, frameworks, tools etc.

![Image of Web Front End Stack](Web Front End Stack.png)

# Generate image yourself

## Prepare for environment
You should have Visual Studio 2010+ installed in Windows. 

1. Install [nodejs](https://nodejs.org).

2. Install [Phantomjs](http://phantomjs.org).

3. Install [Python 2.7](https://www.python.org/).

3. ``npm install``

If the error occurs, you can check the dependence of [phantomjs-node](https://github.com/sgentle/phantomjs-node/wiki), [node-gyp](https://github.com/TooTallNate/node-gyp#installation).

## Run commands
``npm start`` for start a server to open the html directly.

``npm run build`` for generate the image.

Both of commands require port 3000. If you're using this port, then try this:

bash:
```bash
PORT=4000 npm run build
```

cmd:
```cmd
SET PORT=4000
npm run build
```

# What and why?
Have you ever wondered:
* what technologies web front end really includes? 
* how many do I possess?


I could not find a really comprehensive diagram that shows the web front end technology stack, so I come up with my own version.

There might be issues here and there, like the category, the individual ones, but the beautity is you can modify it as you want.

You can have a graphical preview here (use mouse to move / zoom): 

https://rawgit.com/unruledboy/WebFrontEndStack/master/ux/WebFrontEndStack.htm 


# The Web Front End Stack
<!--BUILD_START-->

- Web Front End
	- Browser
		- [Internet Explorer](http://windows.microsoft.com/en-us/internet-explorer/download-ie)
		- [Chrome](http://www.google.com/chrome/)
		- [Firefox](https://www.mozilla.org/)
		- [Safari](http://www.apple.com/safari/)
		- [Opera](http://www.opera.com/)
		- [Edge](https://www.microsoft.com/en-us/windows/microsoft-edge)
		- [Netscape ;-)](https://en.wikipedia.org/wiki/Netspace)
	- Protocol
		- [HTTP/1.1](https://www.ietf.org/rfc/rfc2616.txt)
			- URI
			- Session
			- Authentication
			- Request
			- Response
		- HTTP/2
			- Compression
			- Encryption
			- Minification
			- Server Push
		- WebSocket
	- The 3 Pillars
		- HTML (HyperText Markup Language)
		- CSS (Cascading Style Sheets)
		- JavaScript
	- Standards
		- W3C
			- HTML
			- CSS
			- XHTML
			- XML
	- Core Concepts
		- HTML
			- DOM
			- Element
			- Attribute
		- JavaScript
			- Prototype
			- Scope
			- Closure
			- JSON (JavaSript Object Notation)
			- AJAX (Asynchronous JavaScript and XML)
		- CSS
			- Selector
			- Priority
			- Specificity
			- Box Model
	- Rendering Engine
		- [Trident (IE)](https://en.wikipedia.org/wiki/Trident_(layout_engine))
		- [Blink / prev. WebKit (Chrome)](http://www.chromium.org/blink)
		- [Gecko (Firefox)](https://developer.mozilla.org/en-us/docs/Mozilla/Gecko)
		- [WebKit (Safari)](http://www.webkit.org/)
		- [Blink / prev. Presto (Opera)](http://www.chromium.org/blink)
		- [EdgeHTML (Edge)](https://en.wikipedia.org/wiki/EdgeHTML)
	- JavaScript Engine
		- [JScript (IE8- / ASP)](https://en.wikipedia.org/wiki/JScript)
		- [Chakra (IE9+ / Edge)](https://en.wikipedia.org/wiki/Chakra_(JScript_engine))
		- [V8 (Chrome / Opera / Nodejs / MongoDB)](https://developers.google.com/v8/?hl=zh-CN)
		- [SpiderMonkey (Firefox)]( https://developer.mozilla.org/en-us/docs/Mozilla/Projects/SpiderMonkey)
		- [Nitro (Safari)](https://en.wikipedia.org/wiki/WebKit#JavaScriptCore)
	- Runtime
		- Cookie
		- Local Cache
		- Session Storage
		- Local Storage
		- Components
			- Extensions
			- Plugins
		- Resources
			- Images
			- Icons
			- Fonts
			- Audios
			- Videos
	- Editors
		- Sublime Text
		- WebStorm
		- Atom
		- Vim
		- Emacs
		- Brackets
		- Light Table
		- Visual Studio
		- Visual Studio Code
	- Build Tasks
		- Minification
		- Compilation
		- Concatenatio
		- Uglification
		- Image Optimization
		- Unit Testing
	- Build Tools
		- Grunt
		- Gulp
		- Brunch
		- Yeoman
		- Broccoli
	- Debug
		- Developer Tools
		- Firebug
	- Base Tools
		- Node.js
		- Phantom.js
	- Quality
		- JSLint
		- JSHint
		- [jscs](http://jscs.info/)
		- Closure Linter
	- Package
		- [npm](https://www.npmjs.com/)
		- [Bower](http://bower.io/)
	- Test
		- QUnit
		- [Jasmine](http://jasmine.github.io/)
		- [Mocha](https://mochajs.org/)
		- [Selenium](http://www.seleniumhq.org/)
		- [WebDriverIO](http://webdriver.io/)
		- [Protractor](http://www.protractortest.org/)
		- [Chai](http://chaijs.com/)
		- [Sinon.JS](http://sinonjs.org/)
		- [Karma](http://karma-runner.github.io/)
		- [nodeunit](https://github.com/caolan/nodeunit)
	- Frameworks / Libraries
		- JavaScript base library
			- [jQuery](https://jquery.com/)
			- [Prototype](http://prototypejs.org/)
			- [Zepto](http://zeptojs.com/)
			- [MooTool](http://mootools.net/)
			- [Underscore](http://underscorejs.org/)
		- Modular
			- ES6 Module
			- CommonJS
				- [webpack](http://webpack.github.io/)
				- [browserify](http://browserify.org/)
			- AMD
				- [RequireJS](http://requirejs.org/)
			- UMD
				- [umd](https://github.com/umdjs/umd)
		- JavaScript framework
			- [AngularJS](https://angularjs.org/)
			- [Backbone](http://backbonejs.org/)
			- [Knockout](http://knockoutjs.com/)
			- [Ember](http://emberjs.com/)
			- [React](http://facebook.github.io/react/)
			- [polymer](https://www.polymer-project.org/)
			- [Dojo](https://dojotoolkit.org/)
			- [Deft.js](http://deftjs.org/)
			- [Vue](http://vuejs.org/)
		- UI framework
			- [Bootstrap](http://getbootstrap.com/)
			- [ResponsiveGS](http://responsive.gs/)
			- [Semantic UI](http://semantic-ui.com/)
			- [Foundation](http://foundation.zurb.com/)
			- [Material UI](http://material-ui.com/)
			- [jQuery UI](http://jqueryui.com/)
		- WebSocket
			- [Socket.io](http://socket.io/)
			- [web-socket-js](https://github.com/gimite/web-socket-js)
		- Data Visualization
			- [D3](http://d3js.org/)
			- [Echarts](http://echarts.baidu.com)
			- [HighCharts](http://www.highcharts.com/)
			- [Vis.js](http://visjs.org/)
			- [Flot](http://www.flotcharts.org/)
		- WebGL
			- [Three.js](http://threejs.org/)
			- [Babylon.js](http://www.babylonjs.com/)
			- [Pixi.js](http://www.pixijs.com/)
		- CSS3 Animation
			- [Animate.css](https://daneden.github.io/animate.css/)
			- [bounce.js](http://bouncejs.com/)
			- [Effeckt.css](https://h5bp.github.io/Effeckt.css/)
			- [move.js](https://visionmedia.github.io/move.js/)
		- Flow Controller
			- ES6
				- Promise
				- Generator
			- ES7
				- yield
				- await
			- [async](https://github.com/caolan/async)
			- [co](https://github.com/tj/co)
			- Promise
				- [Bluebird](https://github.com/petkaantonov/bluebird)
				- [q](https://github.com/kriskowal/q)
				- [when.js](https://github.com/cujojs/when)
		- Functional
			- [backon.js](https://github.com/baconjs/bacon.js/)
			- [immutable.js](https://facebook.github.io/immutable-js/)
		- Mobile UI
			- [jQuery Mobile](https://jquerymobile.com/)
			- [Jo](http://joapp.com/)
			- WinkUI
			- [Dojo Mobile](https://dojotoolkit.org/reference-guide/1.10/dojox/mobile.html)
			- [Lungo](http://lungo.tapquo.com/)
	- CSS Pre-processors
		- LESS
			- [LESS](http://lesscss.org/)
			- [Hat](http://lesshat.madebysource.com/)
		- Sass(SCSS)
			- [Compass](http://compass-style.org/)
			- [Bourbon](http://bourbon.io/)
			- [Gumby](http://www.gumbyframework.com/)
		- Stylus
			- Nib
	- Template
		- Handlebars
		- Haml
		- Slim Ruby
		- Jade
		- Ejs
		- Spacebars
	- Modernisation
		- Normalize
		- Reset
	- Best Practices
		- SEO
		- Responsiveness
		- CDN
	- Security
		- Sandbox
		- XSS
		- CORS
	- Intermediate Languages
		- CoffeeScript
		- TypeScript
		- Dart
		- LiveScript
		- ClojureScript
	- Mobile App Builders
		- PhoneGap / Cordova
		- MUI
		- React Native
		- [Ionic](http://ionicframework.com/)

<!--BUILD_END-->