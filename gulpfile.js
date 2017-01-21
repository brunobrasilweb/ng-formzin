var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('webserver', function() {
    connect.server({
        directoryListing: {
            enable: true,
            path: 'src'
        },
        open: true,
        root: 'src',
        livereload: true,
        port: 8000
    });
});

gulp.task('default', ['webserver']);
