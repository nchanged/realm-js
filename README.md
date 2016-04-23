# realm-js
RealmJs is a new dependency injection/module handling tool for Node.js and javascript projects.

## Introduction
Real.js comes with an absolutely superb transpiler, which resemble es6 imports. It essentially has the same syntax but with few improvements

```js
module app.components.SecondComponent;

import UserInteractionUtils as myUtls from app.helpers;
import SuperUtils as utils from app.helpers;

export class {

}
```

Check a simple [project](test-app/src/app/) and see what it compiles into [test-app/build.js](test-app/build.js)

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
