var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var rename = require("gulp-rename");
var realm = require('./index.js');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon')
gulp.task('watch', function() {
   gulp.watch(['src/**/*.js'], ['build']);
});

gulp.task("build", function() {
   return gulp.src("src/realm.js")
      .on('error', function(e) {
         console.log('>>> ERROR', e.stack);
         // emit here
         this.emit('end');
      })
      .pipe(gulp.dest("./build"))
      .pipe(rename("realm.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("./build"));
});

gulp.task('start', function() {
   nodemon({
      script: 'app.js',
      ext: 'js',
      ignore: ['build.js'],
      env: {
         'NODE_ENV': 'development'
      },
      tasks: ['build-test']
   })
})


gulp.task("build-test", function() {
   return gulp.src("test-app/src/**/*.js")
      .pipe(realm.transpiler.importify())
      .pipe(concat("test-build.js"))
      .pipe(babel({
         presets: ["es2016"],
         plugins : ["transform-decorators-legacy"]
      }))
      .pipe(realm.transpiler.universalWrap(true))
      .on('error', function(e) {
         console.log('>>> ERROR', e.stack);
         // emit here
         this.emit('end');
      })
      .pipe(gulp.dest(""))

});
