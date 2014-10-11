/**
 * Created by KlimMalgin on 27.09.2014.
 */
'use strict';

var gulp = require('gulp');
var deamdify = require('deamdify');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglifyjs');

var src = {
    index: ['./src/Morphine.js'],
    js: 'review/*.js'
};

var dest = {
    js: 'build/'
};

var env = {
    production : argv.production || false
};

gulp.task('scripts', function() {

    // Main entry point
    return browserify(src.index, {
        transform: [
            'deamdify'
        ],
        insertGlobals : false, //!env.production,
        debug : false   //!env.production
    })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(dest.js))
});

gulp.task('min', function() {
    return gulp.src(src.index)
        .pipe(uglify('Morphine.min.js'))
        .pipe(gulp.dest(dest.js))
});


// The default task
gulp.task('default', ['min']);

gulp.task('build', ['min']);
