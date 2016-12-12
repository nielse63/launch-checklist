
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var lec = require('gulp-line-ending-corrector');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-register');

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src(['lib/**/*.js', '!lib/cli.js'])
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src([
      'test/**/*.js',
      // 'test/*.js',
    ])
    .pipe(plumber())
    .pipe(mocha())
    .on('error', function (err) {
      // console.trace(err)
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('line-ending-corrector', function () {
  return gulp.src('lib/cli.js')
    .pipe(excludeGitignore())
    .pipe(lec())
    .pipe(gulp.dest('.'));
});

gulp.task('cli', function () {
  return gulp.src('lib/cli.js')
    // .pipe(excludeGitignore())
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch(['lib/**/*.js', 'test/**'], ['babel']);
  gulp.watch(['lib/cli.js'], ['cli']);
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('babel', ['clean'], function () {
  return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('prepublish', ['nsp', 'line-ending-corrector', 'babel']);
gulp.task('default', ['test', 'coveralls']);
