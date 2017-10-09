const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const stripComments = require('gulp-strip-comments');
const isProduction = process.env.NODE_ENV === 'production';
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

function addJSFolder(name, src, prependSrc = []) {
  if (typeof prependSrc === 'string') prependSrc = [prependSrc];

  return gulp
    .src(src)
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat(`${name}.js`))
    .pipe(stripComments())
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest('./public/js'))
}

gulp.task('vendor', () =>
  addJSFolder('vendor', './app/assets/js/vendor/*.js', [])
);

gulp.task('app', () =>
  addJSFolder('app', './app/assets/js/*.js', [])
);

gulp.task('styles', () =>
  gulp.src([
    './app/assets/scss/**/*.css',
  ])
  .pipe(gulpif(!isProduction, sourcemaps.init()))
  .pipe(
    sass({
      outputStyle: isProduction ? 'compressed' : 'expanded',
    })
    .on('error', sass.logError)
  )
  .pipe(gulpif(!isProduction, sourcemaps.write({ includeContent: false })))
  .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ios 6', 'android 4'))
  .pipe(gulpif(!isProduction, sourcemaps.write()))
  .pipe(gulp.dest(`${sassPaths.dest}`))
);

gulp.task('build', [
  'vendor',
  'app',
]);

gulp.task('watch', () => {
  gulp.watch(`./app/assets/scss/**/*.scss`, ['styles']);
  gulp.watch(`./app/assets/js/**/*.js`, ['vendor', 'app']);
});

