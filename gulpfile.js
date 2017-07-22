const gulp = require('gulp');
const eslint = require('gulp-eslint');
const download = require('./index');
const del = require('del');
// const dl = require('gulp-download');

const url = 'https://i.imgur.com/MNJcnuJ.jpg';

gulp.task('clean', () => del('lol'));

// Test the gulp task
gulp.task('download', ['clean'], function () {
    const files = [
        {
            url: url,
            file: 'cool_cat.jpg'
        },
        'https://i.imgur.com/c090ZXz.jpg',
        'ftp://ftp.ncbi.nlm.nih.gov/geo/series/GSE39nnn/GSE39549/soft/GSE39549_family.soft.gz', // with redirects
        'http://ipv4.download.thinkbroadband.com/512MB.zip'
    ];

    return download(files).pipe(gulp.dest('lol'));
});

gulp.task('lint', function () {
    return gulp.src('index.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// gulp.task('dl', function () {
//     let start = new Date().getTime();

//     dl('http://ipv4.download.thinkbroadband.com/512MB.zip').pipe(gulp.dest('lol')).on('end', () => console.log(`${new Date().getTime() - start}ms`));
// });

gulp.task('default', ['download']);
