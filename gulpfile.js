var gulp = require('gulp')
var gutil = require('gulp-util')
var watch = require('gulp-watch')
var plugins = require('gulp-load-plugins')()
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var stripDebug = require('gulp-strip-debug')
var mainBowerFiles = require('main-bower-files')
var filter = require('gulp-filter')
var order = require('gulp-order')
var cleanCss = require('gulp-clean-css')
var concatCss = require('gulp-concat-css')
var pug = require('gulp-pug')
var templateCache = require('gulp-angular-templatecache')
var sequence = require('gulp-sequence')
var plumber = require('gulp-plumber')
var less = require('gulp-less')
var multiProcess = require('gulp-multi-process')
var babel = require('gulp-babel')

gulp.task('default', function () {
  return gutil.log('Gulp is running!')
})

gulp.task('default', ['watch'])

gulp.task('watch', function () {
  watch('public/stylesheets/less/*.less', function () {
    // multiProcess(['build-less'], function () {});
    multiProcess(['build-all'], function () {})
  })

  watch('views/templates/*.pug', function () {
    // gulp.start('build-pug-templatecache');
    multiProcess(['build-all'], function () {})
  })

  watch('public/javascripts/src/*.js', function () {
    // gulp.start('build-src');
    multiProcess(['build-all'], function () {})
  })
})

gulp.task('build-all', function (callback) {
  sequence('build-scrolls', 'build-spells')(callback)
})

/**
 * SCROLLS
 */

gulp.task('build-scrolls', function (callback) {
  sequence('build-less', 'build-css')(callback)
})

gulp.task('build-less', function () {
  return gulp
    .src('public/stylesheets/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .on('error', function (err) {
      gutil.log(err)
      this.emit('end')
    })
    .pipe(plugins.autoprefixer({
      browsers: [
        '> 1%',
        'last 2 versions',
        'firefox >= 4',
        'safari 7',
        'safari 8',
        'IE 8',
        'IE 9',
        'IE 10',
        'IE 11'
      ],
      cascade: false
    }))
    .pipe(gulp.dest('public/stylesheets/css'))
    .on('error', gutil.log)
})

gulp.task('build-css', function () {
  var cssFiles = ['public/stylesheets/css/*.css', 'bower_components/bootstrap/dist/css/bootstrap.min.css']

  var ignoreBowerComponents = []

  function mainBowerFilesFilter(filePath) {
    var i
    for (i = 0; i < ignoreBowerComponents.length; i++) {
      if (filePath.indexOf(ignoreBowerComponents[i]) !== -1) return false
    }
    return true
  }

  return gulp
    .src(mainBowerFiles({
      filter: mainBowerFilesFilter
    }).concat(cssFiles))
    .pipe(filter('**/*.css'))
    .pipe(order(['public/stylesheets/css/style.css']))
    .pipe(concatCss('scrolls.min.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('public/stylesheets/dist'))
    .on('error', gutil.log)
})

/**
 * SPELLS
 */

gulp.task('build-spells', function (callback) {
  sequence('build-pug-templatecache', 'build-src', 'build-js')(callback)
})

gulp.task('build-pug-templatecache', function (callback) {
  sequence('build-pug', 'build-templatecache')(callback)
})

gulp.task('build-pug', function () {
  var templateFiles = ['views/templates/*.pug']
  return gulp
    .src(templateFiles)
    .pipe(pug())
    .pipe(gulp.dest('views/html/'))
    .on('error', gutil.log)
})

gulp.task('build-templatecache', function () {
  return gulp
    .src('views/html/*.html')
    .pipe(templateCache('templates.js', {
      standalone: true,
      module: 'templates'
    }))
    .pipe(gulp.dest('public/javascripts/build/'))
    .on('error', gutil.log)
})

gulp.task('build-src', function () {
  return gulp
    .src('public/javascripts/src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('public/javascripts/build/'))
    .on('error', gutil.log)
})

gulp.task('build-js', function () {
  var jsFiles = [
    'public/javascripts/build/*.js',
    'public/javascripts/resources/*.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
  ]
  var ignoreBowerComponents = []

  // http://stackoverflow.com/questions/34547873/exclude-a-folder-from-main-bower-files?lq=1
  function mainBowerFilesFilter(filePath) {
    var i
    for (i = 0; i < ignoreBowerComponents.length; i++) {
      if (filePath.indexOf(ignoreBowerComponents[i]) !== -1) return false
    }
    return true
  }

  return gulp
    .src(mainBowerFiles({
      filter: mainBowerFilesFilter
    }).concat(jsFiles))
    .pipe(filter('**/*.js'))
    // .pipe(stripDebug())
    .pipe(concat('spells.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts/dist/'))
    .on('error', gutil.log)
})

function onError(err) {
  console.log(err)
  this.emit('end')
}
