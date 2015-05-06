var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var gutil = require('gulp-util');
var config = require('./gulp.config')();
var args = require('yargs').argv;
var gIf = require('gulp-if');
var gPrint = require('gulp-print');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var plumber = require('gulp-plumber');
var inject = require('gulp-inject');

gulp.task('vet', function(){
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe(gIf(args.verbose, gPrint()))
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe(jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling Less to CSS');

    return gulp
        .src(config.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 2 version', '> 2%']}))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(done) {
    var files = config.temp + '**/*.css';
    clean(files, done);
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe(inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

/**
 * serve the dev environment, with debug,
 * and with node inspector
 */
gulp.task('serve-dev-debug', function() {
    serve({
        mode: 'dev',
        debug: '--debug'
    });
});

/**
 * serve the dev environment, with debug-brk,
 * and with node inspector
 */
gulp.task('serve-dev-debug-brk', function() {
    serve({
        mode: 'dev',
        debug: '--debug-brk'
    });
});

/**
 * serve the dev environment
 */
gulp.task('serve-dev', function() {
    serve({
        mode: 'dev'
    });
});

/**
 * serve the build environment
 */
gulp.task('serve-build', function() {
    serve({
        mode: 'build'
    });
});

/**
 * Backwards compatible call to make stage and build equivalent
 */
gulp.task('serve-stage', ['serve-build'], function() {});

/////////////////////
//UTILITY FUNCTIONS//
////////////////////
function clean(path, done) {
    log('Cleaning: ' + gutil.colors.green(path));
    del(path, done);
}

function log(msg){
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gutil.log(gutil.colors.green(msg[item]));
            }
        }
    } else {
        gutil.log(gutil.colors.green(msg));
    }
}
