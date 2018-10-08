var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require("gulp-plumber");

// lessコンパイルタスク
gulp.task('compile', function(){
  return gulp.src('less/style.less')
    .pipe(plumber())
    .pipe(less()).pipe(gulp.dest('css'));
});

// デフォルトタスク
// src の less が変更されたら、lessコンパイルタスクを実行。
gulp.task('default', function(){
  return gulp.watch('less/*.less', gulp.series('compile'));
});
