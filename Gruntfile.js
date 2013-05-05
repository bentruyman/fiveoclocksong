module.exports = function (grunt) {
  grunt.initConfig({
    blanket: {
      instrument: {
        options: {
          debug: true
        },
        files: {
          "app-cov/": ["app/"]
        }
      }
    },
    cafemocha: {
      src: "test/**/*.js",
      options: {
        reporter: "spec",
        ui: "bdd"
      }
    },
    clean: ["app-cov", "coverage.html"],
    env: {
      test: {
        NODE_ENV: "test"
      }
    },
    exec: {
      coverage: {
        cmd: "mocha -R html-cov >> coverage.html"
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

  grunt.loadNpmTasks("grunt-blanket");
  grunt.loadNpmTasks("grunt-cafe-mocha");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask("test", ["env:test", "jshint", "blanket", "exec:coverage", "cafemocha"]);
  grunt.registerTask("all", ["test"]);
  grunt.registerTask("default", "test");
};
