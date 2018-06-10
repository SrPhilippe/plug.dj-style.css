let gulp = require('gulp'),
    ftp = require('vinyl-ftp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer')

gulp.task('default', () => {
    gulp.watch('./app/*.scss', ['css']);
});

gulp.task('css', () => {
    return gulp.src('./app/style.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(csso())
        .pipe(autoprefixer({
            browsers: ['last 1 version']
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

    return gulp.src(globs, {
            base: './dist',
            buffer: false
        })
        .pipe(conn.differentSize('/public_html/plug')) // only upload newer files
        .pipe(conn.dest('/public_html/plug'));
});
