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
        command: 'google-chrome --pack-extension="sql-viewer/" --pack-extension-key="key.pem"',
        stdout: true
      },
      zip: {
        command: 'cd sql-viewer && zip -r sql-viewer.zip . && mv sql-viewer.zip ..',
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
