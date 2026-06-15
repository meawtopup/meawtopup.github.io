#!/bin/bash

# ขอสิทธิ์ Admin อัตโนมัติ (ถ้ายังไม่ใช่ root)
if [ "$EUID" -ne 0 ]; then 
    echo "[Status] Requesting Administrator privileges..."
    osascript -e "do shell script \"$0 $@\" with administrator privileges"
    exit 0
fi

# =============================================
# เช็ค/สร้าง IP_BLOCK.txt
# =============================================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IP_FILE="$SCRIPT_DIR/IP_BLOCK.txt"

if [ ! -f "$IP_FILE" ]; then
    echo "[Status] IP_BLOCK.txt not found. Resolving IPv6 addresses..."
    echo ""
    
    # สร้างไฟล์ IP_BLOCK.txt โดยใช้ dig ผ่าน Cloudflare/Google DNS
    DOMAINS="torrentdd.com torrentdd.net dedbit.com bearbit.org"
    echo "" > "$IP_FILE"
    
    for d in $DOMAINS; do
        echo "Looking up: $d"
        
        # ลอง Cloudflare DNS (1.1.1.1) ก่อน
        IPS=$(dig +short AAAA "$d" @1.1.1.1 2>/dev/null | grep -v "^;" | tr '\n' ',' | sed 's/,$//')
        
        # ถ้าไม่ได้ ลอง Google DNS (8.8.8.8)
        if [ -z "$IPS" ]; then
            IPS=$(dig +short AAAA "$d" @8.8.8.8 2>/dev/null | grep -v "^;" | tr '\n' ',' | sed 's/,$//')
        fi
        
        if [ -n "$IPS" ]; then
            echo "Found: $IPS"
            if [ -s "$IP_FILE" ]; then
                # มีข้อมูลแล้ว → เติม ,
                echo -n ",$IPS" >> "$IP_FILE"
            else
                # ไฟล์ว่าง → เขียนเลย
                echo -n "$IPS" >> "$IP_FILE"
            fi
        else
            echo "Failed: $d"
        fi
    done
    
    echo ""
    echo "[Status] IP_BLOCK.txt created."
fi

# อ่าน IP จากไฟล์
IP_BLOCK=$(cat "$IP_FILE" 2>/dev/null | tr -d ' ')

if [ -z "$IP_BLOCK" ]; then
    echo "[Error] Cannot get IPv6 addresses."
    read -n 1 -s -r -p "Press any key to exit..."
    echo ""
    exit 1
fi

echo "[Status] IPv6 addresses: $IP_BLOCK"
echo ""

# Anchor name สำหรับ pf
PF_ANCHOR="com.apple/tdd_block"

# กำหนด Path ของแต่ละโปรแกรมใน macOS
CHROME_PATH="/Applications/Google Chrome.app"
FIREFOX_PATH="/Applications/Firefox.app"
EDGE_PATH="/Applications/Microsoft Edge.app"
BRAVE_PATH="/Applications/Brave Browser.app"
OPERA_PATH="/Applications/Opera.app"
OPERA_GX_PATH="/Applications/Opera GX.app"
SAFARI_PATH="/Applications/Safari.app"

echo "=================================================="
echo " Block IPv6 Type2 (macOS) v1.0"
echo "=================================================="
echo " [1] Block IPv6 (Add Rules)"
echo " [2] Unblock IPv6 (Delete Rules)"
echo "=================================================="
echo " Created by: MObyEX"
echo " For: TorrentDD, Bearbit, Dedbit"
echo "=================================================="
read -p "Select an option (1-2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "[Step 1] Cleaning old rules..."
    sudo pfctl -a "$PF_ANCHOR" -F all >/dev/null 2>&1
    echo "[Status] Old rules cleaned."

    echo "[Step 2] Checking Apps..."
    echo ""

    # ตรวจสอบว่ามีโปรแกรมอะไรบ้าง
    FOUND_ANY=false

    if [ -d "$CHROME_PATH" ]; then
        echo "[+] Chrome: Found."
        FOUND_ANY=true
    else
        echo "[-] Chrome: Not found, skipping..."
    fi

    if [ -d "$FIREFOX_PATH" ]; then
        echo "[+] Firefox: Found."
        FOUND_ANY=true
    else
        echo "[-] Firefox: Not found, skipping..."
    fi

    if [ -d "$EDGE_PATH" ]; then
        echo "[+] Edge: Found."
        FOUND_ANY=true
    else
        echo "[-] Edge: Not found, skipping..."
    fi

    if [ -d "$BRAVE_PATH" ]; then
        echo "[+] Brave: Found."
        FOUND_ANY=true
    else
        echo "[-] Brave: Not found, skipping..."
    fi

    if [ -d "$OPERA_PATH" ]; then
        echo "[+] Opera: Found."
        FOUND_ANY=true
    else
        echo "[-] Opera: Not found, skipping..."
    fi

    if [ -d "$OPERA_GX_PATH" ]; then
        echo "[+] Opera GX: Found."
        FOUND_ANY=true
    else
        echo "[-] Opera GX: Not found, skipping..."
    fi

    if [ -d "$SAFARI_PATH" ]; then
        echo "[+] Safari: Found (Built-in)."
        FOUND_ANY=true
    else
        echo "[-] Safari: Not found, skipping..."
    fi

    echo ""

    if [ "$FOUND_ANY" = false ]; then
        echo "[Warning] No supported browsers found."
        echo "[Info] Blocking IPv6 for ALL applications instead."
    else
        echo "[Info] macOS pf cannot filter by application."
        echo "[Info] Blocking IPv6 for ALL applications (system-wide)."
    fi
    echo ""

    echo "[Step 3] Applying Firewall Rules..."
    echo "block drop out inet6 to { $IP_BLOCK }" | sudo pfctl -a "$PF_ANCHOR" -f - >/dev/null 2>&1
    sudo pfctl -E >/dev/null 2>&1
    echo "[+] Firewall rules applied successfully."

    echo ""
    echo "[Status] Flushing DNS cache..."
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder 2>/dev/null

    echo ""
    echo "[Status] Blocking Complete."
    read -n 1 -s -r -p "Press any key to exit..."
    echo ""
    exit 0

elif [ "$choice" == "2" ]; then
    echo ""
    echo "[Step 1] Deleting Firewall Rules..."
    sudo pfctl -a "$PF_ANCHOR" -F all >/dev/null 2>&1
    echo "[Status] All rules removed."

    echo ""
    echo "[Status] Flushing DNS cache..."
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder 2>/dev/null

    echo ""
    echo "[Status] Unblock Complete. (All rules removed)"
    read -n 1 -s -r -p "Press any key to exit..."
    echo ""
    exit 0

else
    echo "[Status] Invalid choice. Exiting..."
    read -n 1 -s -r -p "Press any key to exit..."
    echo ""
    exit 1
fi