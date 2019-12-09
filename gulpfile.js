var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var getRepoInfo = require('git-repo-info');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var pjson = require('./package.json');
var md5File = require('md5-file');
var MD5 = require('md5.js');

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task("docco", function (cb) {
    exec('node_modules/docco/bin/docco js-dos-ts/* js-dos-cpp/* js-dos-cpp/include/* -o dist/docs/api -l plain-markdown', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("docs", ["docco"], function (cb) {
    exec('find dist/docs -name "*.html" -exec bash -c \'mv "$1" "${1%.html}".md\' - \'{}\' \\;', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('generateBuildInfo', function () {
    var info = getRepoInfo();
    var wasmHash = md5File.sync('build/wdosbox.wasm');
    var asmHash = md5File.sync('build/dosbox.js');
    var seed = Date.now();
    var md5Version = new MD5().update(pjson.version)
        .update(info.sha)
        .update(wasmHash)
        .update(asmHash)
        .update(seed + "")
        .digest('hex');

    require('fs').writeFileSync('js-dos-ts/js-dos-build.ts',
        "// Autogenerated\n" +
        "// -------------\n" +
        "// gulpfile.js --> generateBuildInfo\n\n" +
        "export const Build = {\n" +
        "    version: \"" + pjson.version + " (" + md5Version + ")\",\n" +
        "    jsVersion: \"" + info.sha + "\",\n" +
        "    wasmJsSize:  " + fs.statSync("build/wdosbox.js")['size'] + ",\n" +
        "    wasmVersion: \"" + wasmHash + "\",\n" +
        "    wasmSize: " + fs.statSync("build/wdosbox.wasm")['size'] + ",\n" +
        "    jsSize:  " + fs.statSync("build/dosbox.js")['size'] + ",\n" +
        "    buildSeed:  " + seed + ",\n" +
        "};\n");
})

gulp.task('copyAssets', function () {
    return gulp.src(['test/index.html',
        'build/wdosbox.js', 'build/wdosbox.js.symbols',
        'build/wdosbox-nosync.js', 'build/wdosbox-nosync.js.symbols',
        'build-emterp/wdosbox-emterp.js', 'build-emterp/wdosbox-emterp.js.symbols',
        'build/wdosbox-profiling.js', 'build/wdosbox-profiling.js.symbols',
        'build/wdosbox-nosync-profiling.js', 'build/wdosbox-nosync-profiling.js.symbols',
        'build/dosbox.js', 'build/dosbox.js.mem', 'build/dosbox.js.symbols',
        'build-emterp/wdosbox-emterp-profiling.js', 'build-emterp/wdosbox-emterp-profiling.js.symbols',
        'build-emterp/dosbox-emterp.js', 'build-emterp/dosbox-emterp.js.mem', 'build-emterp/dosbox-emterp.js.symbols',
        'build-emterp/dosbox-nosync.js', 'build-emterp/dosbox-nosync.js.mem', 'build-emterp/dosbox-nosync.js.symbols',
    ])
        .pipe(gulp.dest('dist'));
});

gulp.task('rewriteDefaultVersion', function () {
    return gulp.src(['build-emterp/dosbox-emterp.js', 'build-emterp/dosbox-emterp.js.mem', 'build-emterp/dosbox-emterp.js.symbols'])
        .pipe(rename(function (path) {
            path.basename = 'dosbox';
            if (path.extname !== '.js') {
                path.basename += ".js";
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copyWasm', function () {
    return gulp.src([
        'build/wdosbox.wasm',
        'build/wdosbox-nosync.wasm',
        'build-emterp/wdosbox-emterp.wasm',
        'build/wdosbox-profiling.wasm',
        'build/wdosbox-nosync-profiling.wasm',
        'build-emterp/wdosbox-emterp-profiling.wasm',
    ]).pipe(rename({ extname: ".wasm.js" }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copyTypeScript', function () {
    return gulp.src('js-dos-ts/**')
        .pipe(gulp.dest('dist/typescript'));
});

gulp.task('copyAssetsTest', function () {
    return gulp.src(['test/*.html', 'test/*.png', 'test/*.zip'])
        .pipe(gulp.dest('dist/test'));
});

gulp.task('copyPackageJson', function () {
    return gulp.src(['package.json'])
        .pipe(gulp.dest('dist'));
})

gulp.task('test', ['copyAssetsTest'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['test/test.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify, {
            "esModuleInterop": false,
            "allowSyntheticDefaultImports": true,
            "strict": false,
            "forceConsistentCasingInFileNames": false,
            "resolveJsonModule": true,
            "isolatedModules": false
        })
        .transform('babelify', {
            presets: [['@babel/preset-env', { 'useBuiltIns': 'usage', 'corejs': 2 }]],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('test.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/test'));
});

gulp.task('default', ['test', 'generateBuildInfo', 'copyWasm', 'copyAssets', /* 'rewriteDefaultVersion', */
    'copyTypeScript', 'docs', 'copyPackageJson'], function () {
        return browserify({
            basedir: '.',
            debug: true,
            entries: ['js-dos-ts/js-dos.ts'],
            cache: {},
            packageCache: {}
        })
            .plugin(tsify)
            .transform('babelify', {
                presets: [['@babel/preset-env', { 'useBuiltIns': 'usage', 'corejs': 2 }]],
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