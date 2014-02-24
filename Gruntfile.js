module.exports = function(grunt) {
  grunt.initConfig({
    bwr: grunt.file.readJSON('bower.json'),
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
       options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> version <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      my_target: {
        files: {
          'white-space.min.js': ['white-space.js'],
          'white-space-fast.min.js': ['white-space-fast.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip',
          pretty: true
        },
        expand: true,
        src: ['*.min.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  /* check if we remembered to sync versions in bower.json and package.json,
   * the version from package.json is written in the banner */
  grunt.registerTask('version', 'Test bower.json and package.json versions', function version() {
    grunt.log.write('Checking if versions are in sync...');
    grunt.config.requires('bwr.version');
    grunt.config.requires('pkg.version');
    if( grunt.config.data.bwr.version === grunt.config.data.pkg.version ) {
      grunt.log.ok();
      return true;
    } else {
      grunt.log.writeln("");
      grunt.log.error(
        'bower.json version '
       + grunt.config.data.bwr.version
       + ' is not in sync with package.json version '
       + grunt.config.data.pkg.version
       + '.'
      );
      return false;
    }
  });

  // Register building task
  grunt.registerTask('default', ['uglify', 'compress']); // for convenience
  grunt.registerTask('build', ['uglify', 'compress']);
}