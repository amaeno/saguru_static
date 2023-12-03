import {header_episode} from "./common.js";
import {episode_data_array} from "./episode_table.js";


const id_canvas = "chronologyChart";
const id_canvas_vaxis = "chronologyChartVaxis";
const id_chronologyText = "chronologyText";


const canvas_mergin_y = 10;
const canvas_mergin_x = 30;

const scale_long = 15;
const scale_short = 7;



// ************************************************
//     @breief:  モチベーションチャートの初期設定をする
//     @param[1]: -
//     @return: -
// ************************************************
export const draw_chronology_chart_and_text = () => {
    // draw_chronology_chart()より先に記述(テキストの数でチャートの横幅が決まるため)
    update_chronology_text(episode_data_array[header_episode.age]);
    draw_chronology_chart_Vaxis();
    draw_chronology_chart(episode_data_array[header_episode.motivation]);
}


// ************************************************
//     @breief:  モチベーションチャートをcanvasに描画する
//     @param[1]:  モチベーション値配列
//     @return: -
// ************************************************
const draw_chronology_chart = (motivation_array) => {
    const canvas = document.getElementById(id_canvas);
    const chronologyText_element = document.getElementById(id_chronologyText);

    // canvasサイズを.chronologyTextのサイズと同じにする
    const canvas_width = chronologyText_element.scrollWidth;
    const canvas_height = canvas.clientHeight;
    let chart_height = canvas_height - (canvas_mergin_y * 2);

    // エピソード欄の横幅
    const item_width = 71;
    // エピソード欄の中央線のまでの幅
    const item_center = Math.ceil(item_width/2);

    // ドット1セルに当たるピクセル数
    const cell_height = Math.ceil(chart_height / 100);

    let motivation_dot_array = [];


    // CSSで設定した要素サイズに描画サイズ合わせる
    canvas.setAttribute( "width" , canvas_width );
    canvas.setAttribute( "height" , canvas_height );

    // canvasに対応していない場合は何もしない
    if ( ! canvas || ! canvas.getContext ) {
        return false;
    }
    const context = canvas.getContext('2d');

// 描画処理 ========================
    draw_h_axis(context, canvas_width, cell_height);

    for(let i=0; i < motivation_array.length; i++){
        draw_dash_line(context, item_center + (item_width * i), canvas_mergin_y , item_center + (item_width * i), chart_height + canvas_mergin_y );
        draw_dot(context, item_center + (item_width * i), (chart_height - (motivation_array[i]*cell_height)) + canvas_mergin_y , 6);        
    
        // 描画したドットの座標を保存
        motivation_dot_array.push([item_center + (item_width * i), (chart_height - (motivation_array[i]*cell_height) + canvas_mergin_y)]);
    }

    draw_chart(context, motivation_dot_array);
}


// ************************************************
//     @breief:  モチベーションチャートをcanvasに描画する
//     @param[1]:  モチベーション値配列
//     @return: -
// ************************************************
const draw_chronology_chart_Vaxis = () => {
    const canvas = document.getElementById(id_canvas_vaxis);

    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;
    let chart_height = canvas_height - (canvas_mergin_y * 2);

    // ドット1セルに当たるピクセル数
    const cell_height = Math.ceil(chart_height / 100);

    // CSSで設定した要素サイズに描画サイズ合わせる
    canvas.setAttribute( "width" , canvas_width );
    canvas.setAttribute( "height" , canvas_height );

    // canvasに対応していない場合は何もしない
    if ( ! canvas || ! canvas.getContext ) {
        return false;
    }
    const context = canvas.getContext('2d');
    draw_v_axis(context, chart_height + canvas_mergin_y, cell_height);
}



// ************************************************
//     @breief:  破線を描画する
//     @param[1]:  canvasのcontext
//     @param[2]:  始点のx座標
//     @param[3]:  始点のy座標
//     @param[4]:  終点のx座標
//     @param[5]:  終点のy座標
//     @return: -
// ************************************************
const draw_dash_line = (context, x1, y1, x2, y2) => {
    context.beginPath();
        context.lineWidth = 1;
        context.setLineDash([3, 3])
        context.strokeStyle = "#cccccc";
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
    context.closePath();

    context.stroke();
}


