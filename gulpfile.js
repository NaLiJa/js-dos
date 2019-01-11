var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var getRepoInfo = require('git-repo-info');

gulp.task('generateBuildInfo', function() {
    var info = getRepoInfo();

    require('fs').writeFileSync('js-dos-ts/js-dos-build.ts', 
        "export const Build = {\n" +
        "    version: \"" + info.branch + "-" + info.sha + "\",\n" +
        "    wasmSize: " + fs.statSync("build/wdosbox.wasm")['size'] + ",\n" +
        "    jsSize:  " + fs.statSync("build/wdosbox.js")['size'] + ",\n" +
        "};\n");
})

gulp.task('copyAssets', function () {
    return gulp.src(['test/*.html', 'build/wdosbox.wasm', 'build/wdosbox.js', 'build/wdosbox.js.symbols'])
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['test/test.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('test.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
})

gulp.task('default', ['generateBuildInfo', 'test', 'copyAssets'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['js-dos-ts/js-dos.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('js-dos.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});