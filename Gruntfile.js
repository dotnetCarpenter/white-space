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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register building task
  grunt.registerTask('default', ['uglify']); // for convenience
  grunt.registerTask('build', ['uglify']);
}