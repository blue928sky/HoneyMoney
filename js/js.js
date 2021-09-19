// グローバル設定
$(document).bind('mobileinit', function(){
                 $.mobile.loadingMessageTextVisible = true;
                 $.mobile.loadingMessage = 'ロード中';
                 $.mobile.pageLoadErrorMessage = 'ページの読み込みに失敗しました';
                 $.mobile.page.prototype.options.bankBthText = '戻る';
                 $.mobile.dialog.prototype.options.closeBthText = '閉じる';
                 $.mobile.selectmenu.prototype.options.closeText = '閉じる';
                 $.mobile.listview.prototype.options.filterPlaceholder = 'キーワードを入力して下さい';
                 });

var sum = num = no = load_list = kensaku = 0;
var str = str2 = '';
var money_storage = localStorage;
var ary = ary2 = dataAry = hash_ary = [];
var config = [null,null,0];
var alert_msg = '正しく入力して下さい。';

// イベント
$(function(){                                           // 読み込みが終わったら
  print_sum(0);
  
  $('#keywd').on({                                      // 検索ボックス
                 'focus': function(){
                 load_list = 1;                         // 全体表示
                 kensaku = 1;
                 print_sum(0);
                 },
                 
                 'blur': function(){
                 if(!$(keywd).val()){
                 load_list = 0;
                 print_sum(0);
                 kensaku = 0;
                 }
                 }
                 });
  
  // 編集＆削除のナンバー
  $(document).on('tap', 'li', function(){               // liveで発火しないとダメ（再構築する部分だから）
                 no = parseInt(this.id.substr(1));
                 });
  
  // この５つはスワイプイベント
  $('#one').on('swiperight', function(){ $('#Menu').panel('open'); });
  $('#second').on('swiperight', function(){ $('#Menu2').panel('open'); });
  $('#three').on('swiperight', function(){ $('#Menu3').panel('open'); });
  $('#fore').on('swiperight', function(){ $('#Menu4').panel('open'); });
  $('#five').on('swiperight', function(){ $('#Menu5').panel('open'); });
  // ここまで
  
  // 記入の財布設定
  $('input[name="radio"]').change(function(){
                                  if($(this).val() == 'expenditure')
                                  $('input[name="radio-effect"]').val(['w']).checkboxradio('refresh');
                                  else
                                  $('input[name="radio-effect"]').val(['a']).checkboxradio('refresh');
                                  });
  $('#sumP, #walletM').on('click', function(){
                          var str = $('#allWallet').text();
                          if(str == '全体'){
                          $('#sumP, #allWallet').hide();
                          $('#allWallet').text('財布');
                          $('#walletM, #allWallet').fadeIn();
                          }else{
                          $('#walletM, #allWallet').hide();
                          $('#allWallet').text('全体');
                          $('#sumP, #allWallet').fadeIn();
                          }
                          });
  
  // app cache
  if(window.applicationCache){
  var str = '<p class="upMessage" style="background-color:#eee;width:250px;font:15px/150% sans-serif;text-align:center;border-radius:10px;margin:0 auto;display:none;">';
  $(applicationCache).on({
                         // ダウンロード開始
                         downloading: function(){
                         $('.updateM').prepend(str +'アップデート中</p>');
                         $('.upMessage').slideDown();
                         },
                         
                         // ダウンロード中
                         progress: function(e){
                         var par = Math.round(e.originalEvent.loaded/e.originalEvent.total*100);
                         $('.upMessage').text('アップデート中（'+ par +'％）');
                         },
                         
                         // 成功
                         updateready: function(){
                         $('.upMessage').html('<p onClick="window.location.reload(false)">アップデート完了しました<br>ここをタップしてください。</p>');
                         },
                         
                         // エラー
                         error: function(){
                         if(navigator.onLine){
                         $('updateM').prepend(str +'エラーが発生しました</p>');
                         $('.upMessage').slideDown();
                         }
                         },
                         
                         // 404
                         obsolete: function(){
                         ('updateM').prepend(str +'マニフェストにアクセスできませんでした</p>');
                         $('.upMessage').slideDown();
                         }
                         });
  }
  });

hash_ary = {'H_config': config, 'H_ary': ary};

if(money_storage.list == null)
    money_storage.setItem('list', JSON.stringify(hash_ary));      // JSON形式で追加しないと文字化けが起こる

// 記録ある時に代入（記録がない場合は空を代入）
hash_ary = JSON.parse(money_storage.list);
ary = hash_ary.H_ary;
config = hash_ary.H_config;
console.log(ary.length);


