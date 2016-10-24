
var gulp = require('gulp');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var cache = require('gulp-cached');
var change = require('gulp-change');
var concat = require('gulp-concat');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var insert = require('gulp-insert');
var path = require('path');
var plumber = require('gulp-plumber');
var remember = require('gulp-remember');
var save = require('gulp-save');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var gulpIgnore = require('gulp-ignore');
var tap = require('gulp-tap');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;
var babelConfig = gulpConfig.babelConfig;

// build client logic app
gulp.task('Es6ToEs5:app', () => {
	var view = /(view.js|View.js)$/;

	function insertSystemImports() {
		return change(function (content) {
			content = content + '\n' +
				'$IMA.Loader.initAllModules();\n' +
				'Promise.all([$IMA.Loader.import("app/main")])\n' +
				'.catch(function (error) { \n' +
				'console.error(error); \n });';

			return content;
		});
	}

	function replaceToIMALoader() {
		return change(function (content) {
			content = content.replace(/System.import/g, '$IMA.Loader.import');
			content = content.replace(/System.register/g, '$IMA.Loader.register');

			return content;
		});
	}

	function excludeServerSideFile(file) {
		return file.contents.toString().indexOf('@server-side') !== -1 && files.app.clearServerSide;
	}

	return (
		gulp.src(files.app.src)
			.pipe(resolveNewPath(files.app.base || '/'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(cache('Es6ToEs5:app'))
			.pipe(babel({
				moduleIds: true,
				presets: babelConfig.app.presets,
				plugins: babelConfig.app.plugins
			 }))
			.pipe(remember('Es6ToEs5:app'))
			.pipe(plumber.stop())
			.pipe(save('Es6ToEs5:app:source'))
			.pipe(gulpIgnore.exclude(excludeServerSideFile))
			.pipe(concat(files.app.name.client))
			.pipe(replaceToIMALoader())
			.pipe(insert.wrap('(function(){\n', '\n })();\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.app.dest.client))
			.pipe(save.restore('Es6ToEs5:app:source'))
			.pipe(concat(files.app.name.server))
			.pipe(insertSystemImports())
			.pipe(replaceToIMALoader())
			.pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.app.dest.server))
	);

});

// build ima
gulp.task('Es6ToEs5:ima', () => {

	function replaceToIMALoader() {
		return change(function (content) {
			content = content.replace(/System.import/g, '$IMA.Loader.import');
			content = content.replace(/System.register/g, '$IMA.Loader.register');

			return content;
		});
	}

	function excludeServerSideFile(file) {
		return file.contents.toString().indexOf('@server-side') !== -1 && files.ima.clearServerSide;
	}

	return (
		gulp.src(files.ima.src)
			.pipe(resolveNewPath(files.ima.base || '/node_modules'))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(cache('Es6ToEs5:ima'))
			.pipe(babel({
				moduleIds: true,
				presets: babelConfig.ima.presets,
				plugins: babelConfig.ima.plugins
			 }))
			.pipe(remember('Es6ToEs5:ima'))
			.pipe(plumber.stop())
			.pipe(save('Es6ToEs5:ima:source'))
			.pipe(gulpIgnore.exclude(excludeServerSideFile))
			.pipe(concat(files.ima.name.client))
			.pipe(replaceToIMALoader())
			.pipe(insert.wrap('(function(){\n', '\n })();\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.ima.dest.client))
			.pipe(save.restore('Es6ToEs5:ima:source'))
			.pipe(concat(files.ima.name.server))
			.pipe(replaceToIMALoader())
			.pipe(insert.wrap('module.exports = (function(){\n', '\n })\n'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(files.ima.dest.server))
	);
});

// build server logic app
gulp.task('Es6ToEs5:server', () => {
	return (
		gulp
			.src(files.server.src)
			.pipe(plumber())
			.pipe(babel({
				presets: babelConfig.server.presets,
				plugins: babelConfig.server.plugins
			}))
			.pipe(plumber.stop())
			.pipe(gulp.dest(files.server.dest))
	);
});

gulp.task('Es6ToEs5:vendor', (done) => {
	var vendorModules = gulpConfig.vendorDependencies;
	var serverModules = vendorModules.common.concat(vendorModules.server);
	var clientModules = vendorModules.common.concat(vendorModules.client);
	var testModules = vendorModules.test || [];

	var serverModuleLinker = getModuleLinkerContent(serverModules);
	var clientModuleLinker = getModuleLinkerContent(clientModules);
	var testModuleLinker = getModuleLinkerContent(testModules);

	var normalizedTmpPath = files.vendor.dest.tmp
			.replace(/^\.\//, '')
			.replace(/\/\.\//, '/')
			.split('/');
	for (var i = 0; i < normalizedTmpPath.length; i++) {
		var currentPath = './' + normalizedTmpPath.slice(0, i).join('/');
		try {
			fs.statSync(currentPath);
		} catch (e) {
			fs.mkdirSync(currentPath, 0o774);
		}
	}

	fs.writeFile(files.vendor.dest.tmp + files.vendor.name.server, serverModuleLinker, (error) => {
		if (error) {
			return done(error);
		}

		fs.writeFile(files.vendor.dest.tmp + files.vendor.src.client, clientModuleLinker, (error) => {
			if (error || !files.vendor.src.test) {
				return done(error);
			}

			fs.writeFile(files.vendor.dest.tmp + files.vendor.src.test, testModuleLinker, (error) => {
				done(error);
			});
		});
	});

	function getModuleLinkerContent(modules) {
		var linkingFileHeader = `var vendorLinker = require('ima/vendorLinker.js');\n`;
		var linkingFileFooter = `module.exports = vendorLinker;\n`;
		var duplicity = [];

		return linkingFileHeader +
		modules
			.map((vendorModuleName) => {
				var alias = vendorModuleName;

				if (typeof vendorModuleName === 'object') {
					alias = Object.keys(vendorModuleName)[0];

					if (modules.indexOf(alias) !== -1) {
						duplicity.push(alias);
					}
				}

				return vendorModuleName;
			})
			.filter((vendorModuleName) => {
				return (typeof vendorModuleName === 'string' && duplicity.indexOf(vendorModuleName) === -1) ||
						(typeof vendorModuleName === 'object');
			})
			.map((vendorModuleName) => {
				var alias = vendorModuleName;
				var moduleName = vendorModuleName;

				if (typeof vendorModuleName === 'object') {
					alias = Object.keys(vendorModuleName)[0];
					moduleName = vendorModuleName[alias];
				}

				return generateVendorInclusion(alias, moduleName);
			})
			.join('') +
		linkingFileFooter;
	}

	function generateVendorInclusion(alias, moduleName) {
		return `vendorLinker.set('${alias}', require('${moduleName}'));\n`;
	}
});

gulp.task('Es6ToEs5:vendor:client', () => {
	var sourceFile = files.vendor.dest.tmp + files.vendor.src.client;
	var options ={ debug: false, insertGlobals : false, basedir: '.' };

	return (
		browserify(sourceFile, options)
			.transform(babelify.configure({
				presets: babelConfig.vendor.presets,
				plugins: babelConfig.vendor.plugins
			}))
			.bundle()
			.pipe(source(files.vendor.name.client))
			.pipe(gulp.dest(files.vendor.dest.client))
	);
});

gulp.task('Es6ToEs5:vendor:client:test', () => {
	if (files.vendor.src.test) {
		var sourceFiles = [
			files.vendor.dest.tmp + files.vendor.src.test,
			files.vendor.dest.tmp + files.vendor.src.client
		];
		var options ={ debug: false, insertGlobals : false, basedir: '.' };

		return (
			browserify(sourceFiles, options)
				.transform(babelify.configure({
					presets: babelConfig.vendor.presets,
					plugins: babelConfig.vendor.plugins
				}))
				.external('react/addons')
				.external('react/lib/ReactContext')
				.external('react/lib/ExecutionEnvironment')
				.bundle()
				.pipe(source(files.vendor.name.test))
				.pipe(gulp.dest(files.vendor.dest.test))
		);
	}
});

gulp.task('Es6ToEs5:vendor:clean', () =>
	del([files.vendor.dest.tmp + files.vendor.name.tmp])
);

/**
 * "Fix" file path for the babel task to get better-looking module names.
 *
 * @param {string} newBase The base directory against which the file path
 *        should be matched.
 * @return {Stream<File>} Stream processor for files.
 */
function resolveNewPath(newBase) {
	return es.mapSync((file) => {
		file.cwd += newBase;
		file.base = file.cwd;
		return file;
	});
}
