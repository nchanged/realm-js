var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var rename = require("gulp-rename");
var realm = require('./index.js');
var uglify = require('gulp-uglify');
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

gulp.task("build-test", function() {
   return gulp.src("test-app/src/**/*.js")
      .pipe(realm.transpiler.importify())
      .pipe(concat("build.js"))
      .pipe(babel())
      .pipe(realm.transpiler.universalWrap())
      .on('error', function(e) {
         console.log('>>> ERROR', e.stack);
         // emit here
         this.emit('end');
      })
      .pipe(gulp.dest("test-app/"))

});
