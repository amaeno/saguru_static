import {set_button_clickEvent, set_bubble_hoverEvent} from "./common.js";
import {init_episode_table} from "./episode_table.js";
import {draw_chronology_chart_and_text} from "./chronology_chart.js";
import {init_analysis_table} from "./analysis_table.js";
import {init_summary_table} from "./summary_table.js";

// 特定ページ訪問時毎に実行
window.onload = () => {
    init_episode_table();
    draw_chronology_chart_and_text();
    init_analysis_table();
    init_summary_table();

    // テーブルの各行の追加・削除・ソートボタン
    set_button_clickEvent();
    // チャートのドット上にホバーメッセージを出す
    set_bubble_hoverEvent();
};