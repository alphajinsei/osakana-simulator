/**
 * 魚クラス
 * 座標と速度を持ち、次の時間での状態を計算する
 */
class Fish {
    /**
     * @param {number} x - 初期X座標
     * @param {number} y - 初期Y座標
     * @param {number} vx - 初期X方向速度
     * @param {number} vy - 初期Y方向速度
     */
    constructor(x, y, vx, vy) {
        // 座標
        this.x = x;
        this.y = y;

        // 速度
        this.vx = vx;
        this.vy = vy;

        // 描画用のパラメータ
        this.bodyLength = 15; // 頭から尾までの長さ
        this.color = '#00d4ff'; // 魚の色

        // Boidsアルゴリズムのパラメータ
        this.separationRadius = 25;   // 分離: この距離内の魚から離れる
        this.alignmentRadius = 50;    // 整列: この距離内の魚と速度を合わせる
        this.cohesionRadius = 50;     // 結合: この距離内の魚の中心に向かう

        this.separationWeight = 30;  // 分離の影響力
        this.alignmentWeight = 1.0;   // 整列の影響力
        this.cohesionWeight = 0.5;    // 結合の影響力
    }

    /**
     * 次のフレームでの座標と速度を計算する
     * @param {number} deltaTime - 経過時間(秒)
     * @param {number} canvasWidth - キャンバスの幅
     * @param {number} canvasHeight - キャンバスの高さ
     * @param {Fish[]} allFish - すべての魚の配列(群体行動用)
     */
    update(deltaTime, canvasWidth, canvasHeight, allFish) {
        // Boidsアルゴリズムの3つの力を計算
        const sep = this.separation(allFish);
        const ali = this.alignment(allFish);
        const coh = this.cohesion(allFish);

        // 各力に重みを適用して速度に加算
        this.vx += sep.x * this.separationWeight;
        this.vy += sep.y * this.separationWeight;

        this.vx += ali.x * this.alignmentWeight;
        this.vy += ali.y * this.alignmentWeight;

        this.vx += coh.x * this.cohesionWeight;
        this.vy += coh.y * this.cohesionWeight;

        // 基本的な移動: 速度を座標に加算
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // 画面端の処理: 反対側から出現(トーラス構造)
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
    }

    /**
     * 魚を描画する
     * @param {CanvasRenderingContext2D} ctx - Canvas の描画コンテキスト
     */
    draw(ctx) {
        // 速度ベクトルから角度を計算(魚の向き)
        const angle = Math.atan2(this.vy, this.vx);

        // 頭の位置(現在の座標)
        const headX = this.x;
        const headY = this.y;

        // 尾の位置(頭から速度の逆方向に bodyLength だけ離れた位置)
        const tailX = headX - Math.cos(angle) * this.bodyLength;
        const tailY = headY - Math.sin(angle) * this.bodyLength;

        ctx.save();

        // 魚の体(線)を描画
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        // 頭(円)を描画
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(headX, headY, 3, 0, Math.PI * 2);
        ctx.fill();

        // 尾(小さい円)を描画
        // ctx.fillStyle = this.color;
        // ctx.beginPath();
        // ctx.arc(tailX, tailY, 2, 0, Math.PI * 2);
        // ctx.fill();

        ctx.restore();
    }

    /**
     * 2つの魚の距離を計算する
     * @param {Fish} other - 他の魚
     * @returns {number} 距離
     */
    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 速度を制限する
     * @param {number} maxSpeed - 最大速度
     */
    limitSpeed(maxSpeed) {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    /**
     * Separation (分離): 近くの魚から離れる
     * @param {Fish[]} allFish - すべての魚の配列
     * @returns {{x: number, y: number}} 分離のための力ベクトル
     */
    separation(allFish) {
        let steerX = 0;
        let steerY = 0;
        let count = 0;

        for (let other of allFish) {
            if (other === this) continue; // 自分自身は除外

            const distance = this.distanceTo(other);

            // 一定距離内の魚から離れる
            if (distance > 0 && distance < this.separationRadius) {
                // 離れる方向のベクトル(距離に反比例)
                const diffX = this.x - other.x;
                const diffY = this.y - other.y;

                steerX += diffX / distance; // 距離で正規化
                steerY += diffY / distance;
                count++;
            }
        }

        // 平均を取る
        if (count > 0) {
            steerX /= count;
            steerY /= count;
        }

        return { x: steerX, y: steerY };
    }

    /**
     * Alignment (整列): 近くの魚と速度を合わせる
     * @param {Fish[]} allFish - すべての魚の配列
     * @returns {{x: number, y: number}} 整列のための力ベクトル
     */
    alignment(allFish) {
        let avgVx = 0;
        let avgVy = 0;
        let count = 0;

        for (let other of allFish) {
            if (other === this) continue;

            const distance = this.distanceTo(other);

            // 一定距離内の魚の速度を平均する
            if (distance > 0 && distance < this.alignmentRadius) {
                avgVx += other.vx;
                avgVy += other.vy;
                count++;
            }
        }

        if (count > 0) {
            avgVx /= count;
            avgVy /= count;

            // 平均速度に向かう力(現在の速度との差分)
            return {
                x: avgVx - this.vx,
                y: avgVy - this.vy
            };
        }

        return { x: 0, y: 0 };
    }

    /**
     * Cohesion (結合): 近くの魚の中心に向かう
     * @param {Fish[]} allFish - すべての魚の配列
     * @returns {{x: number, y: number}} 結合のための力ベクトル
     */
    cohesion(allFish) {
        let centerX = 0;
        let centerY = 0;
        let count = 0;

        for (let other of allFish) {
            if (other === this) continue;

            const distance = this.distanceTo(other);

            // 一定距離内の魚の位置を平均する
            if (distance > 0 && distance < this.cohesionRadius) {
                centerX += other.x;
                centerY += other.y;
                count++;
            }
        }

        if (count > 0) {
            centerX /= count;
            centerY /= count;

            // 中心に向かう方向ベクトル
            return {
                x: centerX - this.x,
                y: centerY - this.y
            };
        }

        return { x: 0, y: 0 };
    }
}
