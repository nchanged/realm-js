var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');
var rename = require("gulp-rename");
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
