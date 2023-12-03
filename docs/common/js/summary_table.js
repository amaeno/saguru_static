import {update_textarea_height} from "./common.js";


const id_summary_table_list = "summaryTableList";
const class_summaryTable_textarea = "summaryTable__textarea";


// ************************************************
//     @breief:  まとめ記入欄の初期設定をする
//     @param[1]: -
//     @return: -
// ************************************************
export const init_summary_table = () => {
    const summary_table = document.getElementById(id_summary_table_list);

    // テーブルセルの要素(textarea or inputタグ)のリスト取得
    let summary_cells = summary_table.querySelectorAll(`.${class_summaryTable_textarea}`);
    let len_summary_cells = summary_cells.length;

    // 各セルにイベント追加
    for(let num = 0; num < len_summary_cells; num++){
        // セルのテキストが変更された場合
        summary_cells[num].addEventListener('input', () => {
            // テキストの入力可能行数を制限
            update_textarea_height(summary_cells[num]);
        });
    }
}