////////// アップデート　ここから //////////
try{
    if(config.length != 3){
        config.push(0);
        in_ary();
    }
    
    if(ary.length && !isNaN(ary[0][0])) in_ary(); // 数字だった場合、36進数文字列にしなおす
}catch(e){
    console.log(e.message);
}
////////// アップデート　ここまで //////////


// 配列に代入
function in_ary(){
    var ary3 = ary;
    var len = ary3.length;
    
    // 36進数文字列に変換
    for(var i=0; i<len; i++){ ary3[i][0] = ary[i][0].toString(36); }
    
    hash_ary = {'H_config': config, 'H_ary': ary3};
    money_storage.list = JSON.stringify(hash_ary);
}

// 追加ボタン
function pls(){
    var DH    = new Date();             // オブジェクトの生成
    var Year  = DH.getFullYear();       // 西暦
    var Month = DH.getMonth() + 1;      // 月
    var Day   = DH.getDate();           // 日
    var Hour  = DH.getHours();          // 時
    var Min   = DH.getMinutes();        // 分
    var Sec   = DH.getSeconds();        // 秒
    
    // 整形
    Month = ('00' + Month).slice(-2);
    Day = ('00' + Day).slice(-2);
    Hour = ('00' + Hour).slice(-2);
    Min = ('00' + Min).slice(-2);
    Sec = ('00' + Sec).slice(-2);
    
    var MD = Year.toString() + Month.toString() + Day.toString() + Hour.toString() + Min.toString() + Sec.toString();
    MD = parseInt(MD);
    
    num = parseInt($('#num').val());        // 収支
    var text = $('#text').val();            // 説明
    
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    
    if(isNaN(num) || text.length == 0)
        window.alert(alert_msg);
    else if(num <= 0)
        window.alert('自然数を入力して下さい');
    else{
        // 収入か支出か
        if($('input[name="radio"]:checked').val() == 'expenditure')
            num = -num;
        // 財布に影響あるかないか
        if($('input[name="radio-effect"]:checked').val() == 'w')
            config[2] += num;
        
        ary2 = [MD, num, text];
        ary.unshift(ary2);              // 頭に代入
        in_ary();                       // 連想配列ごと代入
        $('#num').val('');
        $('#text').val('');
        print_sum(1);                   // 表示関数
    }
}

// 整形
function add_s(date){
    date = date.toString();
    return date.substr(0,4) + '/' + date.substr(4,2) + '/' + date.substr(6,2);
}
function add_c(time){
    time = time.toString();
    return time.substr(8,2) + ':' + time.substr(10,2) + ':' + time.substr(12,2);
}
function add_m(date){
    date = date.toString();
    return date.substr(0,4) + '/' + date.substr(4,2);
}
function add_all(all){
    all = all.toString();
    return add_s(all) + ' ' + add_c(all);
}
function cut_month(all){
    all = all.toString();
    return parseInt(all.substr(4,2));
}


