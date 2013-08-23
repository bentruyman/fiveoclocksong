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
      src: "test/**/*.*.js",
      options: {
        reporter: "spec",
        ui: "bdd"
      }
    },
    clean: ["app-cov", "coverage.html"],
    env: {
      coverage: { NODE_ENV: "development" },
      test:     { NODE_ENV: "test" }
    },
    exec: {
      coverage: {
        cmd: "mocha -R html-cov >> coverage.html"
      }
    },
    jshint: {
      all: ["app/**/*.js", "test/*.js"],
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

  grunt.registerTask("coverage", ["env:coverage", "blanket", "exec:coverage"]);
  grunt.registerTask("test", ["env:test", "jshint", "cafemocha"]);
  grunt.registerTask("all", ["test"]);
  grunt.registerTask("default", "test");
};
