import {sort_episode_table, add_episode_new_row, delete_episode_new_row} from "./episode_table.js";

// header列識別用辞書
export const header_episode = {
    age: 0,
    episode: 1,
    emotion: 2,
    motivation: 3,
    awareness: 4,
    length: 5
};

// textareaの最大行数
const MAX_LINE_NUM = 2;

// ************************************************
//     @breief:  textareaの入力可能行数を制限する
//     @param[1]:  textareaのオブジェクト
//     @return: -
// ************************************************
export const limit_textarea_lines = (textarea_object) => {
    if(textarea_object.tagName === "TEXTAREA"){
        let output_text = "";

        // 入力テキストを列ごとに配列に格納
        let lines = textarea_object.value.split("\n");

        // 指定行数を超えた入力部分はテキストを削除
        if(lines.length > MAX_LINE_NUM ){
            for (let i = 0; i < MAX_LINE_NUM; i++) {
                // 制限行到達時は改行しない
                if(i === (MAX_LINE_NUM - 1)){
                    output_text += lines[i];
                }
                else  {
                    output_text += lines[i] + "\n";
                }
            }
            textarea_object.value = output_text;
        }

        // 折り返しで2行い上になった時はセルの縦幅を伸ばす
        textarea_object.setAttribute("style", `height: ${textarea_object.scrollHeight}px;`);
        textarea_object.style.height = "auto";
        textarea_object.style.height = `${textarea_object.scrollHeight}px`;
    }
}


// ************************************************
//     @breief:  inputの入力可能上限/下限を制限する
//     @param[1]:  inputのオブジェクト
//     @return: -
// ************************************************
export const limit_input_range = (input_object) => {
    if(input_object.tagName === "INPUT"){
        const MAX_INPUT_NUM = parseInt(input_object.max);
        const MIN_INPUT_NUM = parseInt(input_object.min);

        let input_num = input_object.value;

        // 上限を超えたら最大値を設定
        if(input_num > MAX_INPUT_NUM ){
            input_object.value = MAX_INPUT_NUM;
        }
        // 下限を超えたら最大値を設定
        if(input_num < MIN_INPUT_NUM ){
            input_object.value = MIN_INPUT_NUM;
        }
    }
}

// ************************************************
//     @breief:  ボタンのclickイベントを設定する
//     @param[1]:  -
//     @return: -
// ************************************************
export const set_button_clickEvent = () => {
    document.addEventListener('click', (event) => {
        // 操作メニューボタン以外の箇所を押した時、開いていたメニューを閉じる
        if (!(event.target.id && event.target.id.includes("episodeTableMenuBtn__rowNo"))){
            const episodeTableMenuBtn_element = document.querySelectorAll(`[id*="episodeTableMenuBtn__rowNo"]`);
            episodeTableMenuBtn_element.forEach(element => {
                element.checked = false; 
            });
        }

        if (event.target.className.match(/Table__textarea$|Table__input$/g)){
            // クリック毎に全てのinput/textareのfocus時スタイルを解除
            const forms = document.querySelectorAll('[class*="Table__textarea"], [class*="Table__input"]');
            forms.forEach(element => {
                element.parentNode.style = null;
            });

            // input/textareクリック時にfocus時スタイルを適用
            if(event.target === document.activeElement){
                const column_element = event.target.parentNode;
                column_element.style.outline = "3px solid #2E8540";
                column_element.style.outlineOffset = "-4px";
                column_element.style.borderRadius = "10px";
            }

        }
    });

    const episode_table = document.getElementById("episodeArea");
    episode_table.addEventListener('click', (event) => {
        // episodeTable__btn_sortクリック時は行全体を年齢順に並び替え
        if (event.target && event.target.classList.contains("episodeTable__btn_sort")) {
            sort_episode_table();
        }
        // episodeTable__btn_addクリック時は行追加
        if (event.target && event.target.classList.contains("episodeTable__btn_add")) {
            add_episode_new_row(event.target);
        }
        // episodeTable__btn_deleteクリック時は行削除
        if (event.target && event.target.classList.contains("episodeTable__btn_delete")) {
            delete_episode_new_row(event.target);
        }
    });

    // "モチベーションチャート"ナビクリック時に年齢順に並び替える
    const chronologyNav = document.getElementById("chronologyLabel");
    chronologyNav.addEventListener('click', (event) => {
        sort_episode_table();
    });
}

// ************************************************
//     @breief:  mouseoverイベントを設定する
//     @param[1]:  -
//     @return: -
// ************************************************
export const set_bubble_hoverEvent = () => {
    const chronology_text = document.getElementById("chronologyText");
    // ドットにhover時、inputタグをcheckedにする
    chronology_text.addEventListener('mouseover', (event) => {
        if (event.target && event.target.classList.contains("chronologyBubbleLabel")) {
            event.target.previousElementSibling.checked = true;
        }
    });

    // 画面クリック時、ホバーメッセージを閉じる
    document.addEventListener('click', () => {
        const chronologyBubble_element = document.querySelectorAll(`[id*="chronologyBubble__rowNo"]`);
        chronologyBubble_element.forEach(element => {
            element.checked = false; 
        });
    });
}