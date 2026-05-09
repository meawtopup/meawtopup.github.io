javascript:(function(){
    if(location.hostname.indexOf('bearbit.org') === -1){
        /* ถ้าไม่ได้อยู่หน้าเว็บ ให้ไปหน้าแรกก่อน */
        location.href = 'https://bearbit.org/index.php';
    } else {
        /* ถ้าอยู่หน้าเว็บแล้ว ให้วาร์ปไปหน้า Browse ทันที | cat=10 คือหมวดอนิเมะ */
        location.href = 'https://bearbit.org/viewno18sbx.php?cat=10';
    }
})();
