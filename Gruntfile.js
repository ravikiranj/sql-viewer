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
        command: 'google-chrome --pack-extension="src/" --pack-extension-key="key.pem" && mv src.crx sql-viwer.crx',
        stdout: true,
        stderr: true
      },
      zip: {
        command: 'cd src && zip -r sql-viewer.zip . && mv sql-viewer.zip ..',
        stdout: true,
        stderr: true
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
