# DON'T LIKE YOUR MOM — v0.3 (18 張真人照片)

這是可以直接部署到 GitHub Pages 的**完整專案**：沒有使用任何舊版的 SVG 人物插畫，只有你上傳的兩包素材：

- `assets/profiles/hidden_01.webp` ～ `hidden_10.webp`：10 張媽媽亂入場景。
- `assets/profiles/mom_01.webp` ～ `mom_08.webp`：8 張媽媽素材（含合照、特寫）。

共 18 張照片，均從你提供的 ZIP 轉換或複製。所有舊版的 `n*.svg`、`b*.svg`、`f*.svg`、`mr*.svg` 都已移除。圖片經 WebP 壓縮，並保留預載滑卡動畫。首頁與 App 圖示也換成這批媽媽素材。

## 重要：本次遊戲是「全媽媽測試模式」

**你提供的 18 張圖片每一張都有媽媽。** 因此這版為了讓遊戲仍可正常計分，採用：

- 左滑 NOPE：正確避開媽媽，**+1 分**。
- 右滑 LIKE：滑到媽媽，**立即 GAME OVER**。
- 30 秒結算，記錄最高避開數、隱藏媽媽的避開數。
- 初期先出現媽媽本人，接著增加各種背景亂入照片。

這是因為目前沒有不包含媽媽的照片。之後上傳一批正常交友照後，就能恢復你原始設計的「LIKE 正常角色 +1，LIKE 到媽媽失敗」規則，而不必改動圖片。

## GitHub Pages 部署

1. 解壓縮本 ZIP。不要把 ZIP 原檔直接放上 GitHub。
2. 建立或開啟 GitHub Repository。若要完全清除舊版內容，建議先在本地 Repository 中刪除舊遊戲檔案，再將本資料夾的檔案全部複製到**Repository 根目錄**（確保 `index.html` 位於根目錄）。
3. 使用 GitHub Desktop：`Commit to main` → `Push origin`。
4. GitHub 專案 `Settings` → `Pages` → `Deploy from a branch` → `main` / `/(root)` → `Save`。
5. 部署完成後重新開啟網頁。若舊版仍然出現，可關閉該網站分頁，再重新整理。新版的 service worker 將清理舊圖片快取。

## 技術資訊

靜態 HTML/CSS/JavaScript；不需要安裝套件，也不需要後端。支援手機觸控滑卡、電腦滑鼠滑卡、預載 5 張圖片、30 秒倒數、本機最佳紀錄、失敗時圈出媽媽位置，以及 PWA 離線快取。請使用 HTTPS (GitHub Pages) 測試 PWA 與分享功能。
