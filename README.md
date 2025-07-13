For preview : https://ashermustafa7.github.io/ThreeJSObjectControlRotationsAndScales/

🚀 What I Learned From This Project
Implemented smooth scrolling using Lenis, and connected it to GSAP's ScrollTrigger.update() and gsap.ticker for real-time animations.

Built two separate THREE.Scene instances and controlled which one is rendered using a shared WebGLRenderer and a flagmodel boolean.

Loaded and centered .glb models using GLTFLoader and Box3 bounding boxes to dynamically calculate model center and size.

Applied post-load material properties like metalness, roughness, and envMapIntensity using .traverse() on the model.

Used ScrollTrigger.create() to pin sections (.scanner, .scanner2) and animate models on scroll using onEnter, onLeaveBack, and onEnterBack.

Controlled model visibility and animation progress using gsap.to() and conditional scale/rotation resets.

Learned that gsap.to() only animates one object at a time — for parallel animations, used gsap.timeline().

Used Math.sin() in the animation loop to apply smooth floating motion to models, and understood how amplitude and speed affect it.

Synced sound effects (Audio) with model transitions using setTimeout() and scanSound.currentTime.

Differentiated between ScrollTrigger-based animations and continuous requestAnimationFrame() rendering.

Realized that renderer.autoClear = false is essential when rendering multiple scenes in the same frame.

Calculated scrollProgress using CurrentScroll / scannerPosition to control rotation and animation speed relative to scroll.

Used model.scale.set(0,0,0) before animation for clean scaling in/out transitions.

Verified that a single renderer can render multiple scenes only if scenes/models don't overlap visually.

Deepened understanding of pinSpacing, scroll distance (end: "+=" + stickyHeight * 2), and how pinned sections behave in GSAP.
