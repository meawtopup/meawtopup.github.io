@echo off
setlocal enabledelayedexpansion

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [Error] Please right-click and "Run as Administrator"
    pause
    exit
)

set IP_BLOCK=2606:4700:3036::6815:c03,2606:4700:3034::ac43:96e6,2606:4700:3034::6815:268a,2606:4700:3031::ac43:df2c

set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "FIREFOX_PATH=C:\Program Files\Mozilla Firefox\firefox.exe"
set "EDGE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

echo ==================================================
echo  IPv6 TorrentDD Management Script
echo ==================================================
echo  [1] Block IPv6 (Add Rules)
echo  [2] Unblock IPv6 (Delete Rules)
echo ==================================================
echo  Created by: MObyEX
echo ==================================================
set /p choice="Select an option (1-2): "

if "%choice%"=="1" goto BLOCK
if "%choice%"=="2" goto UNBLOCK
echo Invalid choice. Exiting...
pause
exit

echo.
echo [Step 1] Cleaning old rules...
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Chrome" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Firefox" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Edge" >nul 2>&1

echo [Step 2] Checking Apps and Creating New Rules...

if exist "%CHROME_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Chrome" dir=out action=block program="%CHROME_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Chrome: Blocked.
) else (
    echo [-] Chrome: Not found, skipping...
)

if exist "%FIREFOX_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Firefox" dir=out action=block program="%FIREFOX_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Firefox: Blocked.
) else (
    echo [-] Firefox: Not found, skipping...
)

if exist "%EDGE_PATH%" (
    netsh advfirewall firewall add rule name="Block_IPv6_Torrent_Edge" dir=out action=block program="%EDGE_PATH%" remoteip=%IP_BLOCK% enable=yes >nul
    echo [+] Edge: Blocked.
) else (
    echo [-] Edge: Not found, skipping...
)

echo.
echo [Status] Blocking Complete.
pause
exit

echo.
echo [Step 1] Deleting Firewall Rules...
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Chrome" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Firefox" >nul 2>&1
netsh advfirewall firewall delete rule name="Block_IPv6_Torrent_Edge" >nul 2>&1

echo.
echo [Status] Unblock Complete. (All rules removed)
pause
exit
:: MObyEX v.1.0
