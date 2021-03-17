const { series, src, dest, task, watch } = require('gulp'),
	sass = require('gulp-dart-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();

// Compile Sass
task('scss', () => {
	return src(['dist/scss/*.scss'])
		.pipe(
			sass({
				outputStyle: 'compressed',
			}).on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(dest('dist/css'))
		.pipe(browserSync.stream());
});

// Move Font Awesome Fonts to dist
task('FontAwesome', () => {
	return src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'])
		.pipe(dest('dist/webfonts'))
		.pipe(browserSync.stream());
});

// Watch Sass
task(
	'serve',
	series('scss', (cb) => {
		browserSync.init({
			server: './dist',
			injectChanges: false,
		});
		watch(['dist/scss/*.scss', 'dist/scss/*/*.scss'], task('scss'));
		watch(['dist/css/*.css', 'dist/js/*.js', 'dist/*.html']).on(
			'change',
			browserSync.reload
		);
		cb();
	})
);

// Default
task('default', series('FontAwesome', 'serve'));
