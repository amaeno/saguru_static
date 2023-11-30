// gulpプラグインを読み込み
const { series,src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync   = require('browser-sync');

// ファイルパス
const path_root = "htdocs/root";
const path_dir_sass = "htdocs/src/sass/*.scss";
const path_dir_css = "htdocs/root/dist/css";
const path_dir_js = "htdocs/root/dist/js";


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
      baseDir: path_root,   // rootファイルの指定
      index: "/index.html"  // 起動時に開くファイルを指定
    },
  });
  callback();
};

// browserSync reload task
const browserSyncReload = (callback) => {
  browserSync.reload();
  callback();
};

// ファイル監視
const watchFiles = () => {
  watch(path_dir_sass, compileSass);                  // scssファイル更新を監視
  watch(path_root + "/*.html", browserSyncReload);    // htmlファイル更新を監視
  watch(path_dir_css + "/*.css", browserSyncReload); // cssファイル更新を監視
  watch(path_dir_js + "/*.js", browserSyncReload);   // jaファイル更新を監視
};


// npx gulp 実行時に起動するタスク
exports.default = series(browserSyncInit, watchFiles, compileSass, browserSyncReload);