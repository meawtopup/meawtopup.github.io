[**HOME**](../README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

**Block IPv6 TDD by MObyEX**

# System Compatibility
ฺ**สามารถเปิดใช้ได้บน**
- Windows 7  
- Windows 8/8.1  
- Windows 10 (ทดสอบโดยผู้เขียน)  
- Windows 11
- MacOS 10.14+

**รองรับบราวเซอร์**
**สำหรับ Windows**
- Chrome
- Firefox
- Edge
- Brave
- Opera
- Opera GX
- Sagari  

**สำหรับ MacOS**
- ไม่สามารถบล็อคแยกบราวเซอร์ได้
  จึงเป็นการบล็อคทั้งระบบ

**คำเตือน**
- หากใช้แล้วมีอาการผิดปกติใดๆ ผู้เขียนสคริปไม่มีส่วนรับผิดชอบ [LICENSE](../LICENSE)
- หากไม่มั่นใจในสคริป สามารถตั้งค่าด้วยตนเองได้ที่ > [Self-Configuration](Self-Config-IPV6.md)

# Download
**สำหรับ Windows**  
มี 2 วิธี ในการดาวโหลด Block IPv6 TDD (WinOS).bat
1. โหลดจาก GitHub: [Download on GitHub](https://github.com/meawtopup/meawtopup.github.io/releases/download/BlockIPv6_Type2_WinOS/Block-IPv6-Type2-WinOS.bat)  
   (หรือตรวจสอบโค้ดได้ที่ > [Block IPv6 (WinOS)](../tools/Block-IPv6-Type2-WinOS.bat)  
2. โหลดจาก MediaFire: [Download on MediaFire](https://www.mediafire.com/file/mshs9d7p03xa92l/Block-IPv6-Type2-WinOS.bat/file)  
   (หากลิ้งเสียกรุณาแจ้งที่หน้าแชท)  

**สำหรับ MacOS**  
มี 2 วิธี ในการดาวโหลด Block IPv6 TDD (MacOS).sh
1. โหลดจาก GitHub: [Download on GitHub](https://github.com/meawtopup/meawtopup.github.io/releases/download/BlockIPv6_Type2_MacOS/Block-IPv6-Type2-MacOS.sh)  
   (หรือตรวจสอบโค้ดได้ที่ > [Block IPv6 (MacOS)](../tools/Block-IPv6-Type2-MacOS.sh)  
2. โหลดจาก MediaFire: [Download on MediaFire](https://www.mediafire.com/file/0lcuatx9ia1qzok/Block-IPv6-Type2-MacOS.sh/file)  
   (หากลิ้งเสียกรุณาแจ้งที่หน้าแชท)

# Run Batch File
**สำหรับ Windows**
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. ไปที่โฟลเดอร์ดาวโหลดของบราวเซอร์ที่โหลดไฟล์ไว้
3. ตรวจสอบว่ามีไฟล์ ```IP_BLOCK.txt``` อยู่ในโฟลเดอร์เดียวกับไฟล์ ```.bat``` หรือไม่
   - ถ้า**ไม่มี** สคริปต์จะ resolve IPv6 ให้อัตโนมัติ (ต้องเชื่อมต่ออินเทอร์เน็ต)
   - ถ้า**มีอยู่แล้ว** สคริปต์จะใช้ IP จากไฟล์นั้นทันที
4. คลิกขวาที่ไฟล์ ```Block IPv6 Type2 (WinOS).bat``` เลือก **Run as administrator**
5. บางเครื่องอาจจะมี Security Warning ให้เลือก **Run**
6. หน้าต่าง Cmd (Command Prompt) จะเปิดขึ้นมา  
   ถ้าทำงานได้จะมีข้อความแบบนี้
   ```
   [Status] IPv6 addresses: 2606:4700:...
   ==================================================
   Block IPv6 Type2 (WinOS) v1.0
   ==================================================
   [1] Block IPv6 (Add Rules)
   [2] Unblock IPv6 (Delete Rules)
   ==================================================
   Created by: MObyEX
   For: TorrentDD, Bearbit, Dedbit
   ==================================================
   Select an option (1-2):
   ```  
   **หากปรากฎข้อความแบบนี้**  
   ```
   [Error] Please right-click and "Run as Administrator"
   Press any key to continue . . .
   ```  
   แสดงว่าวินโดที่ท่านใช้ไม่มีสิทธิ์แก้ไขระดับแอดมิน
7. ถ้าต้องการ Block IPv6 ให้กด **1** ถ้าจะยกเลิกการ Block IPv6 ให้กด **2**
8. สคริปต์จะตรวจสอบบราวเซอร์ที่ติดตั้งในเครื่อง (Chrome, Firefox, Edge, Brave, Opera, Opera GX, Safari)
   และเพิ่ม Firewall Outbound Rules เฉพาะบราวเซอร์ที่พบ
9. รอจนเห็นข้อความ `[Status] Blocking Complete.` หรือ `[Status] Unblock Complete.`
   กดปุ่มใดๆ เพื่อปิด Cmd (Command Prompt)
10. เปิดบราวเซอร์แล้วลองเข้าดู
    ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด

# Run Shell Script
**สำหรับ MacOS**  
*ปลดล็อกสิทธิ์รันครั้งแรก*  
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. เปิด Terminal (กด ```Command + Space``` พิมพ์คำว่า ```Terminal``` แล้ว Enter)
3. พิมพ์คำว่า ```chmod +x``` (พิมพ์ **chmod** ตามด้วย **+x** และ **เว้นวรรค 1 ที**)
   **อย่าเพิ่งกด Enter**
4. ลากไฟล์ ```Block IPv6 Type2 (macOS).sh``` จากโฟลเดอร์มา วางใส่ในหน้าต่าง Terminal
   - *คุณจะเห็นว่า Terminal ใส่ชื่อไฟล์พร้อมเครื่องหมายคำพูดให้เองอัตโนมัติ*
5. กด **Enter** (ขั้นตอนนี้คือการปลดล็อกสิทธิ์รันครั้งแรก)
   
*วิธีรันสคริป*
1. เปิดโปรแกรม **Terminal** ขึ้นมา
2. ตรวจสอบว่ามีไฟล์ ```IP_BLOCK.txt`` อยู่ในโฟลเดอร์เดียวกับไฟล์ ```.sh``` หรือไม่
   - ถ้า**ไม่มี** สคริปต์จะ resolve IPv6 ให้อัตโนมัติ (ต้องเชื่อมต่ออินเทอร์เน็ต)
   - ถ้า**มีอยู่แล้ว** สคริปต์จะใช้ IP จากไฟล์นั้นทันที
3. พิมพ์ ```./``` (จุดและสแลช) **ห้ามเว้นวรรค**
4. ลากไฟล์ ```Block IPv6 Type2 (macOS).sh``` มาปล่อยต่อท้าย ```./``` ได้เลย  
   - หน้าจอจะขึ้นประมาณนี้: ```./"Block IPv6 Type2 (macOS).sh"```
5. กด **Enter**
6. **การใส่รหัสผ่าน (สำคัญ):**  
   - สคริปต์จะถามรหัสผ่านเครื่อง Mac ของคุณ (ขึ้นคำว่า ```Password:```)
   - ให้พิมพ์รหัสผ่านหน้าจอเครื่องของคุณลงไปได้เลย
   - ⚠️ **หมายเหตุ:** ตอนพิมพ์ ตัวเลขหรือดอกจันจะไม่ขึ้นโชว์ ไม่ต้องตกใจครับ
     พิมพ์ให้ครบแล้วกด **Enter**
7. หน้าจอจะแสดง IP ที่ resolve ได้ และเมนู:
   ```
   ==================================================
   Block IPv6 Type2 (macOS) v1.0
   ==================================================
   [1] Block IPv6 (Add Rules)
   [2] Unblock IPv6 (Delete Rules)
   ==================================================
   Created by: MObyEX
   For: TorrentDD, Bearbit, Dedbit
   ==================================================
   Select an option (1-2):
   ```
8. กด **1** เพื่อ Block หรือ **2** เพื่อ Unblock
9. สคริปต์จะตรวจสอบบราวเซอร์ที่ติดตั้งและเพิ่ม Firewall (Packet Filter)
   - **หมายเหตุ:** macOS ไม่สามารถบล็อกแยกตามบราวเซอร์ได้ จึงบล็อก IPv6 ทั้งระบบ
10. รอจนเห็นข้อความ ```[Status] Blocking Complete.``` หรือ ```[Status] Unblock Complete.```
    กดปุ่มใดๆ เพื่อปิด Terminal
11. เปิดบราวเซอร์แล้วลองเข้าดู  
    ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด
