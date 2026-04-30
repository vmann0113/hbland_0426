/* 
 * 한빔한복 프리미엄 이벤트 - 최종 통합 스크립트 (GAS v2.0 연동)
 */

let isSpinning = false;
let prizeResult = "";

// [1. 연락처 자동 하이픈 및 11자리 제한]
const phoneInput = document.getElementById('user-phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let val = e.target.value.replace(/[^0-9]/g, ""); 
        if (val.length > 11) val = val.substring(0, 11); 
        
        if (val.length < 4) {
            e.target.value = val;
        } else if (val.length < 8) {
            e.target.value = val.substr(0, 3) + "-" + val.substr(3);
        } else {
            e.target.value = val.substr(0, 3) + "-" + val.substr(3, 4) + "-" + val.substr(7);
        }
    });
}

// [2. 룰렛 실행 엔진]
function spinEngine() {
    if (isSpinning) return;
    const disk = document.getElementById("roulette-disk");
    if (!disk) return;
    isSpinning = true;
    
    const prizes = [
        { name: "25만원(본식) 할인", a: 0,   w: 1 },   
        { name: "10만원(촬영/본식) 할인", a: 60,  w: 35 }, 
        { name: "20만원(본식) 할인", a: 120, w: 4 },   
        { name: "혼주 진주귀걸이 증정", a: 180, w: 20 },  
        { name: "5만원(촬영/본식) 할인", a: 240, w: 35 },  
        { name: "15만원(본식) 할인", a: 300, w: 5 }    
    ];

    const totalWeight = prizes.reduce((acc, p) => acc + p.w, 0);
    let randomNum = Math.random() * totalWeight;
    let selectedPrize = prizes[0];

    for (let i = 0; i < prizes.length; i++) {
        if (randomNum < prizes[i].w) {
            selectedPrize = prizes[i];
            break;
        }
        randomNum -= prizes[i].w;
    }

    const rotate = 3600 + (360 - selectedPrize.a) + (Math.floor(Math.random() * 20) - 10);
    disk.style.transform = `rotate(${rotate}deg)`;

    setTimeout(() => {
        prizeResult = selectedPrize.name;
        alert("🎊 축하합니다! [" + prizeResult + "]에 당첨되셨습니다!");
        document.getElementById('roulette-section').style.display = 'none'; 
        document.getElementById('won-prize-display').innerText = "🎊 " + prizeResult;
        document.getElementById('result-content').style.display = 'block'; 
        document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
        isSpinning = false;
    }, 4500);
}

// [3. 데이터 전송 로직]
function handleLeadSubmit() {
    const nameVal = document.getElementById('user-name').value.trim();
    const phoneVal = document.getElementById('user-phone').value.trim();
    const branchVal = document.getElementById('branch-select').value;
    
    if(!nameVal) return alert("성함을 입력해주세요.");
    const purePhone = phoneVal.replace(/-/g, "");
    if(purePhone.length < 11) return alert("연락처를 정확히 작성해주세요.");

    const GAS_URL = "https://script.google.com/macros/s/AKfycbzFX0_bpw0It_r6uon9km3qzfYjnoCwoZx_y5GsOwyDcJCUSlcxhHCbXs2FwmoNyhvE/exec"; 
    const finalURL = `${GAS_URL}?name=${encodeURIComponent(nameVal)}&phone=${encodeURIComponent(phoneVal)}&prize=${encodeURIComponent(prizeResult)}&branch=${encodeURIComponent(branchVal)}`;

    const btn = document.querySelector('.btn-submit');
    btn.innerText = "처리 중...";
    btn.disabled = true;

    fetch(finalURL)
    .then(res => res.json())
    .then(data => {
        if(data.result === "success") {
            alert("혜택이 성공적으로 활성화되었습니다!");
            document.getElementById('cta-bar').style.display = 'block';
            btn.innerText = "활성화 완료";
            btn.style.background = "#ccc";
        } else if(data.result === "duplicate") {
            alert("이미 혜택을 활성화하셨습니다.");
            btn.innerText = "참여 완료";
            btn.style.background = "#ccc";
        }
    })
    .catch(err => {
        alert("통신이 원활하지 않습니다.");
        btn.disabled = false;
        btn.innerText = "혜택 활성화하기";
    });
}