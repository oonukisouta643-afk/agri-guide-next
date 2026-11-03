/**
 * 就農シミュレーターの回答を受け取り、スプレッドシートに記録して Gmail に知らせる（2026年11月3日）
 * サイト側：src/lib/simulator/notify.ts（環境変数 NEXT_PUBLIC_SIMULATOR_NOTIFY_URL にこのウェブアプリの URL を入れる）
 *
 * 設定の手順（運営者の Google アカウントで1回だけ）
 *  1. 記録先のスプレッドシートを開く（新しく作ってよい）→「拡張機能」→「Apps Script」
 *  2. 最初からある Code.gs の中身を消して、このファイルの中身を貼り、保存する
 *  3. 右上の「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *       次のユーザーとして実行：自分 ／ アクセスできるユーザー：全員
 *  4. 「デプロイ」→ 権限の確認で、自分のアカウントを選んで許可する
 *  5. 表示された「ウェブアプリの URL」（https://script.google.com/macros/s/…/exec）をコピーする
 *  6. Vercel の agri-guide-next →「Settings」→「Environment Variables」に
 *       名前 NEXT_PUBLIC_SIMULATOR_NOTIFY_URL、値 5. の URL、環境は Production だけにする（Preview にも入れると、確認のたびに本物のメールが届く）
 *  7. そのあとにデプロイされた版から、送信が始まる（環境変数だけ変えたときは Redeploy が要る）
 *
 * スクリプトを直したときは「デプロイを管理」→ 鉛筆 →「バージョン：新バージョン」で更新する（URL は変わらない）。
 * 通知の宛先は、このスクリプトを実行するアカウント（＝デプロイした人）の Gmail。
 */

var SHEET_NAME = 'シミュレーター';
var COLUMNS = ['受信日時', '種類', '意欲の目安', '年代', '家族', 'いまの住まい', '品目', '農業の経験', '就農の形', '規模',
  '自己資金', '目標の年収', '一番の不安', '動きたい時期', '知りたいこと', 'メールアドレス', '聞きたいこと'];
var ANSWER_KEYS = COLUMNS.slice(3, 15);
// 10分間にこの件数を超えたら、記録だけにしてメールは送らない。
// URL はサイトの中に見えているので、いたずらの送信は起こりうる。無料の Google アカウントは1日100通ほどが上限のため、
// 上限を使い切られて本物の通知が止まらないようにする（記録はスプレッドシートに残る）
var MAIL_LIMIT_PER_10MIN = { result: 20, contact: 10 };

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.kind !== 'result' && data.kind !== 'contact') return json_({ ok: false });
    if (data.kind === 'contact' && data.website) return json_({ ok: true }); // ボット除けの欄が埋まっていたら捨てる

    var answers = data.answers || {};
    var email = data.kind === 'contact' ? clip_(data.email, 200) : '';
    if (data.kind === 'contact' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false });
    var message = data.kind === 'contact' ? clip_(data.message, 1000) : '';
    var level = Number(data.level) || '';

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = sheet_();
      var row = [new Date(), data.kind === 'contact' ? '返事の希望' : '結果', level];
      ANSWER_KEYS.forEach(function (k) { row.push(safe_(clip_(answers[k], 200))); });
      row.push(safe_(email), safe_(message));
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    if (underLimit_(data.kind)) mail_(data.kind, level, answers, email, message);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false });
  }
}

function mail_(kind, level, answers, email, message) {
  var to = Session.getEffectiveUser().getEmail();
  var lines = ANSWER_KEYS.map(function (k) { return k + '：' + clip_(answers[k], 200); });
  var subject, body, options = {};
  if (kind === 'contact') {
    subject = '【Agri-Guide】シミュレーターから返事の希望が届きました';
    body = ['シミュレーターの結果画面から、返事の希望が届きました。', '', 'メールアドレス：' + email, '', '聞きたいこと：',
      message || '（なし）', '', '― 回答 ―', '意欲の目安：Lv' + level].concat(lines).join('\n');
    options.replyTo = email; // このメールに返信すると、相手に届く
  } else {
    subject = '【Agri-Guide】シミュレーターの結果が出ました（Lv' + level + '）';
    body = ['シミュレーターで10問に答えた人がいました（氏名・連絡先はありません）。', '', '意欲の目安：Lv' + level]
      .concat(lines).concat(['', '記録：' + SpreadsheetApp.getActiveSpreadsheet().getUrl()]).join('\n');
  }
  MailApp.sendEmail(to, subject, body, options);
}

function underLimit_(kind) {
  var cache = CacheService.getScriptCache();
  var key = kind + 'Mails';
  var n = Number(cache.get(key) || 0);
  if (n >= MAIL_LIMIT_PER_10MIN[kind]) return false;
  cache.put(key, String(n + 1), 600);
  return true;
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clip_(v, max) {
  return String(v == null ? '' : v).slice(0, max);
}

// 「=」などで始まる文字が式として動かないようにする
function safe_(v) {
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
