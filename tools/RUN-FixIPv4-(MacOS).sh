#!/bin/bash
# ==========================================
# บังคับให้เว็บใช้ IPv4 บน macOS
# ใช้งาน: chmod +x force_ipv4.sh && sudo ./force_ipv4.sh
# ==========================================

HOSTS_FILE="/etc/hosts"
DOMAINS=("torrentdd.com" "torrentdd.net dedbit.com")

echo "=========================================="
echo " RUN-FixIPv4 (MacOS) v1.0"
echo "=========================================="
echo " Select an Option"
echo " 1. Add IPv4 to hosts (Force IPv4)"
echo " 2. Remove IPv4 from hosts (Restore)"
echo "=========================================="
echo " Created by: RIPMAN"
echo "=========================================="
read -p "Enter your choice (1 or 2): " CHOICE

if [ "$CHOICE" == "1" ]; then
echo "[Status] Adding IPv4 for specified domains..."

for DOMAIN in "${DOMAINS[@]}"; do
    echo "[Status] Fetching IPv4 for $DOMAIN..."
    
    # ดึง IPv4 ของเว็บ
    IP=$(dig +short A $DOMAIN | head -n 1)

    if [[ -n "$IP" ]]; then
        echo "[Status] IPv4 for $DOMAIN: $IP"

        # ลบ entry เก่าของเว็บนี้
        sudo sed -i '' "/$DOMAIN/d" $HOSTS_FILE

        # เพิ่ม IPv4 ใหม่
        echo "$IP $DOMAIN" | sudo tee -a $HOSTS_FILE > /dev/null
        echo "$IP www.$DOMAIN" | sudo tee -a $HOSTS_FILE > /dev/null

        echo "[Status] IPv4 for $DOMAIN added successfully."
    else
        echo "[Status] IPv4 not found for $DOMAIN"
    fi
done

elif [ "$CHOICE" == "2" ]; then
    echo "[Status] Removing IPv4 entries..."
    for DOMAIN in "${DOMAINS[@]}"; do
        # ลบบรรทัดที่มีชื่อ Domain นั้นๆ ออกจากไฟล์ hosts
        sudo sed -i '' "/$DOMAIN/d" $HOSTS_FILE
    done
    echo "[Status] IPv4 removed successfully."

else
    echo "[Status] Invalid choice."
    exit 1
fi

# ล้าง DNS cache
echo "[Status] Flushing DNS cache..."
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder 2>/dev/null

echo "[Status] Task Completed!"
