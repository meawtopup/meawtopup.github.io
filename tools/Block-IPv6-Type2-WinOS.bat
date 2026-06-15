@echo off
setlocal enabledelayedexpansion

:: ขอสิทธิ์ Admin อัตโนมัติ
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [Status] Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit
)

:: =============================================
:: เช็ค/สร้าง IP_BLOCK.txt
:: =============================================
set "IP_FILE=%~dp0IP_BLOCK.txt"

if not exist "%IP_FILE%" (
    echo [Status] IP_BLOCK.txt not found. Resolving IPv6 addresses...
    echo.
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$domains=@('torrentdd.com','torrentdd.net','dedbit.com','bearbit.org');$all=@();foreach($d in $domains){Write-Host 'Looking up:' $d;try{$r=Resolve-DnsName $d -Type AAAA -Server 1.1.1.1 -ErrorAction Stop;$all+=$r.IPAddress}catch{try{$r=Resolve-DnsName $d -Type AAAA -Server 8.8.8.8 -ErrorAction Stop;$all+=$r.IPAddress}catch{Write-Host 'Failed:' $d}}};$result=($all|Select-Object -Unique)-join',';Write-Host 'Found:' $result;[System.IO.File]::WriteAllText('%~dp0IP_BLOCK.txt',$result)"
    echo.
)

:: อ่าน IP จากไฟล์
set IP_BLOCK=
if exist "%IP_FILE%" (
    set /p IP_BLOCK=<"%IP_FILE%"
)

if not defined IP_BLOCK (
    echo [Error] Cannot get IPv6 addresses.
    pause
    exit
)

echo [Status] IPv6 addresses: %IP_BLOCK%
echo.

:: กำหนด Path ของแต่ละโปรแกรม
:: สำหรับ 64 บิท
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "FIREFOX_PATH=C:\Program Files\Mozilla Firefox\firefox.exe"
set "EDGE_PATH=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
set "BRAVE_PATH=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
set "OPERA_PATH=C:\Program Files\Opera\launcher.exe"
set "OPERA_GX_PATH=C:\Program Files\Opera GX\launcher.exe"
set "SAFARI_PATH=C:\Program Files\Safari\Safari.exe"

:: สำหรับ 32 บิท
set "CHROME_x86_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set "FIREFOX_x86_PATH=C:\Program Files (x86)\Mozilla Firefox\firefox.exe"
set "EDGE_x86_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "BRAVE_x86_PATH=C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
set "OPERA_x86_PATH=C:\Program Files (x86)\Opera\launcher.exe"
set "OPERA_GX_x86_PATH=C:\Program Files (x86)\Opera GX\launcher.exe"
set "SAFARI_x86_PATH=C:\Program Files (x86)\Safari\Safari.exe"

echo ==================================================
echo  Block IPv6 Type2 (WinOS) v1.0
echo ==================================================
echo  [1] Block IPv6 (Add Rules)
echo  [2] Unblock IPv6 (Delete Rules)
echo ==================================================
echo  Created by: MObyEX
echo  For: TorrentDD, Bearbit, Dedbit
echo ==================================================
set /p choice="Select an option (1-2): "

if "%choice%"=="1" goto BLOCK
if "%choice%"=="2" goto UNBLOCK
echo [Status] Invalid choice. Exiting...
pause
exit

:BLOCK
echo.
echo [Step 1] Cleaning old rules...
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Chrome" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Chrome_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Firefox" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Firefox_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Edge" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Edge_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Brave" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Brave_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera_GX" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera_GX_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Safari" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Safari_x86" >nul 2>&1

echo [Step 2] Checking Apps and Creating New Rules...

:: Block Chrome
if exist "%CHROME_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Chrome" dir=out action=block program="%CHROME_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Chrome: Blocked.
) else (
    echo [-] Chrome: Not found, skipping...
)

if exist "%CHROME_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Chrome_x86" dir=out action=block program="%CHROME_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Chrome_x86: Blocked.
) else (
    echo [-] Chrome_x86: Not found, skipping...
)

:: Block Firefox
if exist "%FIREFOX_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Firefox" dir=out action=block program="%FIREFOX_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Firefox: Blocked.
) else (
    echo [-] Firefox: Not found, skipping...
)

if exist "%FIREFOX_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Firefox_x86" dir=out action=block program="%FIREFOX_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Firefox_x86: Blocked.
) else (
    echo [-] Firefox_x86: Not found, skipping...
)

:: Block Edge
if exist "%EDGE_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Edge" dir=out action=block program="%EDGE_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Edge: Blocked.
) else (
    echo [-] Edge: Not found, skipping...
)

if exist "%EDGE_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Edge_x86" dir=out action=block program="%EDGE_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Edge_x86: Blocked.
) else (
    echo [-] Edge_x86: Not found, skipping...
)

:: Block Brave
if exist "%BRAVE_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Brave" dir=out action=block program="%BRAVE_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Brave: Blocked.
) else (
    echo [-] Brave: Not found, skipping...
)

if exist "%BRAVE_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Brave_x86" dir=out action=block program="%BRAVE_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Brave_x86: Blocked.
) else (
    echo [-] Brave_x86: Not found, skipping...
)


:: Block Opera
if exist "%OPERA_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Opera" dir=out action=block program="%OPERA_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Opera: Blocked.
) else (
    echo [-] Opera: Not found, skipping...
)

if exist "%OPERA_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Opera_x86" dir=out action=block program="%OPERA_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Opera_x86: Blocked.
) else (
    echo [-] Opera_x86: Not found, skipping...
)

:: Block OperaGX
if exist "%OPERA_GX_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_OperaGX" dir=out action=block program="%OPERA_GX_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] OperaGX: Blocked.
) else (
    echo [-] OperaGX: Not found, skipping...
)

if exist "%OPERA_GX_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Opera_GX_x86" dir=out action=block program="%OPERA_GX_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Opera_GX_x86: Blocked.
) else (
    echo [-] Opera_GX_x86: Not found, skipping...
)

:: Block Safari
if exist "%SAFARI_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Safari" dir=out action=block program="%SAFARI_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Safari: Blocked.
) else (
    echo [-] Safari: Not found, skipping...
)

if exist "%SAFARI_x86_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Safari_x86" dir=out action=block program="%SAFARI_x86_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Safari_x86: Blocked.
) else (
    echo [-] Safari_x86: Not found, skipping...
)

:: ล้าง DNS
echo.
echo [Status] Flushing DNS cache...
ipconfig /flushdns >nul

echo.
echo [Status] Blocking Complete.
pause
exit

:UNBLOCK
echo.
echo [Step 1] Deleting Firewall Rules...
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Chrome" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Chrome_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Firefox" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Firefox_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Edge" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Edge_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Brave" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Brave_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera_GX" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Opera_GX_x86" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Safari" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Safari_x86" >nul 2>&1

:: ล้าง DNS
echo.
echo [Status] Flushing DNS cache...
ipconfig /flushdns >nul

echo.
echo [Status] Unblock Complete. (All rules removed)
pause
exit
