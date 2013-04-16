module.exports = function (grunt) {
  grunt.initConfig({
    cafemocha: {
      src: "test/**/*.js",
      options: {
        ui: "bdd",
        require: ["rewire", "should", "sinon"]
      }
    },
    jshint: {
      all: "app/**/*.js",
      options: {
        jshintrc: ".jshintrc"
      }
    },
    watch: {
      scripts: {
        files: ["app/**/*.js", "test/**/*.js"],
        tasks: ['default'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-cafe-mocha");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["jshint", "cafemocha"]);
};
