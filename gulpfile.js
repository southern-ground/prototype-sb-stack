var pkg = require('./package.json'),
    dirs = pkg['h5bp-configs'].directories;
    // config;

var fs = require('fs'),
    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    print = require('gulp-print'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    dataFile = dirs.src + '/data/sg-nashville.json';
    // data = require('gulp-data')

var getData = function () {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
};

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean', function (done) {
    require('del')([
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', function(){
    return gulp.src([
        // Copy all files
        dirs.src + '/**/*',
        // Excluding:
        '!' + dirs.src + '/data',
        '!' + dirs.src + '/data/**/*',
        '!' + dirs.src + '/sass',
        '!' + dirs.src + '/sass/**/*',
        '!' + dirs.src + '/.*.*',
        '!' + dirs.src + '/*git*.*',
        '!' + dirs.src + '/browserconfig.xml',
        '!' + dirs.src + '/crossdomain.xml'
    ]).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy-css', function(){
    return gulp.src(dirs.src + '/css/**/*')
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy-js', function(){
    return gulp.src(dirs.src + '/js/**/*')
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('lint:js', function () {
    // 'gulpfile.js',
    return gulp.src([
        dirs.src + '/js/*.js'
    ]).pipe(plugins.jscs())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('git-revision', function () {
    var targetFile = "./src/rev.html";
    var command = "git rev-list HEAD --max-count=1 --format='%ci' > " + targetFile;
    shell.task(command);
});

gulp.task('sass', function () {
    return gulp.src([dirs.src + '/sass/**/*.scss', '!' + dirs.src + '/sass/**/_*.scss'])
        .pipe(print(function (filepath) {
            return "\tsassing " + filepath;
        }))
        .pipe(sass())
        .pipe(gulp.dest(dirs.src + '/css'));
});

gulp.task('serve', function () {

    browserSync.init({server: "./dist"});

    gulp.watch([dirs.src + "/*.html", dirs.src + "/data/**/*.json"], function () {
        runSequence('copy');
    });

    gulp.watch([dirs.src + "/sass/**/*.scss"], function () {
        runSequence('sass', 'copy-css');
    });

    gulp.watch([dirs.src + "/js/**/*.js"], function () {
        runSequence('lint:js', 'copy-js');
    });

    gulp.watch(["dist/*.html", dirs.src + "/css/**/*.css", dirs.src + '/js/*']).on('change', browserSync.reload);

});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', function (done) {
    runSequence(
        ['clean', 'lint:js', 'sass', 'git-revision'],
        'copy',
        done);
});

 gulp.task('default', function () {
    runSequence('build', 'serve', function () {
        console.log('Default task complete.');
    });
});
