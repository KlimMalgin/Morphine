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
var require_bundler = require("gulp-requirejs-bundler");
var rjs = require('gulp-requirejs');

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
        insertGlobals : false, //!env.production,
        debug : false   //!env.production
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

gulp.task('rjs', function() {
    rjs({
        name: 'main',
        baseUrl: './rjs',
        out: 'rjs.js'
    })
    .pipe(gulp.dest('./build/delpoy/')); // pipe it to the output DIR
});

// The default task
gulp.task('default', ['scripts']);

gulp.task('build', ['scripts']);
