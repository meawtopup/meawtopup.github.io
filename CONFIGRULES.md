[**HOME**](README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**DOWNLOAD**](DOWNLOAD.md) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

**คำเตือน**
- หากตั้งค่าแล้ววินโดมีอาการผิดปกติใดๆ ผู้เขียนสคริปไม่ขอรับผิดชอบ [LICENSE](LICENSE)

# วิธีกำหนด Outbound Rules ด้วยตนเอง (Windows)
1. ให้ปิด VPN และบราวเซอร์ที่จะตั้งค่า เช่น Chrome
2. เปิด Windows Defender Firewall with Advanced Security  
   หรือใช้คำสั่ง RUN (WIN+R) แล้วพิมพ์ลงไปในช่อง OPEN 
   ```
   wf.msc
   ```  
   แล้วกด OK
3. คลิกที่ Outbound Rules
4. มองทางขวาตรง Actions ให้คลิกที่ New Rule...
5. ติ๊ก Program แล้วกด Next>
6. ช่อง This program path ให้กด Browse... หาโปรแกรมบราวเซอร์ที่ใช้
   หรือก็อป Path ข้างล่าง (สำหรับค่าเริ่มต้นเท่านั้น)
   **Chrome**
   ```
   C:\Program Files\Google\Chrome\Application\chrome.exe
   ```
   **Edge**
   ```
   C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
   ```
   **Firefox**
   ```
   C:\Program Files\Mozilla Firefox\firefox.exe
   ```
   จากนั้นกด Next>
7. ติ๊ก Block the connection แล้วกด Next>
8. ติ๊ก Domain,Private,Public (จะติ๊กให้อยู่แล้ว) จากนั้นกด Next>
9. ช่อง Name ให้พิมพ์ Block IPv6 (ชื่อแอป) เช่น Block IPv6 Chromeจากนั้นกด Finish
10. ดับเบิ้ลคลิกที่ Rules ที่เราตั้ง เช่น Block IPv6 Chrome
11. เลือกแทป Scope
12. ตรงหัวข้อ Remote IP address ให้ติ๊กเลือก These IP addresses
13. กด Add
14. ที่ช่อง This IP address or subnet
    ให้ใส่ IPv6 ต่อไปนี้จนครบ
    (1 IP ต่อครั้ง ใส่แล้วกด OK แล้วกด ADD ใหม่)
    ```
    2606:4700:3036::6815:c03
    ```
    ```
    2606:4700:3034::ac43:96e6
    ```
    ```
    2606:4700:3034::6815:268a
    ```
    ```
    2606:4700:3031::ac43:df2c
    ```
16. เมื่อใส่ครบ 4 ip แล้วให้กดที่แทป Protocols and Ports
17. ให้เลือก Protocol type: Any จากนั้นกด OK
18. เปิดบราวเซอร์แล้วลองเข้า www.torrentdd.com ทดสอบดู  
    ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด
