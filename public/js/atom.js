const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let radius = 20, theta = Math.PI/4, phi = Math.PI/4;
function updateCamera(){
    camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0,0,0);
}
updateCamera();

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff,0.5));
const pointLight = new THREE.PointLight(0xffffff,1);
pointLight.position.set(30,30,30);
scene.add(pointLight);

let nucleus = new THREE.Group();
scene.add(nucleus);
let electrons = [];
let orbits = [];

const shellRadii = [4,7,10,13,16,19,22];
const shellMaxElectrons = [2,8,18,32,50,72,98]; // 2n² 법칙

function clearGroupChildren(group){
    while(group.children.length){
        group.remove(group.children[0]);
    }
}

function createAtom(redCount, whiteCount, electronCount){
    clearGroupChildren(nucleus);
    electrons.forEach(e=>scene.remove(e));
    electrons=[];
    orbits.forEach(o=>scene.remove(o));
    orbits=[];

    const totalNucleus = redCount + whiteCount;
    const colors = Array(redCount).fill(0xff0000).concat(Array(whiteCount).fill(0xffffff));
    for(let i=0;i<totalNucleus;i++){
        const color = colors[i];
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.2,16,16),
            new THREE.MeshPhongMaterial({color})
        );
        sphere.position.set(
            (Math.random()-0.5)*1,
            (Math.random()-0.5)*1,
            (Math.random()-0.5)*1
        );
        nucleus.add(sphere);
    }

    let electronsLeft = Math.min(electronCount,118);
    let shellIndex = 0;

    while(electronsLeft > 0 && shellIndex < shellRadii.length){
        let shell = shellRadii[shellIndex];
        let maxElectronsInShell = shellMaxElectrons[shellIndex];
        let numElectrons;
        if(electronsLeft > maxElectronsInShell + 8){
            numElectrons = maxElectronsInShell;
        } else if(electronsLeft > maxElectronsInShell){
            numElectrons = maxElectronsInShell;
        } else {
            numElectrons = Math.min(8, electronsLeft);
        }

        const orbit = new THREE.Mesh(
            new THREE.RingGeometry(shell-0.02,shell+0.02,64),
            new THREE.MeshBasicMaterial({color:0x888888, side:THREE.DoubleSide})
        );
        orbit.rotation.x = Math.PI/2;
        scene.add(orbit);
        orbits.push(orbit);

        const shellSpeed = 0.012 + shellIndex * 0.003;

        for(let i=0;i<numElectrons;i++){
            const angle = (i/numElectrons)*Math.PI*2;
            const electron = new THREE.Mesh(
                new THREE.SphereGeometry(0.3,16,16),
                new THREE.MeshPhongMaterial({color:0x00ffff})
            );
            electron.userData = {radius: shell, angle, speed: shellSpeed};
            electron.position.set(Math.cos(angle)*shell,0,Math.sin(angle)*shell);
            scene.add(electron);
            electrons.push(electron);
        }

        electronsLeft -= numElectrons;
        shellIndex++;
    }
}

createAtom(25,25,12);

let isRunning = true;

document.getElementById("toggleBtn").addEventListener("click",()=>{
    isRunning = !isRunning;
    document.getElementById("toggleBtn").innerText = isRunning ? "정지" : "재생";
});

document.addEventListener("mousedown",e=>{isMouseDown=true; lastX=e.clientX; lastY=e.clientY;});
document.addEventListener("mouseup",()=>isMouseDown=false);
let isMouseDown=false, lastX=0, lastY=0;
document.addEventListener("mousemove",e=>{
    if(!isMouseDown) return;
    const dx=e.clientX-lastX, dy=e.clientY-lastY;
    lastX=e.clientX; lastY=e.clientY;
    theta-=dx*0.005; phi-=dy*0.005;
    phi=Math.max(0.1,Math.min(Math.PI-0.1,phi));
    updateCamera();
});

document.addEventListener("wheel",e=>{
    radius+=e.deltaY*0.05;
    radius=Math.max(5,Math.min(50,radius));
    updateCamera();
});

document.getElementById("createBtn").addEventListener("click",()=>{
    const r=parseInt(document.getElementById("redCount").value);
    const w=parseInt(document.getElementById("whiteCount").value);
    const e=parseInt(document.getElementById("electronCount").value);
    createAtom(r,w,e);
});

