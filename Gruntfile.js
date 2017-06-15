module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'sql-viewer/js/background.js', 'sql-viewer/js/content.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    exec: {
      pack: {
        command: 'google-chrome --pack-extension="sql-viewer/" --pack-extension-key="key.pem" && mv sql-viewer.crx sql-viewer.crx',
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
