<?php
// 보안을 위해 비밀번호 설정을 권장합니다.
// 예: if($_GET['pw'] != '1234') exit; 

$host = "localhost"; // DB 정보에 맞게 수정
$user = "DBID"; 
$pass = "DBPW"; 
$db   = "DBNAME";

$conn = mysqli_connect($host, $user, $pass, $db);
$query = "SELECT * FROM roulette_leads ORDER BY reg_date DESC";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>한빔한복 이벤트 관리자</title>
    <style>
        body { font-family: 'Pretendard', sans-serif; padding: 30px; background: #f4f4f4; }
        .admin-card { background: #fff; padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #0A1D37; color: #fff; padding: 15px; text-align: left; }
        td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
        tr:hover { background: #f9f9f9; }
        .badge { background: #B8977E; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="admin-card">
        <h2>📊 이벤트 참여 및 상담 신청 리스트</h2>
        <table>
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>지점</th>
                    <th>성함</th>
                    <th>연락처</th>
                    <th>당첨혜택</th>
                </tr>
            </thead>
            <tbody>
                <?php while($row = mysqli_fetch_assoc($result)): ?>
                <tr>
                    <td><?= $row['reg_date'] ?></td>
                    <td><strong><?= $row['branch'] ?></strong></td>
                    <td><?= $row['name'] ?></td>
                    <td><?= $row['phone'] ?></td>
                    <td><span class="badge"><?= $row['prize'] ?></span></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</body>
</html>