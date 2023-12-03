import {update_textarea_height} from "./common.js";


const id_analysis_table_area = "analysisTableList";


const class_analysisQ1Table = "analysisQ1Table";
const class_analysisQ2Table = "analysisQ2Table";

const class_suffix_textarea = "__textarea";


// ************************************************
//     @breief:  分析記入欄の初期設定をする
//     @param[1]: -
//     @return: -
// ************************************************
export const init_analysis_table = () => {
    const analysis_table_area = document.getElementById(id_analysis_table_area);

    // テーブルセルの要素(textareaタグ)のリスト取得
    let analysis_cells = analysis_table_area.querySelectorAll(`.${class_analysisQ1Table + class_suffix_textarea}, .${class_analysisQ2Table + class_suffix_textarea}`);
    let len_analysis_cells = analysis_cells.length;

    // 各セルにイベント追加
    for(let num = 0; num < len_analysis_cells; num++){
        // セルのテキストが変更された場合
        analysis_cells[num].addEventListener('input', () => {
            // テキストの入力可能行数を制限
            update_textarea_height(analysis_cells[num]);
        });
    }
}
