[**HOME**](README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

# System Compatibility
ฺ**สามารถเปิดใช้ได้บน**
- Windows 7  
- Windows 8/8.1  
- Windows 10 (ทดสอบโดยผู้เขียน)  
- Windows 11

**รองรับบราวเซอร์**
- Chrome
- Edge
- Firefox

**คำเตือน**
- หากใช้แล้ววินโดมีอาการผิดปกติใดๆ ผู้เขียนสคริปไม่มีส่วนรับผิดชอบ [LICENSE](LICENSE)
- หากไม่มั่นใจในสคริป สามารถตั้งค่าด้วยตนเองได้ที่ > [Self-Configuration](CONFIGRULES.md)

# Get Batch File
มี 2 วิธี ในการดาวโหลด IPv6_TDD_v1_1.bat
1. โหลดจาก GitHub: [Download ](https://github.com/meawtopup/meawtopup.github.io/releases/download/BatchFile/IPv6_TDD_v1_1.bat)  
   (หรือตรวจสอบโค้ดได้ที่ > [IPv6 TDD V1.0](tools/IPv6_TDD_v1_1.bat))  
2. โหลดจาก MediaFire: [Download on MediaFire](https://www.mediafire.com/file/uaaaqs0f4hnh2i3/IPv6_TDD_v1_1.bat/file)
   (หากลิ้งเสียกรุณาแจ้งที่หน้าแชท)

# Run Batch File
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. ไปที่โฟลเดอร์ดาวโหลดของบราวเซอร์ที่โหลดไฟล์ไว้
3. คลิกขวาที่ไฟล์ IPv6_TDD_v1_1.bat เลือก Run as administrator
4. บางเครื่องอาจจะมี Security Warning ให้เลือก Run
5. หน้าต่าง Cmd (Command Prompt) จะเปิดขึ้นมา ถ้าทำงานได้จะมีข้อความแบบนี้
   ```
   ==================================================
     IPv6 TDD v1.1
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
7. ปิด Cmd (Command Prompt) ได้เลย
8. เปิดบราวเซอร์แล้วลองเข้า www.torrentdd.com ทดสอบดู
   ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด
