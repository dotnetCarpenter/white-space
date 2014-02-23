module.exports = function(grunt) {
  grunt.initConfig({
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

  // Register building task
  grunt.registerTask('default', ['uglify', 'compress']); // for convenience
  grunt.registerTask('build', ['uglify', 'compress']);
}