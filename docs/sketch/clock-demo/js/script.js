(() => {
  window.addEventListener('load', () => {

    // variables
    let run = true;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetDOM = document.getElementById('webgl');

    // event
    window.addEventListener('keydown', (eve) => {
      run = eve.keyCode !== 27;
    }, false);

    window.addEventListener('resize', function() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }, false);

    // カメラの動きをマウスで調整
    // window.addEventListener('mousemove', (event) => {
    //     let w = window.innerWidth;
    //     let h = window.innerHeight;
    //     let x = event.clientX * 2.0 - w;
    //     let y = event.clientY * 2.0 - h;
    //     let length = Math.sqrt(x ** 2 + y ** 2)
    //     // 単位ベクトルにする
    //     x /= length;
    //     y /= length;
    //     camera.position.x = -1.0 + x;
    //     camera.position.z = 0.0 - y;
    // })
    

    // three.js class
    let scene;
    let camera;
    let controls;
    let renderer;

    // let clock geometrys;
    let clockBaseGeometry;
    let clockBallGeometry;
    let milliSecondGeometry;
    let secondGeometry;
    let minuteGeometry;
    let hourGeometry;

    // let clock materials
    let clockBaseMaterial;
    let clockBallMaterial;
    let milliMaterial;
    let secondMaterial;
    let minuteMaterial;
    let hourMaterial;

    // let clock parts
    let clockBaseCircle;
    let clockBall;
    let milliSecondTorus;
    let secondTorus;
    let minuteTorus;
    let hour;
    let directional;
    let ambient;

    // parameter
    let CAMERA_PARAMETER = {
      fovy: 100,
      aspect: width / height,
      near: 0.5,
      far: 30.0,
      x: -1.0,
      y: 6.0,
      z: 0.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };
    let RENDERER_PARAMETER = {
      clearColor: 0xe0e0e0,
      width: width,
      height: height
    };

    // initialize scene
    scene = new THREE.Scene();

    // initialize
    camera = new THREE.PerspectiveCamera(
      CAMERA_PARAMETER.fovy,
      CAMERA_PARAMETER.aspect,
      CAMERA_PARAMETER.near,
      CAMERA_PARAMETER.far
    );
    camera.position.x = CAMERA_PARAMETER.x;
    camera.position.y = CAMERA_PARAMETER.y;
    camera.position.z = CAMERA_PARAMETER.z;
    camera.lookAt(CAMERA_PARAMETER.lookAt);

    // initialize controls
    controls = new THREE.OrbitControls(camera, render.domElement);

    // initialize renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
    renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);
    targetDOM.appendChild(renderer.domElement);

    // initialize light
    directional = new THREE.DirectionalLight(0xffffff);
    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(directional);
    scene.add(ambient);

    /*=================
    時計
    ===================*/

    // 基盤の印
    clockBallGeometry = new THREE.SphereGeometry(0.15, 128, 128);
    clockBallMaterial = new THREE.MeshToonMaterial({
      color: 0xb90000,
    });
    clockBall = new THREE.Mesh(clockBallGeometry, clockBallMaterial);
    scene.add(clockBall);
    clockBall.position.x = 3 * Math.cos(0);
    clockBall.position.z = 3 * Math.sin(0);

    for (let i = 0; i < 12; i++) {
      let clockBallGeometryI = "clockBallGeometry" + "i";
      let clockBallMaterialI = "clockBallMaterial" + "i";
      let clockBallI = "clockBall" + "i";
      clockBallGeometryI = new THREE.SphereGeometry(0.1, 128, 128);
      clockBallMaterialI = new THREE.MeshToonMaterial({
        color: 0x525252,
      });
      clockBallI = new THREE.Mesh(clockBallGeometryI, clockBallMaterialI);
      scene.add(clockBallI);
      clockBallI.position.x = 3 * Math.cos(i * Math.PI / 6);
      clockBallI.position.z = 3 * Math.sin(i * Math.PI / 6);
    }

    // 秒針の設定
    secondGeometry = new THREE.TorusGeometry(0.25, 0.1, 64, 64);
    secondMaterial = new THREE.MeshToonMaterial({
      color: 0xba1c1c,
    });
    secondTorus = new THREE.Mesh(secondGeometry, secondMaterial);
    scene.add(secondTorus);

    // 長針の設定
    minuteGeometry = new THREE.TorusGeometry(0.47, 0.12, 64, 64);
    minuteMaterial = new THREE.MeshToonMaterial({
      color: 0xba1c1c,
    });
    minuteTorus = new THREE.Mesh(minuteGeometry, minuteMaterial);
    scene.add(minuteTorus);

    // 短針の設定
    hourGeometry = new THREE.TorusGeometry(0.70, 0.15, 64, 64);
    hourMaterial = new THREE.MeshToonMaterial({
      color: 0xba1c1c,
    });
    hourTorus = new THREE.Mesh(hourGeometry, hourMaterial);
    scene.add(hourTorus);


    // variable
    let count = 0;

    // rendering
    render();

    function render() {
      // clock
      let date = new Date();

      // 現在の時間の取得
      let hour = date.getHours();
      hour = hour >= 12 ? hour - 12 : hour;
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let milliSecond = date.getMilliseconds();
      let detailedSecond = second + 0.001 * milliSecond;
      let detailedMunute = minute + detailedSecond / 60;
      let detailedHour = hour + detailedMunute / 60;

      // cis,sin
      let hourCos = Math.cos(detailedHour * Math.PI / 6);
      let hourSin = Math.sin(detailedHour * Math.PI / 6);
      let minuteCos = Math.cos(detailedMunute * Math.PI / 30);
      let minuteSin = Math.sin(detailedMunute * Math.PI / 30);
      let secondCos = Math.cos(detailedSecond * Math.PI / 30);
      let secondSin = Math.sin(detailedSecond * Math.PI / 30);
      let milliSecondCos = Math.cos(milliSecond * Math.PI / 500);
      let milliSecondSin = Math.sin(milliSecond * Math.PI / 500);

      // 秒針の動き
      secondTorus.position.x = 3 * secondCos;
      secondTorus.position.z = 3 * secondSin;
      secondTorus.rotation.y = 2 * Math.PI - detailedSecond * Math.PI / 30;

      // 分針の動き
      minuteTorus.position.x = 3 * minuteCos;
      minuteTorus.position.z = 3 * minuteSin;
      minuteTorus.rotation.y = 2 * Math.PI - detailedMunute * Math.PI / 30;

      //短針の動き
      hourTorus.position.x = 3 * hourCos;
      hourTorus.position.z = 3 * hourSin;
      hourTorus.rotation.y = 2 * Math.PI - detailedHour * Math.PI / 6;

      // rendering
      renderer.render(scene, camera);
      // animation
      if (run) {
        requestAnimationFrame(render);
      }

    }
    // 座標軸
    // var axis = new THREE.AxisHelper(1000);
    // axis.position.set(0, 0, 0);
    // scene.add(axis);
  }, false);
})();
