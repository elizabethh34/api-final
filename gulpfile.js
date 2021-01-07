const { src, dest, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist'))
}

function stylesTask() {
  return src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(dest('dist/css'))
}

function scriptsTask() {
  return src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(concat('app.js'))
    .pipe(dest('dist/js'))
}

exports.html = htmlTask;
exports.styles = stylesTask;
exports.scripts = scriptsTask;
exports.default = parallel(htmlTask, stylesTask, scriptsTask);