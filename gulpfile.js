// модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');


//Порядок подключения CSS фалов
const cssFiles = [
    './src/css/*.css',
    './src/css/zmedia.css'
];

//Порядок подключения JS фалов
const jsFiles = [
    './src/js/lib.js',
    './src/js/*.js',
    './src/js/main.js'
];


//Таск на стили CSS
function styles() {
    return gulp.src(cssFiles)
        //nama files of styles concatination
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        .pipe(cleanCSS({
            level: 2
        }))

        //конечная папка для стилей
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

//Таск на скрипты JS
function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(terser({
            toplevel: true
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function clean() {
    return del(['./build/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./src/sass/**/*.sass", Sass);
    gulp.watch("./*.html").on('change', browserSync.reload);
}


function Sass() {
    return gulp.src("src/sass/*.sass")
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
}

function hosting() {
    return gulp.src("src/**")
        .pipe(ftp({
            host: 'website.com',
            user: 'johndoe',
            pass: '1234',
            remotePath: 'www/домен/strim'
        }))
        .pipe(gutil.noop());
}

// Сдесь задается задание для галпа
gulp.task('hosting', hosting);
gulp.task('Sass', Sass);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, Sass)));
gulp.task('dev', gulp.series('build', 'watch', 'Sass'));
gulp.task('del', clean);
gulp.task('default', watch);
// gulp watch