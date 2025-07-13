import Lenis from "https://esm.sh/@studio-freight/lenis";
import * as THREE from "https://esm.sh/three@0.136.0";
import { GLTFLoader } from "https://esm.sh/three@0.136.0/examples/jsm/loaders/GLTFLoader";
import { gsap } from "https://esm.sh/gsap@3.12.5";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.5/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ✅ Smooth scroll setup with Lenis
let flagmodel = true;
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ✅ THREE.js scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfefdfd);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// ✅ Renderer setup
const renderer = new THREE.WebGLRenderer({
  antialias: true, // smooth edges
  alpha: true,
});
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
document.querySelector(".model").appendChild(renderer.domElement);

// ✅ Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 10, 7.5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 3);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight.position.set(0, 25, 0);
scene.add(hemiLight);

// ✅ Animate loop

// ✅ Load model
let model;
const loader = new GLTFLoader();
loader.load(
  "assets/josta.glb",
  function (gltf) {
    model = gltf.scene;

    // ✅ Traverse the model to apply materials
    model.traverse((node) => {
      if (node.isMesh) {
        if (node.material) {
          node.material.metalness = 0.3;
          node.material.roughness = 0.4;
          node.material.envMapIntensity = 1.5;
        }
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // ✅ Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    scene.add(model);

    // ✅ Adjust camera based on model size
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 1.5;

    model.scale.set(0, 0, 0);
    playInitialAnimation(); // Placeholder function
    cancelAnimationFrame(basicAnimate); // optional: stop base loop
    animate(); // Placeholder for your custom animation loop
  },
  function (xhr) {
    console.log(`Model loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  function (error) {
    console.log("Model not loaded:", error);
  }
);

// ✅ Dummy functions (replace with your actual logic)

const floatAmplitude = 0.24;
const floatSpeed = 11;
const rotationSpeed = 0.3;
let isFloating = true;
let CurrentScroll = 0;
//notice the current scroll it will be what help us track the scroll position
// to link animatioins to scrolling

const stickyHeight = window.innerHeight;
//this is the viewport hight so that the section sticks in place when we scroll
const scannerSection = document.querySelector(".scanner");

// look here we have stored the scanner class , we use this to for the scrolling thing
const scannerPosition = scannerSection.offsetTop;

// what is this offsetTop;
const scanContainer = document.querySelector(".scan-container");
//see we also stored the scanContainer to scale it and all
const scanSound = new Audio("./assets/noisy-whooshes-88507.mp3");
gsap.set(scanContainer, { scale: 0 });

// finally the animation
//this is to scale both the scannercontainer and the model when it loads

const scanner2 = document.querySelector(".scanner2");

const scannerPosition2 = scanner2.offsetTop;

const stickyHeight2 = scanner2.offsetHeight; // assuming stickyHeight is based on .scanner height
const scannerEnd = scannerPosition + stickyHeight * 2;

ScrollTrigger.create({
  trigger: ".scanner",
  //see so now when in the scanner section
  start: "top top",

  // this means when the top of the "trigger" hits the top of the "viewPort" if i wrote -30px top so that means the animation start when the our trigger i.e the scanner section is -30px from the top and the top of the "viewport" hits the 30px from the top of the scanner section
  // meaning it will start after the top of the viewport enters 30px in the scanner section
  // also know the pin will cause scanner section to not move with the animation plays
  end: "+=" + stickyHeight * 2, // so this is like we are giving the scanner section two viewport height so that we can scroll
  // THIS ABOVE LINE LADIES AND GENTEL MEN IS THE REALLLL DEAL THAT WILL PIN THE SCANNER SECTION AND WILL GIVE IT A APPORIATE HEIGHT YES!!
  // so it shows that it will end after we scroll 4 pages in the scanner section
  // markers:true, // the new cool syntax the marker true you can do to see where the trigger starts and where it ends
  //okay what is this end:'$(stickyHeight)px', why is it used here?
  pin: true, //why pin are we pinning the scanner section so that it stays in place and till what time(till the animation plays) will it stay in place
  pinSpacing: true,
  onEnter: () => {
    if (model) {
      isFloating = false;
      model.position.y = 0;
      //meaning on the y axis we center it
      setTimeout(() => {
        scanSound.currentTime = 1.2;
        // scanSound.play();
      }, 500);
      gsap.to(model.rotation, {
        y: model.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut",
        //what is this power2.out and power2.inOUt
        onComplete: () => {
          gsap.to(model.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: "power2.in",
            scrub: 1,
            onComplete: () => {
              //now you see an onComplete inside of an onComplete
              gsap.to(scanContainer, {
                //x:0,y:0,z:0, this wont work here as its a div
                scale: 0,
                duration: 0.3,
                ease: "power2.in",
                scrub: 1,
                // what this power2.in  how is it different from power2.out and power2.inOUt
              });
              flagmodel = false;
              isFloating = true;
              // now after our first model diappears we turn is floating true as now the first wont render so floating wont be applied there
              // as we have falgmodel=false;
              playInitialAnimation();
            },
          });
        },
      });
    }
  },
  onLeaveBack: () => {
    flagmodel = true;
    // i need to know what this on EnterBack is , is it an inbuild function and why do we use ':' here on this function

    // it says when scrolling back it scales the model and scan contaier back to its full size making sure they appear smoothly
    //now look the playAnimation was only for the initaial animation

    // i kind of do get the just of this "onEnterBack" they are definitly per defined as we will also use a "onComplete" and "onLeaveBack" function later
    //so what they do is that based on the animation being complete or being traced backwards they do something that what they do
    // but why did we use onEnterBack in body and onLeaveBack in the scanner
    if (model) {
      gsap.to(model.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: "power2.out",
        scrub: 1,
      });
      gsap.to(model.rotation, {
        y: model.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut",
      });
      // so on leaving the scanner the way we came we are applying both rotation and scale together
      // NOTE WE CANT DO THIS
      //        gsap.to(model.scale, model.rotation, {
      //   x: ..., y: ...
      // });

      // NOTE WE CAN DO THIS
      // const tl = gsap.timeline();
      // tl.to(model.scale, { x: 1, y: 1, z: 1, duration: 1 });
      // tl.to(model.rotation, { y: Math.PI, duration: 1 }, "<"); // "<" starts both together

      isFloating = true; // so in the body its definitly floating
    }
    // what are the paramerters the "to" function of gsap takes (does it take the first to be the element we have to apply something on and the second to be what to be applied)
    gsap.to(scanContainer, {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  },
  onEnterBack:()=>{
    if(model2){
      isFloating=false;
      gsap.to(model2.scale,{
        x:0,y:0,z:0,
        duration:1,
        ease:"power2.out"
      }
      );
      gsap.to(model2.rotation,{
        y: model2.rotation.y+Math.PI*2,
        duration:1,
        ease:"power2.out"
      });
      
      

    }
  }
});

//an important thing i have come to understand the scroll trigger works we we scroll
// while apart from those animations we apply requistAnimationFrame to play a funciton again and again

// now look the event handler are added using lenis

lenis.on("scroll", (e) => {
  CurrentScroll = e.scroll;
  // now we are storing this scroll position
  // but what does it exactally return?
});

function animate() {
  if (flagmodel === true) {
    if (model) {
      if (isFloating) {
        const floatOffset =
          Math.sin(Date.now() * 0.0001 * floatSpeed) * floatAmplitude;
        // what does this sin do what parameters it takes and what will be its value depending on my code?
        console.log("is floating is true");
        model.position.y = floatOffset;
        // OKAY YOU MIGHT BE CONFUSED ABOUT THE FLOATSPPED AND AMPLITUE KNOW THE SIN RETURNS -1 TO 1 SO ID AMP IS 2 THEN THE OFFSET BECOME -2 TO 2 TO THE AMPLITUDE OF MODLE INCREASES , NOW AS FOR THE SPPED , AS THE PAGE IS REFRESING EVERY FRAME THE VALUE OF FLOAT SPEED WILL DEFINE HOW FAST IT WILL GO UP OR DOWN AS THE VALUE FO THE MODEL , AND THE SIN FUNC DEPENDS ON THAT
      }
      const scrollProgress = Math.min(CurrentScroll / scannerPosition, 1);
    
      if (scrollProgress < 1) {
        model.rotation.x = scrollProgress * Math.PI * 2;
        //that is 360 degree that is one rotation
      }
      if (scrollProgress < 1) {
        model.rotation.y += 0.001 * rotationSpeed;
      }

    }
    renderer.render(scene, camera);
  } else if (flagmodel === false) {
    if (model2) {
      if (isFloating) {
        const floatOffset = Math.sin(Date.now() * 0.0001 * 11.5) * 0.02;
        // what does this sin do what parameters it takes and what will be its value depending on my code?
        console.log("is floating is true");
        model2.position.y = floatOffset-0.05;
        // OKAY YOU MIGHT BE CONFUSED ABOUT THE FLOATSPPED AND AMPLITUE KNOW THE SIN RETURNS -1 TO 1 SO ID AMP IS 2 THEN THE OFFSET BECOME -2 TO 2 TO THE AMPLITUDE OF MODLE INCREASES , NOW AS FOR THE SPPED , AS THE PAGE IS REFRESING EVERY FRAME THE VALUE OF FLOAT SPEED WILL DEFINE HOW FAST IT WILL GO UP OR DOWN AS THE VALUE FO THE MODEL , AND THE SIN FUNC DEPENDS ON THAT   
      }

      const scrollProgress = Math.min((CurrentScroll-scannerPosition) / scannerPosition);
    
      if (scrollProgress < 2) {
       model2.rotation.y = scrollProgress * Math.PI * 2;
        //that is 360 degree that is one rotation
      }
      if (scrollProgress < 2) {
        // model2.rotation.y += 0.001 * rotationSpeed;
      }

    }
    renderer.render(scene2, camera2);
  }

  requestAnimationFrame(animate);
}

// were is the document for gsap.to() functions and the onleave adn onenter things
const scene2 = new THREE.Scene();
scene2.background = new THREE.Color(0xfefdfd);

const camera2 = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

document.querySelector(".model2").appendChild(renderer.domElement);

const ambientLight2 = new THREE.AmbientLight(0xffffff, 3);
scene2.add(ambientLight2);

const mainLight2 = new THREE.DirectionalLight(0xffffff, 1);
mainLight2.position.set(5, 10, 7.5);
scene2.add(mainLight2);

const fillLight2 = new THREE.DirectionalLight(0xffffff, 3);
fillLight2.position.set(-5, 0, -5);
scene2.add(fillLight2);

const hemiLight2 = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
hemiLight2.position.set(0, 25, 0);
scene2.add(hemiLight2);

let model2;
const loader2 = new GLTFLoader();

loader2.load(
  "assets/tentacle_potion_2k_low-poly.glb",
  function (gltf) {
    model2 = gltf.scene;
    //note the scene here is inbuild thing so we willNot do gltf.scene2 NO
    model2.traverse((node2) => {
      if (node2.isMesh) {
        if (node2.material) {
          node2.material.metalness = 0.3;
          node2.material.roughness = 0.4;
          node2.material.envMapIntensity = 1.5;
        }
        node2.castShadow = true;
        node2.receiveShadow = true;
      }
    });

    const box2 = new THREE.Box3().setFromObject(model2);
    const center2 = box2.getCenter(new THREE.Vector3());
    model2.position.sub(center2);
    model2.rotation.set(0, 0, 0);
    model2.scale.set(0, 0, 0);

    // say you want to you know put the model a bit below center so use this much easier
    model2.position.x -= 0;
    // model2.position.y -= 0;


    scene2.add(model2);

    const size2 = box2.getSize(new THREE.Vector3());
    const maxDim2 = Math.max(size2.x, size2.y, size2.z);
    camera2.position.z = maxDim2 * 1.5;
    
    basicAnimate();
    //animate2();
  },
  function (xhr) {
    console.log(`Model2 loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  function (error) {
    console.log("Model2 not loaded:", error);
  }
);

function basicAnimate() {
  renderer.autoClear = false; // Important! Prevents clearing between renders
  renderer.clear();
  if (flagmodel === true) {
    renderer.render(scene, camera);
    console.log("flag 1", flagmodel);
  } else if (flagmodel === false) {
    renderer.render(scene2, camera2);

    console.log("flag 2", flagmodel);
  } else {
    console.log("flag 0", flagmodel);
  }

  requestAnimationFrame(basicAnimate);
}
basicAnimate();

function playInitialAnimation() {
  if (flagmodel === true) {
    if (model) {
      gsap.to(model.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out",
      });
      // as you might remember that we set the scale to 0,0,0 before we actually played the animation
    }
    // we also scale the container to its full size
    gsap.to(scanContainer, {
      scale: 1,
      duration: 1,
      ease: "power2.out",
    });
  } else if (flagmodel === false) {
    if (model2) {
      model2.scale.set(0,0,0);

      gsap.to(model2.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "power2.out",
      });
      // as you might remember that we set the scale to 0,0,0 before we actually played the animation
    }
    // we also scale the container to its full size
    // gsap.to(scanContainer, {
    //   scale: 1,
    //   duration: 1,
    //   ease: "power2.out",
    // });
  }
}


ScrollTrigger.create({
  trigger:".scanner2",
  start:"top top",
  end:"+=" + stickyHeight2 * 2,
  pin:true,
  pinSpacing:true,
  onEnter: ()=>{
    if(model2){
      isFloating=false;
      model2.position.y=-0.1;
    }
    gsap.to(model2.rotation,{

        y: model2.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.inOut",
        onComplete:()=>{
          gsap.to(model2.scale,{

        x:0,
        y:0,
        z:0,
        duration: 0.5,
        ease: "power2.inOut"});
    }
    });
  },
  onLeaveBack:()=>{
    gsap.to(model2.scale,{
      x:1,y:1,z:1,
      duration:1,
      ease:"power2.out"
      
    });
  gsap.to(model2.rotation,{
    y: model2.rotation.y+ Math.PI*6,
    duration:1,
    ease:"power2.out"
  });
  gsap.to(scanContainer,{
        scale:1,
        duration:1,
        ease:"power2.out"
      })
    isFloating=true;
  }

});




// i will tell you what we learned , we learned rotations here , the very crusial thing was the scrollTrigger things 
// current scroll-scannerpostion
// that is line 308
// const scrollProgress = Math.min((CurrentScroll-scannerPosition) / scannerPosition);
// we leanred how to use it to determind position for the next section you can use 
// const scrollProgress = Math.min((CurrentScroll-scannerPosition2) / scannerPosition2);
//hopefully

// we learned that there can be only one renderor that will render multiple things 
// but just know that if your model takes the whole space then that cant be done , as at one time in that perticular are only one "scene" can be rendered 
// to render multiple scenes you should place the modles differently.