# 魚の群体シミュレーター (Osakana Simulator)

Boidsアルゴリズムを使用した魚の群体シミュレーションプログラムです。HTML5 Canvasを使って、リアルタイムで群体の動きを表示します。

## 概要

このプロジェクトは、Craig Reynoldsが1986年に提唱したBoidsアルゴリズムを実装した群体シミュレーターです。80匹の魚が画面上を泳ぎ、3つの基本ルール（分離・整列・結合）に従って自然な群体行動を再現します。

さらに、純粋なBoidsアルゴリズムの3つの原理（Separation, Alignment, Cohesion）に加えて、第4の原理として**障害物回避（Avoidance）**機能を実装しました。これにより、魚たちは仲間との群体行動を維持しながら、環境中の障害物を自然に避けて泳ぐことができます。

## 主な特徴

- **Boidsアルゴリズムの実装**: 分離（Separation）、整列（Alignment）、結合（Cohesion）の3つの基本ルールに基づく群体行動
- **障害物回避機能**: Boidsの3原理を拡張し、第4の原理として障害物回避（Avoidance）を実装。魚が障害物を検知して自然に避ける動きを実現
- **シンプルな描画**: 魚は頭（点）と尾（線）で表現され、軽量で高速な描画を実現
- **リアルタイムシミュレーション**: requestAnimationFrameを使った滑らかなアニメーション
- **トーラス空間**: 画面端から出た魚は反対側から出現し、無限の空間を表現
- **インタラクティブ**: Canvas上をクリックすると、その位置に新しい魚を追加可能

## ファイル構成

```
osakana-simulator/
├── index.html      # メインHTMLファイル（UI・レイアウト）
├── simulator.js    # シミュレーター本体クラス（初期化・更新・描画ループ）
├── fish.js         # 魚クラス（Boidsアルゴリズムの実装）
├── obstacle.js     # 障害物クラス（障害物の表現と距離計算）
└── README.md       # このファイル
```

## 実装の詳細

### Fish クラス ([fish.js](fish.js))

各魚は以下のプロパティを持ちます：

- **座標**: `x`, `y` - 画面上の位置
- **速度**: `vx`, `vy` - X方向とY方向の速度
- **描画パラメータ**: 体長、色など

**Boidsアルゴリズムの3原理**:

魚の動きは、以下の3つの基本原理によって決定されます：
- `separationRadius`: 25px - この距離内の魚から離れる
- `alignmentRadius`: 50px - この距離内の魚と速度を合わせる
- `cohesionRadius`: 50px - この距離内の魚の中心に向かう
- `separationWeight`: 30 - 分離の影響力（最も強い）
- `alignmentWeight`: 1.0 - 整列の影響力
- `cohesionWeight`: 0.5 - 結合の影響力

**第4の原理: 障害物回避（拡張機能）**:

純粋なBoidsアルゴリズムに加えて、環境との相互作用を実現するために障害物回避機能を追加しました：

- `avoidanceRadius`: 100px - 障害物を検知する距離
- `avoidanceWeight`: 50 - 回避の影響力

この第4の原理により、魚たちは群体行動を維持しながら、障害物を自然に回避できます。

**主要メソッド**:
- `update()`: 次フレームの座標と速度を計算（4つの力を統合）
- `draw()`: Canvas上に魚を描画
- `separation()`: 【第1原理】近くの魚から離れる力を計算
- `alignment()`: 【第2原理】近くの魚と速度を合わせる力を計算
- `cohesion()`: 【第3原理】近くの魚の中心に向かう力を計算
- `avoidObstacles()`: 【第4原理】障害物から離れる力を計算（拡張機能）
- `limitSpeed()`: 最大速度制限（暴走防止）

### Simulator クラス ([simulator.js](simulator.js))

シミュレーション全体を管理するクラスです。

**主要機能**:
- 80匹の魚を初期化（ランダムな位置と速度）
- 障害物の初期化と管理（ON/OFF切り替え可能）
- 各フレームですべての魚の状態を更新
- Canvas上にすべての魚と障害物を描画
- アニメーションループの管理（`requestAnimationFrame`）
- クリックイベントの処理（クリック位置に新しい魚を追加）
- 魚の数をリアルタイム更新

**障害物の設定**:
- `obstaclesEnabled`: true/false で障害物のON/OFF切り替え
- デフォルトで3つの円形障害物を配置（中央、左上、右下）

### Obstacle クラス ([obstacle.js](obstacle.js))

障害物を表現するクラスです。

**プロパティ**:
- 中心座標、半径、形状（円形/矩形）
- 岩のような灰色の描画設定

**主要メソッド**:
- `draw()`: Canvas上に障害物を描画
- `distanceToPoint()`: 点から障害物までの距離を計算
- `getDirectionFromCenter()`: 障害物の中心から点への方向ベクトルを取得

### UI ([index.html](index.html))

- 1200x900のCanvas領域
- ダークテーマのUI（深海をイメージ）
- 魚の数をリアルタイム表示

## 実行方法

1. このディレクトリでHTTPサーバーを起動するか、`index.html`をブラウザで直接開きます
2. 自動的に80匹の魚が泳ぎ始め、3つの障害物が表示されます
3. Canvas上の任意の場所をクリックすると、その位置に新しい魚が追加されます

## 操作方法

- **クリック**: Canvas上の任意の場所をクリックすると、その位置に新しい魚が生成されます
- 追加された魚は、既存の魚たちと同じBoidsアルゴリズムに従って群体行動を開始します
- 魚は障害物を自然に回避しながら泳ぎます
- 魚の数は画面下部にリアルタイムで表示されます

## 障害物の設定

障害物機能はコード上で簡単にON/OFF切り替えができます。

### 障害物を無効にする
[simulator.js](simulator.js) の19行目を変更：
```javascript
this.obstaclesEnabled = false; // 障害物なし
```

### 障害物を追加・変更する
[simulator.js](simulator.js) の `initObstacles()` メソッドを編集：
```javascript
// 新しい障害物を追加
this.obstacles.push(new Obstacle(x座標, y座標, 半径, 'circle'));
```

## 今後の拡張可能性

現在の実装は以下の拡張に対応できる構造になっています：

- 魚の数や速度パラメータの動的変更
- 矩形障害物のサポート
- クリックで障害物を追加する機能
- 捕食者と被食者の関係
- 魚の種類による異なる行動パターン
- パフォーマンス最適化（空間分割アルゴリズムなど）

## 技術スタック

- **HTML5 Canvas**: 2D描画
- **Vanilla JavaScript**: 依存ライブラリなし
- **ES6 Class構文**: オブジェクト指向設計

## 参考文献

- Craig Reynolds, "Flocks, Herds, and Schools: A Distributed Behavioral Model" (1987)
- [Boids (Wikipedia)](https://en.wikipedia.org/wiki/Boids)