// 表示の関数
function print_sum(number){
    var len = ary.length;
    var all_in, all_out;
    sum = all_in = all_out= 0;
    
    
    // 36進数から10進数
    if(len && isNaN(ary[0][0]))
        for(var i=0; i<ary.length; i++){ ary[i][0] = parseInt(ary[i][0], 36); }

    // 財布
    $('#wallet_sum').text(addP(config[2]));
    
    // 21以上を省略表示
    if(len < 20) load_list = 1;
    
    if(len > 0){
        var year = add_s(ary[0][0]);
        str = '<li data-role="list-divider">' + year + '</li>';
        
        if(load_list){
            // 全体
            for(var i=0;i<len;i++){
                if(year != add_s(ary[i][0])){
                    str += '<li data-role="list-divider">' + add_s(ary[i][0]) + '</li>';
                    year = add_s(ary[i][0]);
                }
                
                str += '<li data-icon="false" id="n' + i + '"><a href="#delete" data-rel="popup" data-position-to="window" data-transition="slideup">';
                if(ary[i][1] >= 0)
                    str += '<span class="pls_num_style">+';
                else
                    str += '<span class="min_num_style">';
                
                str += addP(ary[i][1]) + '</span><br><span class="noshorten">' + ary[i][2] + '</span><p class="ui-li-aside"><strong>' + add_c(ary[i][0]) + '</strong></p><span class="hidden_str">' + add_s(ary[i][0]) + '</span></a></li>';
            }
            $('#omission').html('');
        }else{
            // 一部
            for(var i=0;i<20;i++){
                if(year != add_s(ary[i][0])){
                    str += '<li data-role="list-divider">' + add_s(ary[i][0]) + '</li>';
                    year = add_s(ary[i][0]);
                }
                
                str += '<li data-icon="false" id="n' + i + '"><a href="#delete" data-rel="popup" data-position-to="window" data-transition="slideup">';
                if(ary[i][1] >= 0)
                    str += '<span class="pls_num_style">+';
                else
                    str += '<span class="min_num_style">';
                
                str += addP(ary[i][1]) + '</span><br><span class="noshorten">' + ary[i][2] + '</span><p class="ui-li-aside"><strong>' + add_c(ary[i][0]) + '</strong></p><span class="hidden_str">' + add_s(ary[i][0]) + '</span></a></li>';
            }
            $('#omission').html('<br><a href="" class="ui-btn ui-corner-all" onClick="load_list=1;print_sum(0)">全体読み込み</a>');
        }
        
        // 合計計算
        for(var j=0;j<len;j++){
            sum += ary[j][1];
            if(ary[j][1]<0)
                all_out += ary[j][1];
            else
                all_in += ary[j][1];
        }
        
        // 月間計算
        var mon = monPlus = monMinus = 0;
        var month = add_m(ary[0][0]);
        var mon_sum = sum;
        var diff, diffY, fixed;
        dataAry = [sum];
        
        str2 = '<tr><th>' + month + '</th><td>';
        if(mon_sum>=config[1] || config[1] == null)
            str2 += addP(sum);
        else
            str2 += '<span class="sum_red">' + addP(sum) + '</span>';
        str2 += ' 円 (';
        for(var j=0;j<len;j++){
            if(month == add_m(ary[j][0])){
                mon += ary[j][1];
                month = add_m(ary[j][0]);
                // 月間収支
                if(ary[j][1]>=0)
                    monPlus += ary[j][1];
                else
                    monMinus += ary[j][1];
            }else{
                diff = parseInt(month.substr(5,2)) - parseInt(add_m(ary[j][0]).substr(5,2));    // 収支がない月を出す
                diffY = parseInt(month.substr(0,4) - add_m(ary[j][0]).substr(0,4));
                fixed = dataAry[0]-mon;
                
                month = add_m(ary[j][0]);
                dataAry.unshift(fixed);
                if(dataAry.length>12)           // 12まで記録
                    dataAry.shift();            // 最初の要素を削除
                
                // 差が負なら年を越してる
                if(diff<0)
                    diff = 12+diff;
                else if(diffY > 0)            // 差が正で年が違うのは12ヶ月はなれてる
                    diff += 12*diffY;
                
                for(var i=1;i<diff;i++){
                    dataAry.unshift(fixed);
                    if(dataAry.length>12)       // 12まで記録
                        dataAry.shift();        // 最初の要素を削除
                }
                
                if(mon>=0)
                    str2 += '<span>+';
                else
                    str2 += '<span class="sum_red">';
                
                mon_sum -= mon;                 // 合計から月の合計を前の月の合計を出す
                str2 += addP(mon) + '</span>)</td><td>+' + addP(monPlus) + '</td><td><span class="sum_red">' + addP(monMinus) + '</span></td></tr><tr><th>' + month + '</th><td>';
                if(mon_sum>=config[1] || config[1] == null)
                    str2 += addP(mon_sum);
                else
                    str2 += '<span class="sum_red">' + addP(mon_sum) + '</span>';
                str2 += ' 円 (';
                mon = ary[j][1];
                // 月間収支
                monPlus = 0;
                monMinus = ary[j][1];
            }
        }
        if(mon>=0)
            str2 += '<span>+';
        else
            str2 += '<span class="sum_red">';
        str2 += addP(mon) + '</span>)</td><td>+' + addP(monPlus) + '</td><td><span class="sum_red">' + addP(monMinus) + '</span></td></tr>'
        
        // 表示
        // listに追加してスタイルの適用
        $('#money_list').html(str).trigger('create').listview();    // これをしてからrefreshしないとエラー吐く
        $('#money_list').listview('refresh');
        if(!kensaku) $('#money_list').hide().fadeIn('slow');
        $('#ft').fadeIn('slow');
        $('#month_table').html(str2);
        $('table').trigger('create');
        // 合計に表示
        $('#sum').text(addP(sum));
        if(sum>=config[0] && config[0] != null)
            $('#sum').attr('class', 'sum_green');
        else if(sum<=config[1] || sum < 0)
            $('#sum').attr('class', 'sum_red');
        else
            $('#sum').attr('class', 'sum_black');
        $('#first').text(add_all(ary[len-1][0]).substr(0,10));
        $('#all_in').text(addP(all_in));
        $('#all_out').text(addP(-all_out)).attr('class', 'sum_red');
        
        // 貯蓄率
        var sav;
        if(all_out && all_in + all_out > 0){
            sav = all_in - (-all_out);
            sav = Math.round(sav/all_in*10000)/100;
            $('#savings').text(addP(sav));
        }else if(all_in + all_out == 0){
            $('#savings').text(0);
        }else if(all_in + all_out < 0){
            sav = -all_in - all_out;
            sav = Math.round(sav/all_in*10000)/100;
            $('#savings').text(addP(sav));
        }else
            $('#savings').text(100);
    }
    if(number == 1)
        location.href = '#one';
    else if(location.hash == '#fore'){
        // いきなり月間表示に来た時
        if(dataAry.length>0)
            print_graph();
        else
            location.href = 'index.html';
    }
    
    //目標額の再び表示
    if(config[0]==null)
        $('#par').text('目標額を設定して下さい');
    else
        $('#par').text(Math.round(sum/config[0]*10000)/100 + ' %');
    // コンフィグ
    if(config[0] != null)
        $('#target').text(addP(config[0])+' 円');
    else
        $('#target').text('タップして設定');

    if(config[1] != null)
        $('#worst').text(addP(config[1])+' 円');
    else
        $('#worst').text('タップして設定');

    if(config[2] != null)
        $('#wallet').text(addP(config[2])+' 円');
    else
        $('#wallet').text('タップして設定');
}

