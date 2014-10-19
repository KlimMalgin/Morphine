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
    index: ['./Morphine.js']
};

var dest = {
    js: 'build/',
    test: 'tests/'
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
        .pipe(uglify('Morphine.min.js', {
            mangle: false
        }))
        .pipe(gulp.dest(dest.js))
        .pipe(gulp.dest(dest.test));
});


// The default task
gulp.task('default', ['min']);

gulp.task('build', ['min']);
