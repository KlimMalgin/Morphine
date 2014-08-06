module.exports = function(grunt) {

    var sourceFiles = [
        'src/prefix.js',
        'src/Morphine.js',
        'src/Build.js',
        'src/Merge.js',
        'src/Stringify.js',
        'src/Converter.js',
        'src/PathGenerator.js',
        'src/Common.js',
        'src/postfix.js'
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: sourceFiles,
                dest: 'build/<%= pkg.name %>.<%= pkg.version %>.js'
            },
            test: {
                src: sourceFiles,
                dest: 'tests/<%= pkg.name %>.js'
            }
        },
        uglify: {
            /*options: {
                banner: '*//* <%= pkg.name %>\n <%= pkg.description %>\nBuild Date: <%= grunt.template.today("yyyy-mm-dd")\nAuthor: Brunetkin Andrey %> *//*\n'
            },*/
            build: {
                src: 'build/<%= pkg.name %>.<%= pkg.version %>.js',
                dest: 'build/<%= pkg.name %>.<%= pkg.version %>.min.js'
            }
        },
        qunit: {
            files: ['tests/index.html']
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-qunit');

    // grunt-contrib-qunit
    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

    grunt.registerTask('test', 'qunit');

};