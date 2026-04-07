[**HOME**](README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

# Extensions Installation
1. กดลิ้งเพื่อโหลด Extensions<br>
   Chrome: [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en-US&utm_source=ext_sidebar)   
   Edge: [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)   
   Firefox: [Addons Mozilla](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)   
2. กดติดตั้ง Tampermonkey
3. มองหา Icon TamperMonkey <picture><img src="assets/tampermonkey_logo.png" width="15" height="15" alt="Tampermonkey Logo"></picture> ตรงพื้นที่ Extensions  
   (ถ้าไม่เห็นให้มองหา Icon รูปจิ๊กซอมุมขวาบนของบราวเซอร์ แล้วกด📌Pin)
4. **ข้อนี้สำหรับ Chrome และ Edge**  
   คลิกขวาที่ Icon TamperMonkey <picture><img src="assets/tampermonkey_logo.png" width="15" height="15" alt="Tampermonkey Logo"></picture> เลือก Manage extension
5. มองหา Allow User Scripts แล้วติ๊กเปิดใช้งาน

# Script Installation
1. คลิกซ้ายที่ Icon TamperMonkey <picture><img src="assets/tampermonkey_logo.png" width="15" height="15" alt="Tampermonkey Logo"></picture>
2. เลือกเมนู +Create a new script...  
   จะเห็นสคริปเริ่มต้น เช่น
   ```
   // ==UserScript==
   // @name         New Userscript
   // @namespace    http://tampermonkey.net/
   // @version      1.0
   // @description  try to take over the world!
   // @author       You
   // @match        ...
   // @icon         ...
   // @grant        none
   // ==/UserScript==

   (function() {
       'use strict';

       // Your code here...
   })();
   ```
   ให้ลบทิ้งทั้งหมด  
3. Copy Script ที่จะใช้มาวางแทนที่ข้อ 2
4. กด Save (File> 💾Save)
5. ไปที่หน้าเว็บที่ Script ทำงาน ให้ทำการ Refresh(F5)

**หมายเหตุ**
- Script Click Farm จะทำงานที่หน้า Chat และ Farm เข้าหน้าไหนก็ได้
- Script Chat Mods/Radio จะทำงานแค่ที่หน้า Chat

# Update Script Version
1. กดที่ Icon TamperMonkey <picture><img src="assets/tampermonkey_logo.png" width="15" height="15" alt="Tampermonkey Logo"></picture>
2. เลือก ⚙️Dashboard
3. กดที่ Tab> Installed Userscripts แล้วกดที่ชื่อสคริปที่ต้องการเปลี่ยน<br>
   เช่น "Click Farm 5.0 | TDDFarm"
4. กดที่ Tab> Edit> Select All
5. Copy Script มาวางทับ แล้วกด Save (File> 💾Save)  
**หมายเหตุ** ถ้า Script ไหนไม่ใช้ก็ลบทิ้งในหน้า ⚙️Dashboard ได้เลย
<br><br>
