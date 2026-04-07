# วิธีติดตั้ง Extension: Tampermonkey
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
<br><br>
# วิธีติดตั้ง Script: Tampermonkey
1. คลิกซ้ายที่ Icon TamperMonkey <picture><img src="assets/tampermonkey_logo.png" width="15" height="15" alt="Tampermonkey Logo"></picture>
2. เลือกเมนู +Create a new script...
3. Copy Script มาวาง แล้วกด Save (File> 💾Save)
4. แล้วไปที่หน้าเว็บที่ Script ทำงาน ให้ทำการ Refresh(F5)
   - Script Click Farm จะทำงานที่หน้า Chat และ Farm เข้าหน้าไหนก็ได้
   - Script Chat Mods/Radio จะทำงานแค่ที่หน้า Chat
<br><br>
# วิธีอัพเดท/เปลี่ยนเวอร์ชั่น Script: Tampermonkey
1. กดที่ Icon TamperMonkey <picture><img src="assets/tampermonkey_logo.png" width="15" height="15" alt="Tampermonkey Logo"></picture>
2. เลือก ⚙️Dashboard
3. กดที่ Tab> Installed Userscripts แล้วกดที่ชื่อสคริปที่ต้องการเปลี่ยน<br>
   เช่น "Click Farm 5.0 | TDDFarm"
4. กดที่ Tab> Edit> Select All
5. Copy Script มาวางทับ แล้วกด Save (File> 💾Save)  
**หมายเหตุ** ถ้า Script ไหนไม่ใช้ก็ลบทิ้งในหน้า ⚙️Dashboard ได้เลย
<br><br>
# วิธีดาวโหลดและใช้งาน<br>IPv6 TorrentDD Management Script
1. เมื่อกดลิ้งไปที่ไฟล์แล้ว ให้กดปุ่ม Download raw file  
   (ปุ่มจะอยู่ข้างขวาบนของส่วนแสดงโค้ด ข้างๆ Icon ดินสอ)
2. ให้ไปที่โฟเดอร์ดาวโหลดของบราวเซอร์ที่ตั้งค่าไว้
3. คลิกขวาที่ไฟล์ Block_IPv6_Torrentdd_v1_0.bat เลือก Run as administrator
4. บางเครื่องอาจจะมี Security Warning ให้เลือก Run
5. หน้าต่าง CMD จะเปิดขึ้นมา ถ้าทำงานได้จะมีข้อความแบบนี้  
   ```
   ==================================================
    IPv6 TorrentDD Management Script
   ==================================================
    [1] Block IPv6 (Add Rules)
    [2] Unblock IPv6 (Delete Rules)
   ==================================================
    Created by: MObyEX
   ==================================================
   Select an option (1-2):
   ```  
   **หากปรากฎข้อความแบบนี้**  
   ```
   [Error] Please right-click and "Run as Administrator"
   Press any key to continue . . .
   ```  
   ให้ปิด CMD แล้วกลับไปทำข้อ 3 ใหม่  
   ถ้าทำแล้วยังขึ้นเหมือนเดิมอีก แสดงว่าวินโดที่ท่านใช้ไม่มีสิทธิ์แก้ไขระดับแอดมิน  
6. ถ้าต้องการ Block IPv6 ให้กด 1 ถ้าจะยกเลิกการ Block IPv6 ให้กด 2  
7. ปิด CMD ได้เลย  
8. ทดลองปิดบราวเซอร์ ปิด VPN แล้วเปิดบราวเซอร์ใหม่ เข้าเว็บดู  
   (ต้องแน่ใจว่าปิดทุกบราวเซอร์แล้ว หรือจะรีสตาร์ทเครื่องก็ได้)