function animate(){
    requestAnimationFrame(animate);
    if(isRunning){
        electrons.forEach(e=>{
            e.userData.angle += e.userData.speed;
            e.position.x = Math.cos(e.userData.angle)*e.userData.radius;
            e.position.z = Math.sin(e.userData.angle)*e.userData.radius;
        });
    }
    renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});


/* ------------------------------------------- */
/* 기존 모달 제어 함수 (수정 없음)                */
/* ------------------------------------------- */
function openElementModal() {
    document.getElementById('elementModal').classList.add('active');
}

function closeElementModal() {
    document.getElementById('elementModal').classList.remove('active');
}

document.getElementById('elementModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeElementModal();
    }
});

/* ------------------------------------------- */
/* 1. 성공 시 모달을 채우는 함수 (수정 없음)      */
/* ------------------------------------------- */
function updateAndShowModal(data) {
    const { element, counts } = data;

    // DB에서 가져온 원소 정보로 업데이트
    document.getElementById('modal-symbol').textContent = element.symbol || '??';
    document.getElementById('modal-names').textContent = `${element.name_en || 'Unknown'} / ${element.name_ko || '알 수 없음'}`;
    document.getElementById('modal-symbol-info').textContent = element.symbol || '??';
    document.getElementById('modal-description').textContent = element.description || '설명이 없습니다.';

    // 사용자가 입력한 값으로 양성자/중성자/전자 수 업데이트
    document.getElementById('modal-protons').textContent = counts.red;
    document.getElementById('modal-neutrons').textContent = counts.white;
    document.getElementById('modal-electrons').textContent = counts.electron;

    // 모달 열기
    openElementModal();
}

/* ------------------------------------------- */
/* 2. (신규 추가) 실패 시 모달을 채우는 함수     */
/* ------------------------------------------- */
/**
 * 모달에 '없음' 또는 '오류' 메시지를 표시하고 엽니다.
 * @param {string} message - 모달 설명란에 표시할 메시지
 */
function showErrorInModal(message) {
    // 헤더 변경
    document.getElementById('modal-symbol').textContent = 'X';
    document.getElementById('modal-names').textContent = '알림 / Notice';

    // 정보 그리드 초기화 (입력값이라도 보여주려면 이 부분을 주석처리)
    document.getElementById('modal-protons').textContent = '-';
    document.getElementById('modal-neutrons').textContent = '-';
    document.getElementById('modal-electrons').textContent = '-';
    document.getElementById('modal-symbol-info').textContent = '-';

    // 설명란에 서버에서 받은 에러 메시지 표시
    document.getElementById('modal-description').textContent = message;

    // 모달 열기
    openElementModal();
}


/* ------------------------------------------- */
/* 3. 폼 전송(fetch) 로직 (수정됨)            */
/* ------------------------------------------- */
document.getElementById('atomForm').addEventListener('submit', async function(event) {
    // 1. 기본 폼 전송(페이지 새로고침) 방지
    event.preventDefault();

    // 2. 폼 데이터 가져오기
    const formData = new FormData(this);
    const data = {
        redCount: formData.get('redCount'),
        whiteCount: formData.get('whiteCount'),
        electronCount: formData.get('electronCount')
    };

    // 3. fetch를 사용해 서버에 POST 요청
    try {
        const response = await fetch('/make', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // 4. (수정) response.ok가 false일 때 (서버 오류 404, 500 등)
        if (!response.ok) {
            // alert(`오류: ${result.message || '서버 오류가 발생했습니다.'}`); // (기존)
            showErrorInModal(result.message || '서버 오류가 발생했습니다.'); // (변경)
            return;
        }

        // 5. (수정) 서버 로직상 실패 (success: false)
        if (result.success) {
            // 5-1. 성공: 원소 정보로 모달 채우기
            updateAndShowModal(result);
        } else {
            // 5-2. 실패 (예: 없는 원소, 로그인 안됨 등)
            // alert(`알림: ${result.message || '알 수 없는 오류.'}`); // (기존)
            showErrorInModal(result.message || '알 수 없는 오류.'); // (변경)
        }

    } catch (error) {
        // 6. (수정) 네트워크 오류 등
        console.error('Fetch error:', error);
        // alert('서버와 통신 중 오류가 발생했습니다.'); // (기존)
        showErrorInModal('서버와 통신 중 오류가 발생했습니다.'); // (변경)
    }
});