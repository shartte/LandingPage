module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        /*
         Watch filesystem changes and recompile / reload the browser.
         Used in conjunction with the built-in server.
         */
        watch: {
            assemble: {
                files: ['src/**/*.hbs'],
                tasks: ['assemble']
            },
            less: {
                files: ['src/assets/*.less'],
                tasks: ['less']
            },
            imagemin: {
                files: ['src/assets/**/*.{jpg,png,gif}'],
                tasks: ['imagemin']
            },
            uglify: {
                files: ['src/assets/*.js'],
                tasks: ['uglify']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'dist/{,*/}*.html',
                    'dist/assets/{,*/}*.css',
                    'dist/assets/{,*/}*.js',
                    'dist/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        /*
         A built-in server to serve the compiled files.
         */
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: ['dist']
                }
            }
        },

        assemble: {
            pages: {
                options: {
                    flatten: true,
                    data: 'data/launcherReleases.json',
                    partials: ['src/partials/*.hbs'],
                    helpers: ['./json-helper.js']
                },
                files: {
                    'dist/': ['src/index.hbs']
                }
            }
        },

        copy: {
            noto: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        cwd: 'bower_components/webfont-notosans/',
                        src: ["**/*.{eot,ttf,woff}"],
                        dest: 'dist/assets/'
                    }
                ]
            },
            fontawesome: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        cwd: 'bower_components/fontawesome/fonts',
                        src: ["**/*.{eot,ttf,woff}"],
                        dest: 'dist/fonts/'
                    }
                ]
            },
            favicon: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        src: 'favicon/*',
                        dest: 'dist/'
                    }
                ]
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['assets/**/*.{png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },

        less: {
            dist: {
                compress: true,
                // The hope is that less uses the optimized images for data-uri
                paths: ["dist/assets/", "src/assets/"],
                files: {
                    "dist/assets/style.css": ["src/assets/*.less"],
                    "dist/assets/vendor.css": [
                        "bower_components/normalize.css/normalize.css",
                        "bower_components/fontawesome/css/font-awesome.css",
                        "bower_components/webfont-notosans/**/*.css"
                    ]
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            build: {
                expand: true,
                cwd: 'dist/',
                src: ['assets/*.css'],
                dest: 'dist/'
            }
        },

        uglify: {
            build: {
                files: {
                    'dist/assets/scripts.js': ['src/assets/*.js'],
                    'dist/assets/vendor.js': ['bower_components/jquery/dist/jquery.js', 'bower_components/ua-parser-js/src/ua-parser.js']
                }
            }
        },

        clean: {
            embedded: ['dist/assets/embedded'],
            dist: ['dist']
        }

    });

    grunt.loadNpmTasks('assemble');

    grunt.registerTask("launcher-releases", require('./launcher-releases.js'));

    grunt.registerTask('server', [
        'build',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'imagemin',
        'less',
        'clean:embedded',
        'autoprefixer',
        'uglify',
        'launcher-releases',
        'assemble'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};
