module.exports = function (grunt) {
  grunt.initConfig({
    cafemocha: {
      src: "test/**/*.js",
      options: {
        ui: "bdd",
        require: ["should"]
      }
    },
    jshint: {
      all: "app/**/*.js",
      options: {
        jshintrc: ".jshintrc"
      }
    }
  });

  grunt.loadNpmTasks("grunt-cafe-mocha");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("default", ["jshint", "cafemocha"]);
};
