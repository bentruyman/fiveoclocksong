module.exports = function (grunt) {
  grunt.initConfig({
    cafemocha: {
      src: "test/**/*.js",
      options: {
        require: ["rewire", "should", "sinon"],
        reporter: "spec",
        ui: "bdd"
      }
    },
    env: {
      test: {
        NODE_ENV: "test"
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
        files: ["Gruntfile.js", "config/*.js*", "app/**/*.js", "test/**/*.js"],
        tasks: ["test"],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-cafe-mocha");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-env");

  grunt.registerTask("test", ["env:test", "jshint", "cafemocha"]);
  grunt.registerTask("default", "test");
};
