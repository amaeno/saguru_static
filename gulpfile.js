// gulpプラグインを読み込み
const { series,src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync   = require('browser-sync');
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");//エラーでビルドを中止させない

// ファイルパス
const path_root = "docs";
const path_dir_sass = "src/sass/*.scss";
const path_dir_css = "docs/common/css";
const path_dir_js = "docs/common/js";
const path_dir_dev_ejs = "src/ejs/dev_index.ejs";
const path_dir_main_ejs = "src/ejs/index.ejs";
const path_dir_ejs = "src/ejs/*.ejs";
const path_dir_partial_ejs = "src/ejs/_*.ejs"; // パーシャルejsはコンパイル対象外


// sass compile task
const compileSass = (callback) => {
  src(path_dir_sass)                          // scssファイルを格納場所
    .pipe(sass({outputStyle: "compressed"}))  // cssファイルへコンパイル
    .pipe(dest(path_dir_css));                // cssフォルダー以下に保存
  callback();  
};

// browserSync設定 task
const browserSyncInit = (callback) => {
  browserSync.init({
    server: {
      baseDir: "./",   // rootファイルの指定
      index: "/src/dev_index.html"  // 起動時に開くファイルを指定
    },
  });
  callback();
};

// browserSync reload task
const browserSyncReload = (callback) => {
  browserSync.reload();
  callback();
};

// ejs compile task (本番用)
const compileEjs_main = (callback) => {
  src([path_dir_main_ejs, '!' + path_dir_partial_ejs])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("docs/"))
  callback();
}

// ejs compile task (開発用)
const compileEjs_dev = (callback) => {
  src([path_dir_dev_ejs, '!' + path_dir_partial_ejs])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(dest("src/"));
  callback();
}

// ファイル監視
const watchFiles = () => {
  watch(path_dir_sass, compileSass);                  // scssファイル更新を監視
  watch(path_dir_ejs, compileEjs_main);                  // ejsファイル更新を監視
  watch(path_dir_ejs, compileEjs_dev);                  // ejsファイル更新を監視
  watch(path_root + "/*.html", browserSyncReload);    // htmlファイル更新を監視
  watch(path_dir_css + "/*.css", browserSyncReload); // cssファイル更新を監視
  watch(path_dir_js + "/*.js", browserSyncReload);   // jsファイル更新を監視
};


// npx gulp 実行時に起動するタスク
exports.default = series(browserSyncInit, watchFiles, compileSass, compileEjs_main, compileEjs_dev, browserSyncReload);