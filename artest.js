var scene, vid, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
var markerRoot1;
var mesh1;

function initialize() {
  scene = new THREE.Scene();

  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);

  vid = new THREE.Camera();
  scene.add(vid);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  renderer.setSize(640, 480);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();
  deltaTime = 0;
  totalTime = 0;

  ////////////////////////////////////////////////////////////
  // setup arToolkitSource
  ////////////////////////////////////////////////////////////

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });

  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(function onReady() {
    onResize();
  });

  // handle resize event
  window.addEventListener("resize", function () {
    onResize();
  });

  ////////////////////////////////////////////////////////////
  // setup arToolkitContext
  ////////////////////////////////////////////////////////////

  // create atToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "data/camera_para.dat",
    detectionMode: "mono",
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    vid.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  ////////////////////////////////////////////////////////////
  // setup markerRoots
  ////////////////////////////////////////////////////////////
  let loader = new THREE.TextureLoader();
  let texture = loader.load("images/border.png");

  let patternArray = ["letterA", "letterC", "letterB"];
  if (region === "seoul") {
    for (let i = 0; i < 3; i++) {
      let markerRoot = new THREE.Group();
      scene.add(markerRoot);
      let markerControls = new THREEx.ArMarkerControls(
        arToolkitContext,
        markerRoot,
        {
          type: "pattern",
          patternUrl: "data/" + patternArray[i] + ".patt",
        }
      );
      let geometry = new THREE.PlaneBufferGeometry(1, 1, 4, 4);
      let texture = [
        loader.load("images/earth.jpg", render),
        loader.load("images/noise.jpg", render),
      ];
      let material = new THREE.MeshBasicMaterial({ map: texture[i] });

      let mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;

      markerRoot.add(mesh);
    }
  }
  if (region === "busan") {
    for (let i = 0; i < 3; i++) {
      let markerRoot = new THREE.Group();
      scene.add(markerRoot);
      let markerControls = new THREEx.ArMarkerControls(
        arToolkitContext,
        markerRoot,
        {
          type: "pattern",
          patternUrl: "data/" + patternArray[i] + ".patt",
        }
      );
      let geometry = new THREE.PlaneBufferGeometry(1, 1, 4, 4);
      let texture = [
        loader.load("images/ar/jagalchi.png", render),
        loader.load("images/ar/gwangan.png", render),
        loader.load("images/ar/haedong.png", render),
      ];
      let material = new THREE.MeshBasicMaterial({ map: texture[i] });

      let mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;

      markerRoot.add(mesh);
    }
  }
  if (region == "jeju") {
    for (let i = 0; i < 3; i++) {
      let markerRoot = new THREE.Group();
      scene.add(markerRoot);
      let markerControls = new THREEx.ArMarkerControls(
        arToolkitContext,
        markerRoot,
        {
          type: "pattern",
          patternUrl: "data/" + patternArray[i] + ".patt",
        }
      );
      let geometry = new THREE.PlaneBufferGeometry(1, 1, 4, 4);
      let texture = [
         loader.load("images/ar/mountain.jpg", render),
         loader.load("images/ar/sea.jpg", render),
         loader.load("images/ar/forest.png", render),
      ];
      let material = new THREE.MeshBasicMaterial({ map: texture[i] });

      let mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;

      markerRoot.add(mesh);
    }
  }
}

function update() {
  // update artoolkit on every frame
  if (arToolkitSource.ready !== false)
    arToolkitContext.update(arToolkitSource.domElement);
}

function render() {
  renderer.render(scene, vid);
}

function animate() {
  requestAnimationFrame(animate);
  deltaTime = clock.getDelta();
  totalTime += deltaTime;
  update();
  render();
}