// 金額設定
function config_set(str){
    var num = $('#' + str + '_money').val();
    
    if(isNaN(num) || num <= 0 || num.length == 0){
        if(num == 0 || num.length == 0){
            switch(str){
                case 'target': config[0] = null; break;
                case 'worst' : config[1] = null; break;
                case 'wallet': config[2] = 0; break;
            }
            
            in_ary();
            history.back();
        }else window.alert(alert_msg);
    }else{
        switch(str){
            case 'target': config[0] = parseInt(num); break;
            case 'worst' : config[1] = parseInt(num); break;
            case 'wallet': config[2] = parseInt(num); break;
        }
        num = addP(num) + ' 円';
        $('#' + str).text(num);
        $('#par').text(Math.round(sum/config[0]*10000)/100 + ' %');
        in_ary();
        history.back();
    }
    print_sum(0);
}

// 一部消去の表示
function deletePopup(){
    var num = 1;
    history.back();
    $('#delete').bind({
                      popupafterclose: function(){
                      if(num){
                      $('#deletePop').popup('open',{transition: 'pop'});
                      num = 0;
                      }
                      }});
}

// 一部削除
function delete_storage(){
    // 財布に影響
    var wallet = config[2] - ary[no][1];
    if(wallet>=0)
        config[2] = wallet;
    else
        config[2] = 0;
    
    if(ary.length > 1){
        ary.splice(no,1);
        in_ary();
        print_sum(0);
    }else{
        ary = [];
        config[2] = 0;
        in_ary();
        $('#sum, #wallet_sum, #wallet_sum').text(0);
        $('#money_list').text('');
        $('#ft').hide();
        sum = 0;
    }
    history.back();
}

// インポート
function import_data(){
    var data = $('#inport_data').val();
    if(data.length <= 0){
        window.alert(alert_msg);
        history.back();
    }else{
        hash_ary = JSON.parse(data);
        ary = hash_ary.H_ary;
        config = hash_ary.H_config;
        in_ary();
        $('#inport_data').val(null);
        load_list = 0;
        print_sum(1);
    }
}

// エクスポート
function export_data(){
    if(ary.length){
        var str = '<textarea cols="30" rows="6" style="overflow:auto;">' + money_storage.list + '</textarea>';
        $('#export_data').html(str).trigger('create');
    }else
        $('#export_data').text('データがありません');
}

// 消去
function reset_storage(){
    ary = [];
    config = [null,null,0];
    in_ary();
    $('#sum, #wallet_sum').text(0);
    $('#wallet').text('0 円');
    $('#target, #worst').text('タップして設定');
    $('#par').text('目標額を設定して下さい');
    $('#money_list, #month_table, #omission').text('');
    
    $('#first, #all_in, #all_out, #savings').text('---');
    $('#sum, #all_out').attr('class', 'sum_black');
    $('#ft').hide();
    
    history.back();
}

// ソート用の関数
function sort_func(a,b){
    a = parseInt(a.toString().substr(0,14));
    b = parseInt(b.toString().substr(0,14));
    return b - a;
}

