const { src, dest, parallel, series, watch } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');

const babel = require('gulp-babel');

const del = require('del');
const browserSync = require('browser-sync').create();
const include = require('gulp-include');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'public/',
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    port: 8080,
    ui: { port: 8081 },
    open: true,
  })
}

function styles() {
  return src('src/app/index.+(scss|sass)')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      grid: true,
      overrideBrowserslist: ['last 10 version'],
    }))
    .pipe(gcmq())
    .pipe(dest('public/css/'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('src/app/index.js')
    .pipe(include({ hardFail: true }))
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(dest('public/js/'))
    .pipe(browserSync.stream())
}

function pages() {
  return src('src/pages/*.html')
    .pipe(include({ hardFail: true }))
    .pipe(dest('public/'))
    .pipe(browserSync.reload({ stream: true, }))
}

function copyFonts() {
  return src('src/core/assets/fonts/**/*')
    .pipe(dest('public/assets/fonts/'))
}

function copyImages() {
  return src('src/core/assets/media/**/*')
    .pipe(dest('public/assets/media/'))
}

async function copyResources() {
  copyFonts()
  copyImages()
}

async function clean() {
  return del.sync('public/', { force: true })
}

function watching() {
  watch(['src/app/index.js', 'src/components/**/*.js'], scripts)
  watch(['src/app/index.+(scss|sass)', 'src/core/**/*.+(scss|sass)', 'src/components/**/*.+(scss|sass)'], styles).on(
    'change',
    browserSync.reload
  )
  watch(['src/pages/*.html', 'src/components/**/*.html'], pages).on(
    'change',
    browserSync.reload
  )
}

exports.browsersync = browsersync
exports.clean = clean
exports.scripts = scripts
exports.styles = styles
exports.pages = pages
exports.copyResources = copyResources

exports.default = parallel(
  clean,
  styles,
  scripts,
  copyResources,
  pages,
  browsersync,
  watching,
)

exports.build = series(
  clean,
  styles,
  scripts,
  copyResources,
  pages
)