// ************************************************
//     @breief:  座標のドットを描画する
//     @param[1]:  canvasのcontext
//     @param[2]:  中心x座標
//     @param[3]:  中心y座標
//     @param[4]:  半径
//     @return: -
// ************************************************
const draw_dot = (context, x, y, r) => {
    context.beginPath();
        context.arc( x, y, r, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
        context.fillStyle = "rgb(46,133,64)";
        context.strokeStyle = "rgba(46,133,64,0)";
    context.fill();

    context.stroke();
}


// ************************************************
//     @breief:  折れ線グラフを描画する
//     @param[1]:  canvasのcontext
//     @param[2]:  座標が格納された配列
//     @return: -
// ************************************************
const draw_chart = (context, dot_array) => {
    // 直線の数は(座標の数 - 1)
    let line_num = dot_array.length - 1;

    // 点が2つ以上の時に線を描く
    if(line_num > 0){
        for(let i=0; i < line_num; i++){
            context.beginPath();
                context.lineWidth = 4;
                context.setLineDash([]) // 実線に戻す
                context.strokeStyle = "rgba(46,133,64,1)";
                context.moveTo(dot_array[i][0], dot_array[i][1]);
                context.lineTo(dot_array[i+1][0], dot_array[i+1][1]);
            context.closePath();
            context.stroke();
        }
    }
}


// ************************************************
//     @breief:  グラフの縦軸を描画する
//     @param[1]:  canvasのcontext
//     @param[2]:  横軸軸の長さ
//     @param[3]:  縦軸の長さ
//     @param[4]:  1セル相当の長さ
//     @return: -
// ************************************************
const draw_v_axis = (context, height, cell_height) => {

    // 縦線
    context.beginPath();
        context.lineWidth = 2;
        context.setLineDash([]) // 実線に戻す 
        context.strokeStyle = "#aaaaaa";
        context.moveTo(canvas_mergin_x, canvas_mergin_y);
        context.lineTo(canvas_mergin_x, height);
    context.closePath();

    context.stroke();

    // メモリ
    for(let i=0; i <= 10; i++){
        context.beginPath();
            context.lineWidth = 2;
            context.setLineDash([]) // 実線に戻す 
            context.strokeStyle = "#aaaaaa";
            // 10刻み
            context.moveTo(canvas_mergin_x, (i * cell_height * 10) + canvas_mergin_y );
            if ((i === 0) || (i === 5) || (i === 10)) {
                context.lineTo(canvas_mergin_x + scale_long, (i * cell_height * 10) + canvas_mergin_y );

                // 数値
                context.font = '10pt YuGothic,"Yu Gothic",sans-serif';
                context.fillStyle = '#000000';
                context.textAlign = 'right';
                context.textBaseline = 'middle';
                context.fillText((100 - (i * 10)), canvas_mergin_x - 5, (i * cell_height * 10) + canvas_mergin_y );
            }
            else {
                context.lineTo(canvas_mergin_x + scale_short, (i * cell_height * 10) + canvas_mergin_y );
            }
            
        context.closePath();

        context.stroke();
    }
}


// ************************************************
//     @breief:  グラフの横軸を描画する
//     @param[1]:  canvasのcontext
//     @param[2]:  横軸軸の長さ
//     @param[3]:  縦軸の長さ
//     @param[4]:  1セル相当の長さ
//     @return: -
// ************************************************
const draw_h_axis = (context, width, cell_height) => {
    // 横線
    context.beginPath();
        context.lineWidth = 1;
        context.setLineDash([]) // 実線に戻す 
        context.strokeStyle = "#000000";
        context.moveTo(scale_long + 7, (cell_height * 50) + canvas_mergin_y );
        context.lineTo(scale_long + 7 + width, (cell_height * 50) + canvas_mergin_y );
    context.closePath();

    context.stroke();
}


// ************************************************
//     @breief:  モチベーションチャートのテキストを更新する
//     @param[1]:  年齢配列
//     @return: -
// ************************************************
export const update_chronology_text = (age_array) => {
    const chronology_target_area = document.getElementById("chronologyText");
    const len_data_array = age_array.length;

    // ulタグの子要素を一度全て削除
    while (chronology_target_area.firstChild) {
        chronology_target_area.removeChild(chronology_target_area.firstChild);
    }

    for(let row_num=0; row_num < len_data_array; row_num++){
        // エピソード記入欄と対応したid・記入内容を取得
        const episode_id_age = `episode_g_0_r_${row_num}_c_age`;
        const episode_id_episode = `episode_g_0_r_${row_num}_c_episode`;
        const episode_id_emotion = `episode_g_0_r_${row_num}_c_emotion`;
        const episode_id_motivation = `episode_g_0_r_${row_num}_c_motivation`;
        const episode_id_awareness = `episode_g_0_r_${row_num}_c_awareness`;
    
        const chronology_text_item_age = document.getElementById(episode_id_age).value;
        const chronology_text_item_episode = document.getElementById(episode_id_episode).value;
        const chronology_text_item_emotion = document.getElementById(episode_id_emotion).value;
        const chronology_text_item_motivation = document.getElementById(episode_id_motivation).value;
        const chronology_text_item_awareness = document.getElementById(episode_id_awareness).value;

        // 左右の列の年齢に応じて列をマージ
        let chart_merge_class = merge_chronology_ages(age_array, row_num);

        // 追加する行要素
        const new_chronology_element = `
<li class="chronologyEpisodeList__item">
    <p class="chronologyEpisodeList__itemAge ${chart_merge_class}" id="chronology_g_0_r_${row_num}_c_age">${chronology_text_item_age}</p>
    <p class="chronologyEpisodeList__itemText" id="chronology_g_0_r_${row_num}_c_episode">${chronology_text_item_episode}</p>
    <div class="chronologyEpisodeList__itemBubble" id="chronology_g_0_r_${row_num}_c_bubble">
        <input type="radio" id="chronologyBubble__rowNo${row_num}" class="saguru__navInput" name="chronologyBubble">
        <label id="chronologyBubbleLabel__rowNo${row_num}" class="chronologyBubbleLabel" for="chronologyBubble__rowNo${row_num}"></label>
        <dl id="chronologyBubbleDl__rowNo${row_num}">
            <dt class="chronologyBubbleDl__term">エピソード：${chronology_text_item_age}歳</dt>
            <dd class="chronologyBubbleDl__desc">${chronology_text_item_episode}</dd>
            <dt class="chronologyBubbleDl__term">当時の感情・思考</dt>
            <dd class="chronologyBubbleDl__desc">${chronology_text_item_emotion}</dd>
            <dt class="chronologyBubbleDl__term">振り返って気づいたこと</dt>
            <dd class="chronologyBubbleDl__desc">${chronology_text_item_awareness}</dd>
        </dl>
    </div>
</li>
`
        // 取得したidの行要素直下に追加
        chronology_target_area.insertAdjacentHTML('beforeend', new_chronology_element);

        // ホバーの判定をするドットの高さを設定
        set_chronology_label_height(row_num, chronology_text_item_motivation);
    }
}


// ************************************************
//     @breief:  モチベーションチャートで同じ年齢が並ぶ際はマージする
//     @param[1]: エピソード記入欄の各行の年齢配列
//     @param[2]: エピソード記入欄の行番号
//     @return: チャート年齢欄に付与するクラス名
// ************************************************
const merge_chronology_ages = (episode_ages_array, row_num) => {
    const len_episode_ages_array = episode_ages_array.length;
    let result_class = "";

    if(len_episode_ages_array){
        switch (row_num){
            // 最初の行
            case 0:
                // 右の行と同じ年齢の時、右の行とマージ
                if (((row_num+1) < len_episode_ages_array) &&
                    (episode_ages_array[row_num] === episode_ages_array[row_num+1])){
                        result_class = "-mergeChartLeft";
                }
                // 右の行と異なる年齢の時、右の行とマージしない (クラスを付与しない)
                else {
                    result_class = "";
                }
                break;
            // 最後の行
            case (len_episode_ages_array - 1):
                // 左の行と同じ年齢の時、左の行とマージ
                if (episode_ages_array[row_num] === episode_ages_array[row_num-1]){
                        result_class = "-mergeChartRight";
                }
                // 左の行と異なる年齢の時、左の行とマージしない (クラスを付与しない)
                else {
                    result_class = "";
                }
                break;
            // その他の行
            default:
                // 左右の行と同じ年齢の時、左右の行とマージ
                if( (episode_ages_array[row_num] === episode_ages_array[row_num-1]) &&
                    (episode_ages_array[row_num] === episode_ages_array[row_num+1])){
                        result_class = "-mergeChartCenter";
                }
                // 左右の行のうち左の行だけ同じ年齢の時、左の行とマージ
                else if(episode_ages_array[row_num] === episode_ages_array[row_num-1]){
                    result_class = "-mergeChartRight";
                }
                // 左右の行のうち右の行だけ同じ年齢の時、右の行とマージ
                else if(episode_ages_array[row_num] === episode_ages_array[row_num+1]){
                    result_class = "-mergeChartLeft";
                }
                else {
                    // 左右の行と異なる年齢の時、マージしない (クラスを付与しない)
                    result_class = "";
                }
                break;
        }
    }
    else {
        console.log("不正な配列");
    }
    
    return result_class;
}


// ************************************************
//     @breief:  モチベーションチャートのドットに重なるlabelの位置を設定する
//     @param[1]: エピソード記入欄の行番号
//     @param[2]: モチベーションの点数
//     @return: -
// ************************************************
const set_chronology_label_height = (row_num, motivation_val) => {
    let gridgap = 10;
    let canvas_height = 300;
    let chart_dot = canvas_height / 100;
    
    const bubble_id = `chronology_g_0_r_${row_num}_c_bubble`;
    const bubble_element = document.getElementById(bubble_id);

    bubble_element.style.bottom = `calc(100% + ${canvas_mergin_y}px + ${gridgap}px + ${chart_dot * motivation_val}px)`;
}