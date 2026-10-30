# Deep Field — データ・精度・再現範囲

本アプリは「世界最高精度」を実証した製品ではありません。天体位置の数値精度、元データの観測誤差、画像の再現度、人工衛星の予測誤差は別の量です。比較対象・条件を定義せず順位を主張しません。

## 位置計算

NASA/JPLの **DE440s SPK** から、2025-01-01 TDB以上2031-01-01 TDB未満の区間のChebyshev係数を無損失のFloat64で抽出しています。ブラウザは元の区間・次数の多項式をClenshaw法で評価します。日ごとの線形補間や円軌道の近似は使いません。ファイルは610,800 bytes、SHA-256を読み込み時に検査します。元ファイルと抽出ファイルのチェックサムは [ephemeris-meta.js](../src/space/data/ephemeris-meta.js) に記録しています。

基準はICRF/J2000、時刻はTDB、単位はkmとkm/s。描画ではEarth equatorial radius = 6378.1366 kmを1単位とし、すべての長さに同じ倍率を適用します。GPUへの入力はカメラ位置をFloat64で差し引いてからFloat32へ変換し、地球表面付近での座標の桁落ちを抑えています。マーカーのピクセル寸法は位置を識別するための表示で、衛星の実寸ではありません。

### 検証結果

[機械可読の結果](space-validation.json)。`node scripts/validate-space.mjs --write` で再計算できます。

| 検証 | 条件 | 今回の最大差 |
|---|---|---|
| 元SPK対ブラウザ位置計算 | NAIF CSPICEで評価した2,010状態。乱数時刻・全対象・係数区間境界の前後を含む | 約3.515 mm |
| 速度 | 同じ2,010状態 | 約3.739 × 10⁻¹² km/s |
| 自転軸・姿勢 | CSPICE pxform、10天体×4時刻 | 軸の単位ベクトル差 約2.855 × 10⁻¹¹ |
| 独立サービスの照合 | Horizons DE441の地球中心、2026-10-30・31 TDB、2状態 | 約3.008 cm |
| SGP4の実装比較 | Python sgp4対Satellite.js、8機×元期と前後1日、24状態 | 約2 × 10⁻¹⁰ km（TEME） |

**3.515mmは元SPKの数値再現の差です。宇宙の真の位置の誤差、外惑星の中心位置の誤差、描画のピクセル誤差、衛星の予測精度を意味しません。** Horizonsの2状態だけから全期間の精度を保証することもありません。

### 基準点と制限

- 太陽・地球・月は中心位置を使用します。水星・金星はDE440の惑星系重心を使用し、自然衛星がないため中心に対応します。
- 火星・木星・土星・天王星・海王星は **惑星系重心** を使用します。各惑星の固体中心を得るための別の衛星系SPKは同梱していません。中心と重心の差はこの数値検証の誤差には含まれません。
- 同一TDB時刻の幾何位置を表示します。光行時間、恒星光行差、重力による光の曲がり、観測者の大気屈折は未適用です。
- UTC→TDBは既知のTAI−UTC=37秒、TT−TAI=32.184秒と主要な周期項で変換します。将来のうるう秒は予測しません。UTC変換自体は完全な相対論的時刻変換ではありません。核となる検証にはTDBを直接使用しています。
- 自転軸・自転位相・三軸半径はNAIF pck00011のIAUモデルを使用します。地球の最新のUT1、極運動、EOPや月の高精度な数値秤動PCKは使用していません。
- 範囲外では外挿せず、再生を停止します。時刻は描画FPSに依存しない実経過時間で進みます。

## 人工衛星

CelesTrakのStarlink GPデータから256機を標本抽出し、OMMの元期・平均軌道要素・BSTARなどをSatellite.jsのSGP4に入力します。公開版同梱の取得日は2026-10-30です。元期は各機ごとに保持し、前後3日を超えた衛星は表示しません。期限内であっても正確な位置を保証するものではありません。運用上の軌道変更、姿勢、空気抵抗、宇宙天気によって予測は実際とずれます。

