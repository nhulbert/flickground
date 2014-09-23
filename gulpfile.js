var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var sources = ['./src/main.js'];
var destination = gulp.dest('./');
var onError = function(error) {
  gutil.log(gutil.colors.red(error.message));
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('prod', function() {
  return browserify('./src/main.js')
    .bundle()
    .on('error', onError)
    .pipe(source('chessground.min.js'))
    .pipe(streamify(uglify()))
    .pipe(destination);
});

gulp.task('dev', function() {
  var opts = watchify.args;
  opts.debug = true;
  opts.standalone = 'Chessground';

  var bundleStream = watchify(browserify(sources, opts))
    .on('update', rebundle)
    .on('log', gutil.log);

  function rebundle() {
    return bundleStream.bundle()
      .on('error', onError)
      .pipe(source('chessground.js'))
      .pipe(destination);
  }

  return rebundle();
});

gulp.task('default', ['dev']);
