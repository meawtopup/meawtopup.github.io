[**HOME**](../README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

**RUN-FixIPv4 by RIPMAN**

# System Compatibility
ฺ**สามารถเปิดใช้ได้บน**
- Windows 7  
- Windows 8/8.1  
- Windows 10 (ทดสอบโดยผู้เขียน)  
- Windows 11
- MacOS 10.13+

**รองรับบราวเซอร์**
- ทุกบราวเซอร์

**คำเตือน**
- หากใช้แล้วมีอาการผิดปกติใดๆ ผู้เขียนสคริปไม่มีส่วนรับผิดชอบ [LICENSE](../LICENSE)
- หากไม่มั่นใจในสคริป สามารถตั้งค่าด้วยตนเองได้ที่ > [Self-Configuration](Self-Config-FixIPv4.md)

# Download
**สำหรับ Windows**  
มี 2 วิธี ในการดาวโหลด RUN-FixIPv4 (WinOS).bat
1. โหลดจาก GitHub: [Download on GitHub](https://github.com/meawtopup/meawtopup.github.io/releases/download/FixIPv4.WinOS/RUN-FixIPv4-.WinOS.bat)  
   (หรือตรวจสอบโค้ดได้ที่ > [RUN-FixIPv4 (WinOS)](../tools/RUN-FixIPv4-(WinOS).bat)  
2. โหลดจาก MediaFire: [Download on MediaFire](https://www.mediafire.com/file/g1lkefh6oh0cxyw/RUN-FixIPv4-%2528WinOS%2529.bat/file)  
   (หากลิ้งเสียกรุณาแจ้งที่หน้าแชท)  
**สำหรับ MacOS**  
มี 2 วิธี ในการดาวโหลด RUN-FixIPv4 (MacOS).sh
1. โหลดจาก GitHub: [Download on GitHub](https://github.com/meawtopup/meawtopup.github.io/releases/download/FixIPv4.MacOS/RUN-FixIPv4-.MacOS.sh)  
   (หรือตรวจสอบโค้ดได้ที่ > [RUN-FixIPv4 (MacOS)](../tools/RUN-FixIPv4-(MacOS).sh)  
2. โหลดจาก MediaFire: [Download on MediaFire](https://www.mediafire.com/file/cbx7wz3clqqb6bs/RUN-FixIPv4-%2528MacOS%2529.sh/file)  
   (หากลิ้งเสียกรุณาแจ้งที่หน้าแชท)

# Run Batch File
**สำหรับ Windows**
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. ไปที่โฟลเดอร์ดาวโหลดของบราวเซอร์ที่โหลดไฟล์ไว้
3. คลิกขวาที่ไฟล์ ```RUN-FixIPv4 (WinOS).bat``` เลือก Run as administrator
4. บางเครื่องอาจจะมี Security Warning ให้เลือก Run
5. หน้าต่าง Cmd (Command Prompt) จะเปิดขึ้นมา  
   ถ้าทำงานได้จะมีข้อความแบบนี้
   ```
    ==========================================
    RUN-FixIPv4 (WinOS) v1.0
    ==========================================
    Select an Option:
    [1] Add IPv4 to hosts (Force IPv4)
    [2] Remove IPv4 from hosts (Restore Default)
    ==========================================
    Created by: RIPMAN
    ==========================================
    /p CHOICE=Enter your choice (1 or 2):
   ```  
   **หากปรากฎข้อความแบบนี้**  
   ```
   [Status] Requesting Administrator privileges...
   ```  
   จะขึ้นถาม Security Warning ให้เลือก Run
7. ถ้าต้องการ Fix IPv4 ให้กด 1 ถ้าจะยกเลิกการ Fix IPv4 ให้กด 2
8. รอจนเห็นข้อความ ```[Status] Task Completed!```
   กดปิด Cmd (Command Prompt) ได้เลย
9. เปิดบราวเซอร์แล้วลองเข้าดู  
   ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด

# Run Shell Script
**สำหรับ MacOS**  
*ปลดล็อกสิทธิ์รันครั้งแรก*  
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. เปิด Terminal (กด ```Command + Space``` พิมพ์คำว่า ```Terminal``` แล้ว Enter)
3. พิมพ์คำว่า ```chmod +x``` (พิมพ์ **chmod** ตามด้วย **+x** และ **เว้นวรรค 1 ที**) **อย่าเพิ่งกด Enter**
4. ลากไฟล์ ```RUN-FixIPv4 (MacOS).sh``` จากโฟลเดอร์มา วางใส่ในหน้าต่าง Terminal
   - *คุณจะเห็นว่า Terminal ใส่ชื่อไฟล์พร้อมเครื่องหมายคำพูดให้เองอัตโนมัติ*
6. กด **Enter** (ขั้นตอนนี้คือการปลดล็อกสิทธิ์รันครั้งแรก)
*วิธีรันสคริป*
1. เปิดโปรแกรม **Terminal** ขึ้นมา
2. พิมพ์ ```./``` (จุดและสแลช) **ห้ามเว้นวรรค**
3. ลากไฟล์ ```RUN-FixIPv4 (MacOS).sh``` มาปล่อยต่อท้าย ```./``` ได้เลย  
   - หน้าจอจะขึ้นประมาณนี้: ```./"RUN-FixIPv4 (MacOS).sh"```
5. กด **Enter**
6. **การใส่รหัสผ่าน (สำคัญ):**  
   - สคริปต์จะถามรหัสผ่านเครื่อง Mac ของคุณ (ขึ้นคำว่า ```Password:```)
   - ให้พิมพ์รหัสผ่านหน้าจอเครื่องของคุณลงไปได้เลย
   - ⚠️ **หมายเหตุ:** ตอนพิมพ์ ตัวเลขหรือดอกจันจะไม่ขึ้นโชว์ ไม่ต้องตกใจครับ พิมพ์ให้ครบแล้วกด **Enter**
7. เลือกเมนู (1 หรือ 2) ตามที่หน้าจอแจ้งได้เลย
8. รอจนเห็นข้อความ ```[Status] Task Completed!``` กดปิด Terminal ได้เลย
9. เปิดบราวเซอร์แล้วลองเข้าดู  
   ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด
