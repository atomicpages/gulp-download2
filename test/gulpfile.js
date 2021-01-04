const gulp = require('gulp');
const download = require('../index');
const del = require('del');
// const dl = require('gulp-download');

const url = 'https://i.imgur.com/MNJcnuJ.jpg';

gulp.task('clean', () => del('lol'));

// Test the gulp task
gulp.task('download', ['clean'], function () {
    const files = [
        {
            url: url,
            file: 'cool_cat.jpg',
        },
        'https://i.imgur.com/c090ZXz.jpg',
        'ftp://ftp.ncbi.nlm.nih.gov/geo/series/GSE39nnn/GSE39549/soft/GSE39549_family.soft.gz', // with redirects
        // 'http://ipv4.download.thinkbroadband.com/512MB.zip'
        // 'https://github.com/v8/v8/archive/6.2.202.zip',
    ];

    return download(files, {
        headers: {
            'user-agent': 'testy test',
        },
    }).pipe(gulp.dest('lol'));
});

gulp.task('error', function () {
    return download(['http://foo.com/test.txt'], {
        errorCallback: function () {
            console.log('Foo');
            process.exit(1);
        },
    }).pipe(gulp.dest('lol'));
});

// gulp.task('dl', function () {
//     let start = new Date().getTime();

//     dl('http://ipv4.download.thinkbroadband.com/512MB.zip').pipe(gulp.dest('lol')).on('end', () => console.log(`${new Date().getTime() - start}ms`));
// });

gulp.task('default', ['download']);
