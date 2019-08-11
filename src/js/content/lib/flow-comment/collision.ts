// コメントの当たり判定
// コメントの座標と再生時間から求めた擬似的な平行四辺形が重なっているか求める

export default class {

    // 点a,bからなる線分と、点c,dからなる線分が交差しているかどうか調べる関数
    static isCollisionLines(a, b, c, d) {
      var ta = (c.x - d.x) * (a.y - c.y) + (c.y - d.y) * (c.x - a.x);
      var tb = (c.x - d.x) * (b.y - c.y) + (c.y - d.y) * (c.x - b.x);
      var tc = (a.x - b.x) * (c.y - a.y) + (a.y - b.y) * (a.x - c.x);
      var td = (a.x - b.x) * (d.y - a.y) + (a.y - b.y) * (a.x - d.x);

      return tc * td < 0 && ta * tb < 0;
    };

    // コメントとコメントが衝突する場合trueになる関数
    static isCollisionComments(c1, c2) {
        // まずコメントごとの点と点の組み合わせを羅列（書き方がダサい）
        const c1_lines = [
            [c1[0], c1[1]],
            [c1[0], c1[2]],//
            [c1[0], c1[3]],
            [c1[1], c1[2]],
            [c1[1], c1[3]],//
            [c1[2], c1[3]],
        ];
        const c2_lines = [
            [c2[0], c2[1]],
            [c2[0], c2[2]],
            [c2[0], c2[3]],
            [c2[1], c2[2]],
            [c2[1], c2[3]],
            [c2[2], c2[3]],
        ];

        // すべての線分の組み合わせを総当たりで衝突を調べる
        return c1_lines.some(c1_line => {
            return c2_lines.some(c2_line => {
                return this.isCollisionLines(c1_line[0], c1_line[1], c2_line[0], c2_line[1]);
            })
        })
    }
}


/*
参考にしたサイト

http://mslabo.sakura.ne.jp/WordPress/make/processing%E3%80%80%E9%80%86%E5%BC%95%E3%81%8D%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/%E5%A4%9A%E8%A7%92%E5%BD%A2%E5%90%8C%E5%A3%AB%E3%81%AE%E5%BD%93%E3%81%9F%E3%82%8A%E5%88%A4%E5%AE%9A%E3%82%92%E8%A1%8C%E3%81%86%E3%81%AB%E3%81%AF/
https://qiita.com/ykob/items/ab7f30c43a0ed52d16f2
https://www.jstage.jst.go.jp/article/bplus/11/1/11_4/_pdf

*/
