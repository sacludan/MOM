DON’T LIKE YOUR MOM v0.5.8 — 全球排行榜成績提交修正（僅更新檔）

問題：原遊戲 COMBO 會計入「成功左滑媽媽獨照」與「背景亂入媽媽」，但提交排行榜時卻只送出背景媽媽數。
Supabase 原本的安全驗證會檢查 best_combo <= likes + mom_dodged；若這局也躲過媽媽獨照，就可能回報 Invalid score submission。

修正：提交給 Supabase 的 p_hidden_avoided 欄位，改傳「全部成功避開的媽媽數量」（包含媽媽獨照與背景媽媽）。
這也符合現有排行榜標籤「MOM DODGED」。遊戲結算畫面的 HIDDEN MOMS 仍維持顯示背景亂入媽媽的數量。
不用修改 Supabase SQL 或公開金鑰。原本已上傳的歷史成績不會回溯改數字。

GitHub 更新：
1. 將 index.html、script.js、sw.js 上傳至專案根目錄，覆蓋舊檔。
2. Commit → Push，等 GitHub Pages 更新。
3. 朋友將遊戲從背景完全關閉後重新開啟（必要時 Safari 重新整理）；新遊戲顯示 v0.5.8 才是新版。
4. 重新玩滿 45 秒再送出；已失敗的那局成績不會自動補傳。

保留：99 張照片、iPhone 18 Pro 版面、45 秒、好友固定抽牌、媽媽嘲諷、音效與全球排行。
注意：這是修正已找出的前端／SQL 欄位不一致；無法直接連上使用者的 Supabase，因此實際雲端上榜仍需上線後驗證。
