<?php
// 모든 PHP 에러를 화면에 출력하지 않고 JSON으로 응답하기 위한 설정
error_reporting(0); 
header('Content-Type: application/json; charset=utf-8');

// [주의] 대표님의 실제 DB 정보로 수정하세요
$host = "localhost"; 
$user = "DB_ID";      
$pass = "DB_PASSWORD"; 
$db   = "DB_NAME";     

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "데이터베이스 연결에 실패했습니다."]);
    exit;
}

// POST 데이터 받기 및 보안 처리
$name   = mysqli_real_escape_string($conn, $_POST['name']);
$phone  = mysqli_real_escape_string($conn, $_POST['phone']);
$prize  = mysqli_real_escape_string($conn, $_POST['prize']);
$branch = mysqli_real_escape_string($conn, $_POST['branch']);

// 1. 중복 등록 체크 (연락처 기준)
$check_query = "SELECT id FROM roulette_leads WHERE phone = '$phone' LIMIT 1";
$check_result = mysqli_query($conn, $check_query);

if (mysqli_num_rows($check_result) > 0) {
    echo json_encode(["status" => "duplicate", "message" => "이미 등록된 번호입니다."]);
    exit;
}

// 2. 신규 데이터 저장
$query = "INSERT INTO roulette_leads (name, phone, prize, branch, reg_date) 
          VALUES ('$name', '$phone', '$prize', '$branch', NOW())";

if (mysqli_query($conn, $query)) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "저장 중 오류가 발생했습니다."]);
}

mysqli_close($conn);
?>