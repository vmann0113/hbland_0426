<?php
$db = new PDO('sqlite:hanbim_event.db');
$branch = $_GET['branch'] ?? '전체';
$query = ($branch === '전체') ? "SELECT * FROM roulette_leads ORDER BY id DESC" : "SELECT * FROM roulette_leads WHERE branch = '$branch' ORDER BY id DESC";
$res = $db->query($query);
?>
<body style="padding:50px; font-family:sans-serif; background:#fff; color:#111;">
    <h2 style="border-bottom:2px solid #000; padding-bottom:15px; display:flex; justify-content:space-between;">
        한빔한복 이벤트 예약센터 현황
        <div style="font-size:14px;">
            <a href="?branch=전체">전체</a> | <a href="?branch=부산점">부산점</a> | <a href="?branch=센텀점">센텀점</a>
        </div>
    </h2>
    <table style="width:100%; border-collapse:collapse; margin-top:30px;">
        <thead>
            <tr style="background:#f9f9f9; text-align:left;">
                <th style="padding:15px; border-bottom:1px solid #111;">시간</th>
                <th style="padding:15px; border-bottom:1px solid #111;">지점</th>
                <th style="padding:15px; border-bottom:1px solid #111;">성함</th>
                <th style="padding:15px; border-bottom:1px solid #111;">연락처</th>
                <th style="padding:15px; border-bottom:1px solid #111;">당첨내역</th>
            </tr>
        </thead>
        <tbody>
            <?php while($row = $res->fetch(PDO::FETCH_ASSOC)): ?>
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:15px;"><?=$row['reg_date']?></td>
                <td style="padding:15px;"><strong><?=$row['branch']?></strong></td>
                <td style="padding:15px;"><?=$row['name']?></td>
                <td style="padding:15px;"><?=$row['phone']?></td>
                <td style="padding:15px; color:#B8977E; font-weight:800;"><?=$row['prize']?></td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</body>