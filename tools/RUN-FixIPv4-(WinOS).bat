@echo off
setlocal enabledelayedexpansion

:: ขอสิทธิ์ Admin อัตโนมัติ
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [Status] Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit
)

:: path hosts
set HOSTFILE=%SystemRoot%\System32\drivers\etc\hosts

:: เว็บที่ต้องการบังคับใช้ IPv4
set "DOMAINS=torrentdd.com torrentdd.net"

:: ===============================
echo ==========================================
echo RUN-FixIPv4 (WinOS) v1.0
echo ==========================================
echo Select an Option:
echo [1] Add IPv4 to hosts (Force IPv4)
echo [2] Remove IPv4 from hosts (Restore Default)
echo ==========================================
echo Created by: RIPMAN
echo ==========================================
set /p CHOICE=Enter your choice (1 or 2):

:: ===============================
if "%CHOICE%"=="1" (
    echo [Status] Adding IPv4...
    for %%D in (%DOMAINS%) do (
        echo [Status] Fetching IPv4 for %%D...
        for /f "delims=" %%I in ('powershell -Command "(Resolve-DnsName %%D -Type A | Select-Object -First 1 -ExpandProperty IPAddress)"') do (
            set IP=%%I
        )

        if defined IP (
            echo [Status] IPv4 for %%D: !IP!

            :: ลบรายการเก่า (เพื่อป้องกันซ้ำ)
            findstr /v "%%D" %HOSTFILE% > %HOSTFILE%.tmp
            move /y %HOSTFILE%.tmp %HOSTFILE% >nul

            :: เพิ่ม IPv4 ใหม่
            echo !IP! %%D>> %HOSTFILE%
            echo !IP! www.%%D>> %HOSTFILE%

            echo [Status] IPv4 for %%D has been added successfully.
        ) else (
            echo [Status] IPv4 not found for %%D
        )
    )
) else if "%CHOICE%"=="2" (
    echo [Status] Removing IPv4 entries...
    for %%D in (%DOMAINS%) do (
        findstr /v "%%D" %HOSTFILE% > %HOSTFILE%.tmp
        move /y %HOSTFILE%.tmp %HOSTFILE% >nul
    )
    echo [Status] IPv4 removed successfully.
) else (
    echo [Status] Invalid choice.
    exit
)

:: ล้าง DNS
ipconfig /flushdns

echo.
echo [Status] Task Completed!
pause
exit
