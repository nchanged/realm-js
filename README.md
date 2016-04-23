# realm-js
RealmJs is a new dependency injection/module handling tool for Node.js and javascript projects. The library is universal (isomorphic). You can easily share modules between frontend and backend accordingly.

## Introduction
Real.js comes with an absolutely superb transpiler, which resembles es6 imports. It essentially has the same syntax but with few improvements

```js
module app.components.SecondComponent;

import UserInteractionUtils as myUtls from app.helpers;
import SuperUtils as utils from app.helpers;

export class {

}
```

### Install
```
npm install realm-js --save
```

Check a simple [project](test-app/src/app/) and see what it compiles into [test-app/build.js](test-app/build.js) (with a little help from babel es6)

If you want to serve realm.js you can just use express middleware

```js
app.use('/ream.js', realm.serve.express());
```
To get contents (for build)
```js
realm.serve.getContents()
```

## Under the hood

### Creating modules/services
Everything revolves around ec6 promises. Say we define a module
```js
realm.module("MyFirstModule", function() {
   return new Promise(function(resolve, reject){
      return resolve({hello : "world"})
   });
});
realm.module("MySecondModule", function(MyFirstModule) {
   console.log(MyFirstModule);
});
```

### Require a module
Code:
```js
realm.require(function(MySecondModule){
   console.log(MySecondModule)
});
```

Will resolve all required dependencies. The ouput:
```js
{hello: "world"}
```

### Require a package
You can require a package if you like.

```js
realm.requirePackage("app.components").then(function(components){

});
```

### Annotation
Clearly, if you don't use ec6, or any other transpilers, you need to annotate modules
```js
realm.module("myModule", ["moduleA", "moduleB"], function(moduleA, moduleB){

})
```

## Porting your favorite libraries
Universal wrapper has a parameter called isNode.
So, if you want to import lodash (my favorite) or any other libaries. you can register them like so:

```js
domain.module("shared._", function() {
   return isNode ? require("lodash") : window._;
});
domain.module("shared.realm", function() {
   return isNode ? require("realm-js") : window.realm;
});

```

And here comes the juice:
```js
module Test;

import _, realm from shared
export () => {

}
```

## Using the realm transpiler

The current transpiler is a very simple regExp like script. (I am not sure if i can call transpiler though).
I have been using this library for years, and decided to release just now. I've tried to create a babel plugin, but this thing is just ginormous and i simply don't have time for that. If you feel like, go ahead!

### A simple import
If a module does not belong to any package:
```js
import Module
```

If a module belongs to a package:
```js
import Module from app
```

Giving it alias
```js
import Module as mod from app
```


### Gulp
```js
realm.transpiler.importify()
```

## Bulding

You can use babel to transpile your code into anything you like. (RealmJs transpiler should come first)

Here is a sample build script;

```js
var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var rename = require("gulp-rename");
var realm = require('realm-js');
var uglify = require('gulp-uglify');

gulp.task("build-test", function() {
   return gulp.src("test-app/src/**/*.js")
      .pipe(realm.transpiler.importify())
      .pipe(concat("build.js"))
      .pipe(babel())
      .pipe(realm.transpiler.universalWrap())
      .on('error', function(e) {
         console.log('>>> ERROR', e.stack);
         this.emit('end');
      })
      .pipe(gulp.dest("test-app/"))
});
```

## Contribute
Please, contribute. The code isn't in its best shape. (Developed it few years ago). Release with few improvements, made it universal and added the "transpiler". Change the world!
