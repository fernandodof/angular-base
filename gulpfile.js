var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    http = require('http'),
    ecstatic = require('ecstatic');

var paths = {
    root: 'src',
    scripts: 'src/app/**/*.js',
    images: 'src/img/**/*.*',
    templates: 'src/app/**/*.html',
    index: 'src/index.html',
    bower_fonts: 'bower_components/**/*.{ttf,woff,woff2,eof,svg}',
    styles: 'src/styles/sass/**/*.scss',
    styles_compiled: 'src/styles/compiled/',
    i18n: 'src/i18n/*.json'
};

var ports = {
    dev: '7083',
    dist: '8888'
};

//Task to complie sass files
gulp.task('sass-dev', function() {
    return gulp.src(paths.styles)
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(paths.styles_compiled));
});

//Copy templates to dist structure folder
gulp.task('templates-dev', function() {
    return gulp.src(paths.templates)
        .pipe(gulp.dest('src/templates'));
});

// Task to watch .scss files and rebuild css and copy templates to to dist structure folder
gulp.task('watch-dev', function() {
    gulp.watch([paths.styles], ['sass-dev']);
    gulp.watch([paths.templates], ['templates-dev']);
});

//Task to create development server
gulp.task('run-dev', function() {
    http.createServer(
        ecstatic({
            root: __dirname + '/'
        })
    ).listen(ports.dev);

    console.log(
        'Listening on http://localhost:' +
        ports.dev + '/' +
        paths.root);
});

//Bellow tasks are for production

//Task for concat and minfy javascript and css files
gulp.task('usemin-dist', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [cleanCSS({
                compatibility: 'ie8'
            }), 'concat'],
        }))
        .pipe(gulp.dest('dist/'));
});

//Task to copy fonts to dist folder and renaming folder
gulp.task('copy-bower-fonts-dist', function() {
    return gulp.src(paths.bower_fonts)
        .pipe(rename({
            dirname: '/fonts'
        }))
        .pipe(gulp.dest('dist/styles'));
});

//Task to copy images to dist folder
gulp.task('copy-images-dist', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});

//Task to complie sass files and copy to dist folder
gulp.task('sass-dist', function() {
    return gulp.src(paths.styles)
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('dist/styles/compiled'));
});

//Copy templates to dist folder
gulp.task('templates-dist', function() {
    return gulp.src(paths.templates)
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist/templates'));
});

//Copy translations files dist folder
gulp.task('i18n-dist', function() {
    return gulp.src(paths.i18n)
        .pipe(gulp.dest('dist/i18n'));
});

gulp.task('livereload', function() {
    gulp.src(['dist/**/*.*'])
        .pipe(watch(['dist/**/*.*']))
        .pipe(connect.reload());
});

/**
 * Live reload server for dist
 */
gulp.task('webserver-dist', function() {
    connect.server({
        root: 'dist',
        livereload: true,
        port: ports.dist
    });
});

/**
 * Gulp tasks
 */
gulp.task('run', ['sass-dev', 'templates-dev', 'run-dev', 'watch-dev']);
gulp.task('build', ['usemin-dist', 'copy-bower-fonts-dist', 'copy-images-dist', 'sass-dist', 'templates-dist', 'i18n-dist']);
gulp.task('run-dist', ['webserver-dist']);