TEMEから、分点差とAstronomy Engineの歳差・章動の回転を用いてJ2000方向へ変換します。この変換はSGP4のTEME実装比較とは別です。地球のEOPを含む厳密なTEME/GCRS変換の独立した精度保証はしていません。軌道要素は運用者の精密軌道暦ではありません。画面の衛星は概略形状で、正確なStarlink世代別の形状・姿勢・材質ではありません。

「衛星データを更新」はCelesTrakへ1回だけ問い合わせ、失敗時は保存済みデータを保持します。ブラウザや提供元のCORS・通信制限によって更新できない場合があります。有効期間外に架空の衛星群へ置き換える動作はありません。256機は全Starlink衛星ではなく、取得したカタログの一部です。

Satellite.js 6.0.1のOMMパーサはJavaScript Dateで元期のサブミリ秒を失っていたため、少数部を保持する変更を加えています。ライセンスと改変点は [THIRD_PARTY.md](../THIRD_PARTY.md) を参照。

## 見た目

- 地球: NASA Blue Marble Next Generation、2004年1月の合成画像を2048×1024に縮小。大陸と海の配置は画像由来。現在の雲・気象・積雪ではありません。
- 月: NASA SVS CGI Moon Kit、LRO/LROC 2025 color map、2048×1024。色と模様は合成画像由来。表面の幾何学的な地形変位や着陸地点のメートル単位の地形は再現していません。
- 火星・木星など: NASA/JPL/USGSの過去の全球地図。低解像度、欠測、画像処理による色調変更があります。土星・天王星・海王星のJPL地図は模式画像であり、実際の最新の雲を再現していません。
- 金星の雲と太陽の表面は模式的な色です。実際の太陽活動や雲の変化を再現していません。
- 自転軸、扁平率、土星の環の面はIAU/PCKに従います。環の光学的厚さ・微細構造・粒子は簡略化されています。
- WebGLは楕円体のレイ交差、Lambert照明、有限サイズの太陽と遮蔽天体の円盤の重なりから日食・月食の遮光率を計算します。大気の縁は簡略表現で、多重散乱やスペクトル計算ではありません。
- 互換Canvas描画も同じ位置と姿勢データ・観測画像を使います。画素数、キャッシュ更新、環の遮蔽、陰影は近似です。研究用の測光・画像解析に使うことは想定していません。
- 太陽系全体表示でも位置は実寸です。名前と点は拡大した位置マーカーです。偽の星空・星雲は描いていません。露出は見やすさの調整値で、物理カメラを校正した値ではありません。

## 一次資料・データ出典

- [JPL DE440/DE441 と論文](https://ssd.jpl.nasa.gov/doc/de440_de441.html)
- [DE440s 元SPK](https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440s.bsp)
- [NAIF SPK Required Reading](https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/spk.html)
- [NAIF PCK](https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00011.tpc)
- [NAIF leap seconds](https://naif.jpl.nasa.gov/pub/naif/generic_kernels/lsk/naif0012.tls)
- [Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html) — ビルド時の検証のみ。公開ブラウザにNASA APIを埋め込んでいません。
- [NASA Blue Marble](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/)
- [NASA SVS CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) — NASA's Scientific Visualization Studio、Ernie Wright、LRO/LROC。
- [JPL Texture Maps](https://maps.jpl.nasa.gov/tmaps/) — NASA/JPL/Caltech/USGS。各地図のCreator/Ownerと注意事項に従い、見た目の資料として使用。
- [CelesTrak GP/OMM](https://celestrak.org/NORAD/documentation/gp-data-formats.php)
- [Satellite.js](https://github.com/shashwatak/satellite-js) / [Astronomy Engine](https://github.com/cosinekitty/astronomy)

## 再現

開発環境で `pip install jplephem spiceypy numpy` を実行し、`python tools/build-space-data.py`、`node scripts/validate-space.mjs --write`、`npm test` の順に実行します。元SPKのダウンロードはキャッシュします。ブラウザではnpm/pipや外部CDNは不要です。
