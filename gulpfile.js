var path = require('path');
var gulp = require('gulp');
var del = require('del');
var plumber = require("gulp-plumber");
var notify = require('gulp-notify');

var eslint = require('gulp-eslint');
var webpack = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var { VueLoaderPlugin } = require("vue-loader");

var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');


// きれいきれい
    gulp.task('clean', () => {
        return del(['dist/*', '!dist', 'production/*', '!production']);
    });


// Sassコンパイル
    const complieSassCore = (is_production) => {
        const env = is_production ? 'production' : 'development';
        const dist = is_production ? './production/dist/' : './dist/';

        return gulp.src('./src/css/style.scss')
            .pipe(plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            }))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 2 version'],
                cascade: false
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(cssmin())
            .pipe(gulp.dest(dist));
    };
    gulp.task('compile:sass', () => {
        return complieSassCore(false);
    });
    gulp.task('complie:sass:production', () => {
        return complieSassCore(true);
    });


// Javascriptコンパイル
    const complieJsCore = (is_production) => {
        const env = is_production ? 'production' : 'development';
        const dist = is_production ? './production/dist/' : './dist/';

        return gulp.src('./src/**/*.js')
            .pipe(plumber({
              errorHandler: notify.onError("Error: <%= error.message %>")
            }))
            .pipe(webpack({
                mode: env,
                cache: is_production ? false : true,
                ...webpackConfig
            }))
            .pipe(gulp.dest(dist));
    };
    gulp.task('compile:js:production', () => {
        return complieJsCore(true);
    });
    gulp.task('compile:js', () => {
        return complieJsCore(false);
    });


// SASSとJSをまとめてコンパイル
    gulp.task('compile', gulp.series('clean', 'compile:js', 'compile:sass', () => {
        return gulp.src('src/img/**')
            .pipe(gulp.dest('dist/img/'));
    }));


// WATCH
    gulp.task('watch', () => {
        return gulp.watch(['./src/**/*.js', './src/**/*.vue', './src/css/**/*.scss'], gulp.series(['compile']));
    });


// 公開用パッケージ作成用タスク
    gulp.task('build', gulp.series('clean', 'complie:sass:production', 'compile:js:production', () => {
        return gulp.src('manifest.json')
            .pipe(gulp.dest('production'));
    }, () => {
        return gulp.src('src/img/icon/**')
            .pipe(gulp.dest('production/dist/img/icon'));
    }))
