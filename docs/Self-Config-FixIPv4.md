[**HOME**](../README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

**คำเตือน**
- หากตั้งค่าแล้วมีอาการผิดปกติใดๆ ผู้เขียนสคริปไม่มีส่วนรับผิดชอบ [LICENSE](../LICENSE)
- สำหรับ Windows เท่านั้น
- การกำหนด IPv4 ด้วยตนเอง ถ้า IP มีการอัพเดทจะต้องกลับมาแก้ใหม่อีกครั้ง

# Setting Rules
**วิธีแก้ไข hosts ด้วยตนเอง (Windows)**  
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. เปิด Notepad ด้วยสิทธิ์ Administretor (คลิกขวาที่ Notepad)
3. เปิดไฟล์ hosts (File > Open...)  
   ด้านล่างให้เปลี่ยนจาก 
   ```Documents (*.txt)``` เป็น ```All Files (*.*)```  
   จากนั้นไปที่ตำแหน่งเก็บ hosts  
   ``````C:\Windows\System32\drivers\etc```  
   กดเลือก hosts แล้วกด Open
4. ให้เลื่อนลงมาด้านล่างสุดแล้วเพิ่ม IPv4 ต่อไปนี้  
   ```
   104.21.12.3 torrentdd.com
   104.21.12.3 www.torrentdd.com
   172.67.223.44 torrentdd.net
   172.67.223.44 www.torrentdd.net
   104.21.38.138 torrentdd.net
   104.21.38.138 www.torrentdd.net
   ```
   ตัวอย่างที่ควรเป็น
   ```
   # localhost name resolution is handled within DNS itself.
   #	127.0.0.1       localhost
   #	::1             localhost
   127.0.0.1 เว็บใดๆ
   104.21.12.3 torrentdd.com
   104.21.12.3 www.torrentdd.com
   104.21.38.138 torrentdd.net
   104.21.38.138 www.torrentdd.net
   ```
5. กด Save แล้วปิด Notepad ได้เลย
6. เปิด Cmd (Command Prompt) ด้วยสิทธิ์ Administretor  
   (คลิกขวาที่ Command Prompt)
8. พิมพ์ข้อความต่อไปนี้
   ```
   ipconfig /flushdns
   ```
   แล้วกด Enter
9. ถ้าถูกต้องจะขึ้นข้อความ  
   ```
   Windows IP Configuration
   Successfully flushed the DNS Resolver Cache.
   ```
   ให้ปิด Cmd (Command Prompt) ได้เลย
10. เปิดบราวเซอร์แล้วลองเข้า TDD ทดสอบดู  
    ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด
