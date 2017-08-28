'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var DEST = 'build/';



// add custom browserify options here
var customOpts = {
    entries: ['./src/js/main.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('uglify', function() {
    return gulp.src('./dist/js/**/*')
    // This will output the non-minified version
    // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(DEST));
});

gulp.task('clean', function() {
    return gulp.src('dist/**/*', {read: false})
        .pipe(clean({force: true}));
});


// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle () {
    b.bundle()
    // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist'));
    copyStuff();
}

function copyStuff () {
    gulp.src('./src/{css,fonts,vendor,img}/**/*')
        .pipe(gulp.dest('./dist'));

    gulp.src('./assets/**/*')
        .pipe(gulp.dest('./dist'));

    gulp.src('./src/*')
        .pipe(gulp.dest('./dist'));

    gulp.src('./src/js/**/*')
        .pipe(gulp.dest('./dist/js'));
}