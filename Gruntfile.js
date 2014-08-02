module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: [
                    'src/prefix.js',
                    'src/Morphine.js',
                    'src/Build.js',
                    'src/Merge.js',
                    'src/Stringify.js',
                    'src/Common.js',
                    'src/postfix.js'
                ],
                dest: 'build/<%= pkg.name %>.<%= pkg.version %>.js'
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
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};