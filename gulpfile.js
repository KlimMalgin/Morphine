/**
 * Created by KlimMalgin on 27.09.2014.
 */
'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var argv = require('yargs').argv;
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglifyjs');

var src = {
    index: ['./src/Morphine.dev.js']
};

var dest = {
    js: 'build/',
    test: 'tests/'
};

var names = {
    buildName: 'Morphine.js',
    globalVar: 'Morphine'
};

var env = {
    production : argv.production || false
};

function morphineBuild (production) {
    return gulp.src(src.index)
        .pipe(uglify(names.buildName, {
            mangle: false,
            wrap: names.globalVar,
            exportAll: !production
        }))
        .pipe(gulp.dest(production ? dest.js : dest.test));
}

gulp.task('build', function() {
    return morphineBuild(true);
});

gulp.task('test-build', function() {
    return morphineBuild(false);
});

gulp.task('default', ['build', 'test-build']);
