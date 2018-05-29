let gulp = require('gulp');

let ftp = require('vinyl-ftp');
let gutil = require('gulp-util');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');

gulp.task('default', () => {
    gulp.watch('./app/*.scss', ['css']);
});

gulp.task('css', () => {
    return  gulp.src('./app/style.scss')
            .pipe(sass({
                outputStyle: 'compressed'
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', () => {
    let conn = ftp.create({
        host: 'files.000webhost.com',
        user: 'phildsystem',
        password: '357951br',
        parallel: '10',
        log: gutil.log
    });

    let globs = [
        './dist/**'
    ];

    return gulp.src(globs, {base: './dist', buffer: false})
        .pipe(conn.differentSize('/public_html/plug')) // only upload newer files
        .pipe(conn.dest('/public_html/plug'));
});