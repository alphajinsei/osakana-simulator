/**
 * 魚の群体シミュレーター
 */
class Simulator {
    constructor(canvasId) {
        // Canvas の取得と設定
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // キャンバスのサイズ
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // 魚の配列
        this.fishes = [];

        // 障害物の配列と有効/無効フラグ
        this.obstacles = [];
        this.obstaclesEnabled = true; // true: 障害物あり / false: 障害物なし

        // 時間管理
        this.lastTime = performance.now();

        // 初期化
        this.init();

        // クリックイベントを設定
        this.setupClickHandler();
    }

    /**
     * 初期化: 魚を生成する
     */
    init() {
        const fishCount = 80; // 魚の数

        for (let i = 0; i < fishCount; i++) {
            // ランダムな位置
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;

            // ランダムな速度(方向と速さ)
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 50; // 50-100 ピクセル/秒
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            // 魚を作成して配列に追加
            const fish = new Fish(x, y, vx, vy);
            this.fishes.push(fish);
        }

        // 魚の数を表示
        this.updateFishCount();

        // 障害物の初期化
        if (this.obstaclesEnabled) {
            this.initObstacles();
        }
    }

    /**
     * 障害物を初期化する
     */
    initObstacles() {
        // 中央に大きめの円形障害物を配置
        this.obstacles.push(new Obstacle(600, 450, 100, 'circle'));

        // 左上に小さめの円形障害物
        this.obstacles.push(new Obstacle(300, 250, 60, 'circle'));

        // 右下に中サイズの円形障害物
        this.obstacles.push(new Obstacle(900, 650, 80, 'circle'));
    }

    /**
     * すべての魚の状態を更新する
     * @param {number} deltaTime - 前フレームからの経過時間(秒)
     */
    updateFishes(deltaTime) {
        // 障害物データを取得（無効の場合は空配列）
        const obstacles = this.obstaclesEnabled ? this.obstacles : [];

        for (let fish of this.fishes) {
            // 各魚の座標と速度を更新（障害物データも渡す）
            fish.update(deltaTime, this.width, this.height, this.fishes, obstacles);

            // 速度を制限(暴走防止)
            fish.limitSpeed(150);
        }
    }

    /**
     * すべての魚を描画する
     */
    drawFishes() {
        // 画面をクリア
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 障害物を先に描画（魚の下に表示）
        if (this.obstaclesEnabled) {
            this.drawObstacles();
        }

        // すべての魚を描画
        for (let fish of this.fishes) {
            fish.draw(this.ctx);
        }
    }

    /**
     * すべての障害物を描画する
     */
    drawObstacles() {
        for (let obstacle of this.obstacles) {
            obstacle.draw(this.ctx);
        }
    }

    /**
     * アニメーションループ
     */
    animate() {
        // 現在の時刻を取得
        const currentTime = performance.now();

        // 前フレームからの経過時間を計算(ミリ秒 → 秒)
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 更新と描画
        this.updateFishes(deltaTime);
        this.drawFishes();

        // 次のフレームをリクエスト
        requestAnimationFrame(() => this.animate());
    }

    /**
     * クリックイベントハンドラを設定する
     */
    setupClickHandler() {
        this.canvas.addEventListener('click', (event) => {
            // クリック位置を取得
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // クリック位置に新しい魚を追加
            this.addFish(x, y);
        });
    }

    /**
     * 指定した位置に魚を追加する
     * @param {number} x - X座標
     * @param {number} y - Y座標
     */
    addFish(x, y) {
        // ランダムな速度(方向と速さ)
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 50; // 50-100 ピクセル/秒
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        // 魚を作成して配列に追加
        const fish = new Fish(x, y, vx, vy);
        this.fishes.push(fish);

        // 魚の数を更新
        this.updateFishCount();
    }

    /**
     * 魚の数表示を更新する
     */
    updateFishCount() {
        document.getElementById('fishCount').textContent = this.fishes.length;
    }

    /**
     * シミュレーションを開始する
     */
    start() {
        this.animate();
    }
}

// ページ読み込み完了後にシミュレーターを起動
window.addEventListener('DOMContentLoaded', () => {
    const simulator = new Simulator('canvas');
    simulator.start();
});
