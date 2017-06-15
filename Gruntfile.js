module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/js/background.js', 'src/js/content.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    exec: {
      pack: {
        command: 'google-chrome --pack-extension="src/" --pack-extension-key="key.pem" && mv src.crx sql-viewer.crx',
        stdout: true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('default', ['jshint']);

};
