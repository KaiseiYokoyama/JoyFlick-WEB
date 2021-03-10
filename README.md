# JoyFlick WEB version
[Gamepad API][gamepadapi]とかいうのがあるらしい．

## CSS Framework
- 使ったことのないフレームワークを使ってみたい
- MaterializeとBulma，Bootstrapは使ったことがある
- ReactやVueを導入するほど大きなプロジェクトにはならなさそうなので，
これらのWEBフレームワークのみで使えるCSSフレームワークも除外
  
-> [Blaze UI][blazeui]にしようかな……？

[gamepadapi]: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
[blazeui]: https://www.blazeui.com/

## TODO
- [ ] 予測変換の実装
   - https://www.google.co.jp/ime/cgiapi.html
- [ ] デザインの改善
   - 操作説明
   - ナビゲーションポップアップ
   - テキストエリアの見た目の改善
- [ ] 通知の実装
   - コントローラの接続・更新・切断
     - 振動機能に対応しているかどうかを表示
- [ ] バグ修正
   - [x] 最後の文字を削除した時にカーソルが一つ手前に動く
   - [x] カーソルの位置に関わらず，新たな文字が常に末尾に書き込まれる