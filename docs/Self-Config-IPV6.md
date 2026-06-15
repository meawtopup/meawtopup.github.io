[**HOME**](../README.md) | [**TOPUP**](https://meawtopup.github.io/) | [**MANUAL**](MANUAL.md) | [**FEATURE**](FEATURES.md)

**คำเตือน**
- หากตั้งค่าแล้วมีอาการผิดปกติใดๆ ผู้เขียนสคริปไม่มีส่วนรับผิดชอบ [LICENSE](../LICENSE)
- สำหรับ Windows เท่านั้น

# Setting Rules
**วิธีกำหนด Outbound Rules ด้วยตนเอง (Windows)**  
1. ปิดบราวเซอร์ ปิด VPN ที่ใช้งานอยู่
2. หา IPv6 Address ก่อน
   - เปิดบราวเซอร์ Chrome/Forefox/Edge
   - พิมพ์ในแถบ URL:
     - Chrome: ```chrome://net-internals/#dns```
     - Firefox: ```about:networking#dnslookuptool```
     - Edge: ```edge://net-internals/#dns```
   - พิมพ์ชื่อเว็บในช่อง ```Domain:``` เช่น ```torrentdd.com``` แล้วกด Lookup/Resolve
   - มองหา IP addresses ที่เป็น IPv6 แล้วจด IP ที่ขึ้นไว้ให้ครบทุกอัน
     เช่น
     ```
     Resolved IP addresses of "torrentdd.com":
     ["2606:4700:3034::ac43:96e6","2606:4700:3036::6815:c03","172.67.150.230","104.21.12.3"].
     ```
     IPv6 คือ  ```2606:4700:3034::ac43:96e6``` กับ ```2606:4700:3036::6815:c03```
   - ทำซ้ำกับทุกเว็บที่ต้องการบล็อก
3. เปิด Windows Defender Firewall with Advanced Security  
   หรือใช้คำสั่ง RUN (WIN+R) แล้วพิมพ์ลงไปในช่อง OPEN 
   ```
   wf.msc
   ```  
   แล้วกด OK
4. คลิกที่ Outbound Rules
5. มองทางขวาตรง Actions ให้คลิกที่ New Rule...
6. ติ๊ก Program แล้วกด Next
7. ช่อง This program path ให้กด Browse... หาโปรแกรมบราวเซอร์ที่ใช้
   ```
   สำหรับ 64 บิท  
   CHROME = C:\Program Files\Google\Chrome\Application\chrome.exe  
   FIREFOX = C:\Program Files\Mozilla Firefox\firefox.exe  
   EDGE = C:\Program Files\Microsoft\Edge\Application\msedge.exe  
   BRAVE = C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe  
   OPERA = C:\Program Files\Opera\launcher.exe  
   OPERA GX = C:\Program Files\Opera GX\launcher.exe  
   SAFARI = C:\Program Files\Safari\Safari.exe
   ```
   ```
   สำหรับ 32 บิท
   CHROME = C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
   FIREFOX = C:\Program Files (x86)\Mozilla Firefox\firefox.exe
   EDGE = C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
   BRAVE = C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe
   OPERA = C:\Program Files (x86)\Opera\launcher.exe
   OPERA GX = C:\Program Files (x86)\Opera GX\launcher.exe
   SAFARI = C:\Program Files (x86)\Safari\Safari.exe  
   ```
   จากนั้นกด Next
8. ติ๊ก Block the connection แล้วกด Next
9. ติ๊ก Domain,Private,Public (จะติ๊กให้อยู่แล้ว) จากนั้นกด Next
10. ช่อง Name ให้พิมพ์ Block IPv6 (ชื่อแอป) เช่น Block IPv6 Chromeจากนั้นกด Finish
11. ดับเบิ้ลคลิกที่ Rules ที่เราตั้ง เช่น Block IPv6 Chrome
12. เลือกแทป Scope
13. ตรงหัวข้อ Remote IP address ให้ติ๊กเลือก These IP addresses
14. กด Add
15. ที่ช่อง This IP address or subnet
    ให้ใส่ IPv6 ที่จดมาจากขั้นตอนที่ 2
   (1 IP ต่อครั้ง ใส่แล้วกด OK แล้วกด ADD ใหม่)
16. เมื่อใส่ครบทุกไอพีแล้วให้กดที่แทป Protocols and Ports
17. ให้เลือก Protocol type: Any จากนั้นกด OK
18. เปิดบราวเซอร์แล้วลองเข้าเว็บดู  
    ถ้าไม่ได้ปิดบราวเซอร์แต่แรกให้ปิดสักครู่แล้วค่อยเปิด
