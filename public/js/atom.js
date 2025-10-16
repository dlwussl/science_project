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