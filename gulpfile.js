const { src, dest, parallel, series, watch } = require('gulp');

let stageDirname = 'public';

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
      baseDir: `${stageDirname}/`,
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
    .pipe(dest(`${stageDirname}/css/`))
    .pipe(browserSync.stream())
}

function scripts() {
  return src('src/app/index.js')
    .pipe(include({ hardFail: true }))
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(dest(`${stageDirname}/js/`))
    .pipe(browserSync.stream())
}

function pages() {
  return src('src/pages/*.html')
    .pipe(include({ hardFail: true }))
    .pipe(dest(`${stageDirname}/`))
    .pipe(browserSync.reload({ stream: true, }))
}

function copyFonts() {
  return src('src/core/assets/fonts/**/*')
    .pipe(dest(`${stageDirname}//assets/fonts/`))
}

function copyImages() {
  return src('src/core/assets/media/**/*')
    .pipe(dest(`${stageDirname}/assets/media/`))
}

async function copyResources() {
  copyFonts()
  copyImages()
}

async function clean() {
  return del.sync(`${stageDirname}/`, { force: true })
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

function setDevStage(finishTask) {
  stageDirname = 'dev';

  finishTask();
};

exports.browsersync = browsersync
exports.clean = clean
exports.scripts = scripts
exports.styles = styles
exports.pages = pages
exports.copyResources = copyResources

exports.default = series(
  setDevStage,
  parallel(
    clean,
    styles,
    scripts,
    copyResources,
    pages,
    browsersync,
    watching,
  ),
);

exports.build = series(
  clean,
  styles,
  scripts,
  copyResources,
  pages
)




