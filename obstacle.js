/**
 * 障害物クラス
 * 魚が回避すべき障害物を表現する
 */
class Obstacle {
    /**
     * @param {number} x - 中心X座標
     * @param {number} y - 中心Y座標
     * @param {number} radius - 半径
     * @param {string} shape - 形状 ('circle' または 'rectangle')
     * @param {number} width - 幅（矩形の場合）
     * @param {number} height - 高さ（矩形の場合）
     */
    constructor(x, y, radius, shape = 'circle', width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.shape = shape;
        this.width = width || radius * 2;
        this.height = height || radius * 2;

        // 描画用のパラメータ
        this.color = '#5a5a5a';        // 灰色（岩のような色）
        this.strokeColor = '#3a3a3a';  // 濃いグレー
        this.strokeWidth = 3;
    }

    /**
     * 障害物を描画する
     * @param {CanvasRenderingContext2D} ctx - Canvas の描画コンテキスト
     */
    draw(ctx) {
        ctx.save();

        if (this.shape === 'circle') {
            // 円形の障害物を描画
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 中心に小さい点を描画（視覚的な効果）
            ctx.fillStyle = this.strokeColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'rectangle') {
            // 矩形の障害物を描画
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;

            const rectX = this.x - this.width / 2;
            const rectY = this.y - this.height / 2;

            ctx.fillRect(rectX, rectY, this.width, this.height);
            ctx.strokeRect(rectX, rectY, this.width, this.height);
        }

        ctx.restore();
    }

    /**
     * 点（魚）と障害物の距離を計算する
     * @param {number} px - 点のX座標
     * @param {number} py - 点のY座標
     * @returns {number} 距離
     */
    distanceToPoint(px, py) {
        if (this.shape === 'circle') {
            // 円形の場合: 中心からの距離 - 半径
            const dx = px - this.x;
            const dy = py - this.y;
            const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
            return Math.max(0, distanceToCenter - this.radius);
        } else if (this.shape === 'rectangle') {
            // 矩形の場合: 最も近い辺までの距離
            const rectX = this.x - this.width / 2;
            const rectY = this.y - this.height / 2;

            // 点が矩形の外側のどの領域にあるかを判定
            const closestX = Math.max(rectX, Math.min(px, rectX + this.width));
            const closestY = Math.max(rectY, Math.min(py, rectY + this.height));

            const dx = px - closestX;
            const dy = py - closestY;

            return Math.sqrt(dx * dx + dy * dy);
        }

        return Infinity;
    }

    /**
     * 障害物の中心から点への方向ベクトルを計算する
     * @param {number} px - 点のX座標
     * @param {number} py - 点のY座標
     * @returns {{x: number, y: number}} 正規化された方向ベクトル
     */
    getDirectionFromCenter(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
            // 中心と点が一致している場合は、ランダムな方向を返す
            const angle = Math.random() * Math.PI * 2;
            return {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
        }

        // 正規化
        return {
            x: dx / distance,
            y: dy / distance
        };
    }
}
