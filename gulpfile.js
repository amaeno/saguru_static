// gulpプラグインを読み込み
const { series,src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browserSync   = require('browser-sync');
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");//エラーでビルドを中止させない

// ファイルパス
const path_root = "docs";
const path_dir_sass = "src/sass/*.scss";
const path_dir_css = "src/common/css";
const path_dir_js = "src/common/js";
const path_dir_ejss = "src/ejs/";
const name_dev_ejs = "dev_*.ejs";
const name_main_ejs = "main_*.ejs";
const path_dir_ejs = "src/ejs/*.ejs";
const path_dir_partial_ejs = "src/ejs/_*.ejs"; // パーシャルejsはコンパイル対象外

//ベンダープレフィックスを適用する条件
const TARGET_BROWSERS = [
  'last 2 versions',//2世代前までのバージョンを担保
  'ie >= 11'//IE11を担保
];


// sass compile task
const compileSass = (callback) => {
  const option = [autoprefixer(TARGET_BROWSERS)];
  src(path_dir_sass)                          // scssファイルを格納場所
    .pipe(sass({outputStyle: "compressed"}))  // cssファイルへコンパイル
    .pipe(postcss(option))                    // Sass実行時にautoprefixerも実行
    .pipe(dest(path_dir_css))                // cssフォルダー以下に保存          
  callback();  
};

// browserSync設定 task
const browserSyncInit = (callback) => {
  browserSync.init({
    server: {
      baseDir: "./src",   // rootファイルの指定
      index: "index.html"  // 起動時に開くファイルを指定
    },
  });
  callback();
};

// browserSync reload task
const browserSyncReload = (callback) => {
  browserSync.reload();
  copyCommonFiles(); // commonフォルダのファイルコピー
  callback();
};

// ejs compile task (本番用)
const compileEjs_main = (callback) => {
  src([path_dir_ejss + name_main_ejs, '!' + path_dir_partial_ejs])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename((path) => {
      path.basename = path.basename.replace("main_", ""); // main_ を削除してhtmlを生成
      path.extname = ".html";
    }))
    .pipe(dest("docs/"))
  callback();
}

// ejs compile task (開発用)
const compileEjs_dev = (callback) => {
  src([path_dir_ejss + name_dev_ejs, '!' + path_dir_partial_ejs])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename((path) => {
      path.basename = path.basename.replace("dev_", ""); // dev_ を削除してhtmlを生成
      path.extname = ".html";
    }))
    .pipe(dest("src/"));
  callback();
}

// commonフォルダコピー task
const copyCommonFiles = () => {
  return src('src/common/**/*.*')
    .pipe(dest(path_root+"/common"));
};

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
exports.default = series(browserSyncInit, watchFiles, compileSass, compileEjs_main, compileEjs_dev, copyCommonFiles, browserSyncReload);