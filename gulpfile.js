/**
 * Created by KlimMalgin on 27.09.2014.
 */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var deamdify = require('deamdify');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglifyjs');

var src = {
    index: ['./review/main.js'],
    js: 'review/*.js'
};

var dest = {
    js: 'build/js'
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
        insertGlobals : !env.production,
        debug : !env.production
    })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest(dest.js))
});

gulp.task('min', ['build'], function() {
    return gulp.src(dest.js + '/app.js')
        .pipe(uglify('app.min.js'))
        .pipe(gulp.dest(dest.js))
});

// The default task
gulp.task('default', ['scripts']);

gulp.task('build', ['scripts']);
