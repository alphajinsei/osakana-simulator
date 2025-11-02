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
    }

    /**
     * すべての魚の状態を更新する
     * @param {number} deltaTime - 前フレームからの経過時間(秒)
     */
    updateFishes(deltaTime) {
        for (let fish of this.fishes) {
            // 各魚の座標と速度を更新
            fish.update(deltaTime, this.width, this.height, this.fishes);

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

        // すべての魚を描画
        for (let fish of this.fishes) {
            fish.draw(this.ctx);
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