// 編集
function edit_storage(num){
    if(num){
        var erace = new RegExp('\/', 'g');
        var o     = $('#data_0').val().replace(erace,'');
        var ne    = $('#data_1').val().replace(/:/g,'');
        var two   = parseInt($('#data_2').val());
        var three = $('#data_3').val();
        if(o.length != 8 || ne.length != 6 || isNaN($('#data_2').val()) || three == null){
            window.alert('入力してください');
        }else{
            // 財布に影響
            config[2] -= ary[no][1] - two;
            
            ary[no][0] = parseInt(o + ne);
            ary[no][1] = two;
            ary[no][2] = three;
            
            ary.sort(sort_func);
            in_ary();
            print_sum(1);
        }
    }else{
        $('#data_0').val(add_s(ary[no][0]));
        $('#data_1').val(add_c(ary[no][0]));
        $('#data_2').val(ary[no][1]);
        $('#data_3').val(ary[no][2]);
        
        location.hash = '#five';
    }
}

// 検索ボックス
function search(){
    var keywd = $('#keywd').val();
    var sm, a, cnt, len;
    sm = a = 0;
    len = ary.length;
    
    keywd = new RegExp(keywd);
    
    for(var i=0;i<len;i++){
        cnt = add_all(ary[i][0]) + addP(ary[i][1]) + ary[i][2];
        cnt = cnt.match(keywd);
        if(cnt != null){
            sm += ary[i][1];
            a++;
        }
    }
    if(a>0 && a != len)
        $('#re').html('合計：<span id="kensaku">' + addP(sm) + '</span> 円');
    else
        $('#re').html('');
    
    if(sm>=0)
        $('#kensaku').attr('class', 'sum_black');
    else
        $('#kensaku').attr('class', 'sum_red');
    
    setTimeout('search()', 1000);   // 疑似リアルタイム反映
}

// グラフ
var lab = options = [];
function print_graph(){
    var len = ary.length;
    
    //　Canvasを生成
    $('#canvas_place').text('');
    $('#canvas_place').html('<canvas id="canvas"></canvas>');
    // Canvasの幅を合わせる
    if(window.innerWidth > 480)
        $('#canvas').attr('width', '470');
    else
        $('#canvas').attr('width', innerWidth*0.9);
    $('#canvas').attr('height', 250);
    
    if(len){
        var can     = $('#canvas');
        var context = $('#canvas').get(0).getContext('2d');
        var dataHash = [];
        
        // ラベル
        if(dataAry.length>=12){
            lab = [cut_month(ary[0][0])];
            for(var i=10;i>=0;i--){
                lab.unshift(lab[0]-1);
                if(lab[0]<=0) lab[0] = 12;
            }
        }else{
            var temp = ary[len-1][0];
            lab = [cut_month(temp)];
            for(var i=0;i<11;i++){
                lab.push(lab[lab.length-1]+1);
                if(lab[lab.length-1] > 12) lab[lab.length-1] = 1;
            }
        }
        
        for(var i=0;i<12;i++){ lab[i] = lab[i] + '月'; }
        
        dataHash = [{
                    label: 'balance',
                    fillColor: 'rgba(151,187,205,0)',
                    strokeColor: 'rgba(151,187,255,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data : dataAry
                    }];
        
        if(config[1] != null){
            var wst = [];
            for(var i=0;i<13;i++){ wst.push(config[1]); }
            dataHash.push({label: 'worst',
                          fillColor: 'rgba(0,0,0,0)',
                          strokeColor: 'rgba(255,0,0,0.9)',
                          pointColor: 'rgba(255,0,0,0.9)',
                          pointStrokeColor: '#fff',
                          pointHighlightFill: '#fff',
                          pointHighlightStroke: 'rgba(255,0,0,1)',
                          data : wst});
        }
        
        var lineChartData = {
            labels : lab,
            datasets : dataHash
        }
        // オプション
        options = {
            // ポイントの点を表示するか
            pointDot : false,
            datasetFill : false,
            bezierCurve : true,
            bezierCurveTension : 0.5,
        }
        
        location.href = '#fore';
        var chart = new Chart(context).Line(lineChartData, options);
    }else
        window.alert('データがありません。');
}

function conf(str){
    var num = $('#' + str).text();
    
    if(num.match(/\ 円/)){
        num = num.replace(',', '').replace(' 円', '');
        num = parseInt(num);
        
        $('#' + str + '_money').val(num);
    }
}

// 3桁区切り
function addP(str) {
    var num = new String(str).replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
}