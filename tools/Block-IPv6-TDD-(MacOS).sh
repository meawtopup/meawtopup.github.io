#!/bin/bash

:: กำหนดรายการ IP ที่ต้องการบล็อก (คั่นด้วยคอมม่า)
IP_BLOCK="2606:4700:3036::6815:c03, 2606:4700:3034::ac43:96e6, 2606:4700:3034::6815:268a, 2606:4700:3031::ac43:df2c", 2606:4700:3031::6815:1ae3, 2606:4700:3030::ac43:8b7e
PF_ANCHOR="com.apple/tdd_block"

:: กำหนด Path ของแต่ละโปรแกรมใน macOS
CHROME_PATH="/Applications/Google Chrome.app"
FIREFOX_PATH="/Applications/Firefox.app"
EDGE_PATH="/Applications/Microsoft Edge.app"

echo "=================================================="
echo " Block IPv6 TDD (macOS) v1.2"
echo "=================================================="
echo " [1] Block IPv6 (Add Rules)"
echo " [2] Unblock IPv6 (Delete Rules)"
echo "=================================================="
echo " Created by: MObyEX"
echo "=================================================="
read -p "Select an option (1-2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "[Step 1] Cleaning old rules..."
    sudo pfctl -a "$PF_ANCHOR" -F all >/dev/null 2>&1

    echo "[Step 2] Checking Apps and Creating New Rules..."
    
    if [ -d "$CHROME_PATH" ]; then
        echo "[+] Chrome: Found."
    else
        echo "[-] Chrome: Not found, skipping..."
    fi

    if [ -d "$FIREFOX_PATH" ]; then
        echo "[+] Firefox: Found."
    else
        echo "[-] Firefox: Not found, skipping..."
    fi

    if [ -d "$EDGE_PATH" ]; then
        echo "[+] Edge: Found."
    else
        echo "[-] Edge: Not found, skipping..."
    fi

    # บน macOS การบล็อก IP ขาออกรายโปรแกรมทำได้ยาก จึงใช้ pf บล็อก IP เป้าหมายทั้งระบบแทน
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
