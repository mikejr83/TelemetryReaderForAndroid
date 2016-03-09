var child_process = require('child_process');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var q = require('q');

var paths = {
  sass: ['./scss/**/*.scss']
};

function resetPlugins() {
  return q.Promise(function(resolve, reject) {
	  child_process.exec('ionic plugin rm com.monstarmike.telemetry.plugins.tlmDecoder', function(error, stdout, stderr) {
		  gutil.log(stdout);
	  }).on('exit', function() {
		child_process.exec('ionic plugin add ../plugins/com.monstarmike.telemetry.plugins.tlmDecoder', function (error, stdout, stderr) {
			gutil.log(stdout);
		}).on('exit', function () {
			child_process.exec('ionic plugin rm com.monstarmike.telemetry.plugins.sharing', function (error, stdout, stderr) {
				gutil.log(stdout);
			}).on('exit', function () {
				child_process.exec('ionic plugin add ../plugins/com.monstarmike.telemetry.plugins.sharing', function (error, stdout, stderr) {
					gutil.log(stdout);
				}).on('exit', function () {
					resolve();
				});
			});
		});  
	  });
  
  });
}

function updateAndroidPlatform() {
	return q.Promise(function(resolve, reject) {
		child_process.exec('ionic platform update android', function (error, stdout, stderr) {
			gutil.log(stdout);
		}).on('exit', function () {
			resolve();
		});
	});
}

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('update', function(callback) {
	resetPlugins().then(function() {
		updateAndroidPlatform().then(function () {
			callback();
		});	
	});
});

gulp.task('telemetryplugin', function (callback) {
	resetPlugins();
  
  callback();
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
