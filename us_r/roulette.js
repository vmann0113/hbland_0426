let isSpinning = false;
let prizeResult = "";

// 연락처 입력 제한 및 하이픈 자동화
const phoneInput = document.getElementById('user-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let val = e.target.value.replace(/[^0-9]/g, ""); 
        if (val.length > 11) val = val.substring(0, 11); 
        if (val.length < 4) { e.target.value = val; } 
        else if (val.length < 8) { e.target.value = val.substr(0, 3) + "-" + val.substr(3); } 
        else { e.target.value = val.substr(0, 3) + "-" + val.substr(3, 4) + "-" + val.substr(7); }
    });
}

// 룰렛 실행 로직
function spinEngine() {
    if (isSpinning) return;
    isSpinning = true;
    const disk = document.getElementById("roulette-disk");
    
    const prizes = [
        { name: "25만원 할인", a: 0, w: 1 }, { name: "10만원 할인", a: 60, w: 35 }, 
        { name: "20만원 할인", a: 120, w: 1 }, { name: "진주귀걸이 증정", a: 180, w: 20 },  
        { name: "5만원 할인", a: 240, w: 42 }, { name: "15만원 할인", a: 300, w: 1 }    
    ];

    const totalWeight = prizes.reduce((acc, p) => acc + p.w, 0);
    let randomNum = Math.random() * totalWeight;
    let selectedPrize = prizes[0];

    for (let i = 0; i < prizes.length; i++) {
        if (randomNum < prizes[i].w) { selectedPrize = prizes[i]; break; }
        randomNum -= prizes[i].w;
    }

    const rotate = 3600 + (360 - selectedPrize.a);
    disk.style.transform = `rotate(${rotate}deg)`;

    setTimeout(() => {
        prizeResult = selectedPrize.name;
        alert(`🎊 축하합니다! [${prizeResult}] 당첨!`);
        
        closeOverlay();
        // 당첨 결과 박스 노출
        document.getElementById('prize-result-box').style.display = 'block';
        document.getElementById('won-prize-display').innerText = "당첨 결과: " + prizeResult;
        
        // [수정] 지도 섹션 아래에 있는 입력폼으로 자동 스크롤
        document.getElementById('event-input-section').scrollIntoView({ behavior: 'smooth' });
        
        isSpinning = false;
    }, 4500);
}

function closeOverlay() {
    document.getElementById('roulette-overlay').style.display = 'none';
}

// 구글 시트 연동 전송 로직
function handleLeadSubmit() {
    const name = document.getElementById('user-name').value.trim();
    const phone = document.getElementById('user-phone').value.trim();
    const branch = document.getElementById('branch-select').value;
    // 배포한 GAS URL을 넣으세요
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxJwTVpsdJ64hihl9yV9yM5NpNVVL1_AN57_5UsGl8VIiP1RyORXmKOooDc609LO2E5/exec";

    if(!name || phone.replace(/-/g, "").length < 11) return alert("성함과 연락처 11자리를 정확히 입력해주세요.");
    if(!prizeResult) return alert("룰렛 이벤트 참여가 필요합니다.");

    const finalURL = `${GAS_URL}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&prize=${encodeURIComponent(prizeResult)}&branch=${encodeURIComponent(branch)}`;
    
    const btn = document.querySelector('.btn-submit');
    btn.innerText = "고객정보 처리 중...";
    btn.disabled = true;

    fetch(finalURL)
    .then(res => res.json())
    .then(data => {
        if(data.result === "success") {
            alert("프리미엄 혜택이 정상적으로 등록되었습니다! 담당자가 곧 연락드리겠습니다.");
            btn.innerText = "혜택 신청 완료";
        } else if(data.result === "duplicate") {
            alert("이미 참여하신 연락처입니다. (1인 1회 한정)");
            btn.innerText = "신청 완료";
        }
    })
    .catch(() => alert("신청 완료! 확인 후 빠른 안내 도와드리겠습니다."));
}