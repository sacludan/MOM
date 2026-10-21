# DON'T LIKE YOUR MOM — v0.1

一款可直接部署到 GitHub Pages、手機觸控操作的 30 秒滑卡生存遊戲。

## 遊戲規則

- **往右滑 / LIKE**：普通角色加 1 分。
- **往左滑 / NOPE**：略過，不加分；遇到媽媽應該往左滑。
- **任何包含媽媽的卡片，只要右滑就 GAME OVER**：媽媽可能是主角、藏在照片背景、相框、鏡子，甚至是名字或自介裡的 `MOM` 字樣。
- 時間為 **30 秒**。只有成功撐滿 30 秒的成績會寫入本機最高紀錄。
- 角色不會被設計成「長得很像媽媽卻不是媽媽」。媽媽固定有深藍短鮑伯髮型、白色挑染、青綠眼鏡、星星耳環、粉紅外套。

## 直接部署 GitHub Pages

1. 在 GitHub 建立新 repository（例如 `dont-like-your-mom`），設成 Public。
2. 把這個資料夾**裡面的所有檔案與 `assets` 資料夾**上傳到 repository 的最上層。注意：`index.html` 要在最上層，**不要再多包一層資料夾**。
3. 點 `Settings` → `Pages`，在 **Build and deployment** 選 `Deploy from a branch`。
4. 選 `main`、`/(root)`，然後 `Save`。
5. 等 GitHub 完成部署後，網址通常是 `https://你的帳號.github.io/dont-like-your-mom/`。
6. 用手機瀏覽器開啟即可玩。iPhone Safari 可用「分享 → 加入主畫面」；Android Chrome 可用「加入主畫面」或「安裝應用程式」。

部署不需要 npm、伺服器、API Key、資料庫、付費工具。

## 專案檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 介面與頁面結構 |
| `style.css` | 手機版與桌面版排版、特效 |
| `script.js` | 滑卡、媽媽判定、倒數、難度、計分及分享 |
| `art-data.js` | 所有插畫的分類與媽媽藏身位置 |
| `assets/profiles/` | 140 張本地 SVG 插畫，不依賴外部圖片站 |
| `assets/mom.svg` | 固定形象的虛構媽媽示意圖 |
| `sw.js`、`manifest.webmanifest` | 可加到手機主畫面的 PWA 基本設定 |
| `generate_art.py` | 插畫生成程式，想改圖片可重新執行 |

### 開發時注意

- 圖片目前是**原創程序化插畫佔位素材**，不是寫實交友照片。下一版可以依照 `art-data.js` 中的分類替換成新的圖片。若替換圖片，媽媽藏身的 `spot.x/spot.y` 座標也必須重設，失敗揭曉的紅圈才能準確。
- 最高紀錄目前存在**使用者瀏覽器的 localStorage**，不是線上世界排行榜；GitHub Pages 本身無法儲存所有玩家的分數。要做多人共用排行榜，之後需要像 Supabase / Firebase 的雲端資料服務及防作弊設計。
- 服務工作者（PWA）會快取基本介面，角色圖片會在使用後快取；**第一次遊玩仍建議有網路**，不能保證所有未看過的卡片離線可用。
- 可用電腦鍵盤 `← / →` 或 `A / D` 操作。

本遊戲中所有交友人物與媽媽皆為虛構角色，沒有使用真人肖像。
