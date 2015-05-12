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
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
var imagemin = require('gulp-imagemin');
var ngTemplateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var useref = require('gulp-useref');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var ngAnnotate = require('gulp-ng-annotate');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var bump = require('gulp-bump');
var browserSync = require('browser-sync');
var path = require('path');
var _ = require('lodash');
var port = process.env.PORT || config.defaultPort;

gulp.task('help', taskListing);
gulp.task('default', ['help']);

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
        .pipe(autoprefixer({browsers: ['last 2 version', '> 2%']})) //optional
        .pipe(gulp.dest(config.temp));
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});

gulp.task('images', ['clean-images'], function() {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe(imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('templatecache', ['clean-code'], function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe(minifyHtml({empty: true}))
        .pipe(ngTemplateCache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
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

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe(inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

/* BUILD PROJECT */
//To learn
gulp.task('build', ['optimize', 'images'], function() {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    del(config.temp);
    log(msg);
    notify(msg);
});

//To learn
gulp.task('optimize', ['inject', 'test'], function() {
    log('Optimizing the javascript, css, html');

    var assets = useref.assets({searchPath: './'});
    var templateCache = config.temp + config.templateCache.file;
    var cssFilter = filter('**/*.css');
    var jsLibFilter = filter('**/' + config.optimized.lib);
    var jsAppFilter = filter('**/' + config.optimized.app);

    return gulp
        .src(config.index)
        .pipe(plumber())
        .pipe(inject(
            gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore())
        .pipe(jsLibFilter)
        .pipe(uglify())
        .pipe(jsLibFilter.restore())
        .pipe(jsAppFilter)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(jsAppFilter.restore())
        .pipe(rev())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulp.dest(config.build))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.build));
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        type = type ? type : 'patch';
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe(gPrint())
        .pipe(bump(options))
        .pipe(gulp.dest(config.root));
});
/* END OF BUILD PROJECT */

/* RUN PROJECT */
gulp.task('serve-build', ['build'], function() {
    serve(false /* isDev */);
});

gulp.task('serve-build-direct', function() {
    serve(false /* isDev */);
});

gulp.task('serve-dev', ['inject'], function() {
    serve(true /* isDev */);
});
/* END OF RUN PROJECT */

/* TESTING */
gulp.task('test', ['vet', 'templatecache'], function(done) {
    startTests(true /* singleRun */, done);
});

gulp.task('autotest', ['vet', 'templatecache'], function(done) {
    startTests(false /* singleRun */, done);
});

//To learn
gulp.task('serve-specs', ['build-specs'], function(done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

//To learn
gulp.task('build-specs', ['templatecache'], function() {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    var specs = config.specs;

    options.devDependencies = true;

    if (args.startServers) {
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }

    return gulp
        .src(config.specRunner)
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(config.testlibraries),
            {name: 'inject:testlibraries', read: false}))
        .pipe(inject(gulp.src(config.js)))
        .pipe(inject(gulp.src(config.specHelpers),
            {name: 'inject:spechelpers', read: false}))
        .pipe(inject(gulp.src(specs),
            {name: 'inject:specs', read: false}))
        .pipe(inject(gulp.src(config.temp + config.templateCache.file),
            {name: 'inject:templates', read: false}))
        .pipe(gulp.dest(config.client));
});
/* END OF TESTING */

/* CLEANING TASKS */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + gutil.colors.green(delconfig));
    del(delconfig, done);
});

gulp.task('clean-styles', function(done) {
    var files = config.temp + '**/*.css';
    clean(files, done);
});

gulp.task('clean-images', function(done) {
    clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});
/* END OF CLEANING TASKS */

/////////////////////
//UTILITY FUNCTIONS//
////////////////////

function serve(isDev, specRunner) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}

function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    if (isDev) {
        gulp.watch([config.less], ['styles'])
            .on('change', changeEvent);
    } else {
        gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };

    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}

function startTests(singleRun, done) {
    log('Start Tests');

    var child;
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var excludeFiles = [];
    var serverSpecs = config.serverIntegrationSpecs;

    if (args.startServers) { // gulp test --startServers
        log('Starting server');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'DEV';
        savedEnv.PORT = 8888;
        child = fork(config.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    function karmaCompleted(karmaResult) {
        log('Karma completed!');
        if (child) {
            log('Shutting down the child process');
            child.kill();
        }
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

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
