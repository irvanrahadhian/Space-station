import * as THREE from './three.module.js'
import { 
    OrbitControls } 
    from './OrbitControls.js'
import { 
    AdditiveBlending} 
    from './three.module.js'



const textureLoader = new THREE.TextureLoader()
const shape = textureLoader.load('../assets/1.png')

const canvas = document.querySelector('canvas.galaxy')

const scene = new THREE.Scene()


var light = new THREE.PointLight( 0xffeecc, 1, 5000 );
light.position.set( 0, 0, 100 );
scene.add( light );

var light2 = new THREE.PointLight( 0xffeecc, 1, 5000 );
light2.position.set( 0, 0, -100 );
scene.add( light2 );

let stars_count = fxrand()*10000
let geometry_stars = null
let geometry_material = null
let stars = null

let material_ico = null

let cube = null
let wireframe = null
let offset = 0

let cylinder = null
let geometry_cyl = null
let torus = null
let sattelite = 0

let geometry = null
let material = null
let points = null
let pivotPoint = null

let list_colors = [
    '#a3053a',
    '#1505a3',
    '#a39805',
    '#a34705',
    '#defff2'
]

let dust_color = null

pivotPoint = new THREE.Object3D();

function StarsGenerator(){

    geometry_stars = new THREE.BufferGeometry()
    const position_stars = new Float32Array(stars_count * 3)

    for(let j = 0; j<stars_count; j++){
        position_stars[j*3 + 0] = (Math.random() - 0.5) * 20
        position_stars[j*3 + 1] = (Math.random() - 0.5) * 20
        position_stars[j*3 + 2] = (Math.random() - 0.5) * 20
    }

    geometry_stars.setAttribute('position', new THREE.BufferAttribute(position_stars, 3))

    geometry_material = new THREE.PointsMaterial({
        color: 'white',
        size: 0.015,
        depthWrite: false,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        color: '#a3adb5',
        transparent: true,
        alphaMap: shape
    })

    stars = new THREE.Points(geometry_stars, geometry_material)

    scene.add(stars)
}



function SpaceDust(){

    geometry = new THREE.BufferGeometry()

    dust_color = list_colors[Math.floor(fxrand()*list_colors.length)]

    const positions = new Float32Array(40000 *1)
    const colors = new Float32Array(40000 *1)
    
    const colorInside = new THREE.Color(dust_color)
    const colorOutside = new THREE.Color('#1b3984')

    for(let i=0; i < 40000; i++){

        const x = fxrand() * 5
        const branchAngle = 1
        const spinAngle = x * 100

        const randomX = Math.pow(fxrand(), 5) * (fxrand()<0.5 ? 1: -1) 
        const randomY = Math.pow(fxrand(), 5) * (fxrand()<0.5 ? 1: -1) 
        const randomZ = Math.pow(fxrand(), 5) * (fxrand()<0.5 ? 1: -1)

        positions[i * 3] = Math.sin(branchAngle + spinAngle) * x + randomX
        positions[i * 3 - 1] = randomY
        positions[i * 3 + 1] = Math.cos(branchAngle + spinAngle) * x + randomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, x / 5)

        colors[i*3 + 0] = mixedColor.r
        colors[i*3 + 1] = mixedColor.g
        colors[i*3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        color: 'white',
        size: 0.005,
        depthWrite: false,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        vertexColors: true,
        transparent: true,
        alphaMap: shape
    })

    points = new THREE.Points(geometry, material)
    points.rotation.x = 1.5
    points.position.y = -0.75
    scene.add(points)


}



function PlanetIco(){

    let color = new THREE.Color();
    
    for(var i=0;i<8;i++){
        const geometry_box = new THREE.BoxGeometry( fxrand(), fxrand(), fxrand() );
        if(geometry_box.parameters.width > 0.2 && geometry_box.parameters.height > 0.2){
            wireframe = true
            color.setHSL( 100, 100, 100);
            material_ico = new THREE.MeshBasicMaterial( { color: color, wireframe:wireframe} );
            cube = new THREE.Mesh( geometry_box, material_ico );
            cube.position.x = 0//fxrand() * 10 - 2;
            cube.position.y = fxrand() * 0.01 - 0.002//* 10 - 2;
            cube.position.z = 0//fxrand() //* 10 - 2;
            cube.position.normalize().multiplyScalar( fxrand() * 2.0 + 1.0 + offset );
            scene.add( cube );
            
        }else{
            wireframe = false
            // color.setHSL( fxrand(), 0.7, fxrand() * 0.2 + 0.05 );
            color.setHSL( 100, 100, 100);
            material_ico = new THREE.MeshPhongMaterial( { color: 0x808080, specular: 0x00000, shininess: 0 } );
            cube = new THREE.Mesh( geometry_box, material_ico );
            cube.position.x = 0//fxrand() * 10 - 2;
            cube.position.y = fxrand() * 0.01 - 0.002//* 10 - 2;
            cube.position.z = 0//fxrand() //* 10 - 2;
            cube.position.normalize().multiplyScalar( fxrand() * 2.0 + 1.0 + offset );
            scene.add( cube );
        }
    }

    const geometry_pv = new THREE.BoxGeometry( fxrand(), fxrand(), fxrand() );
    const material_pv = new THREE.MeshPhongMaterial( { color: 0x808080, specular: 0xffffff, shininess: 20 } );
    const cube_pv = new THREE.Mesh( geometry_pv, material_pv );
    cube_pv.position.x = 0//fxrand() * 10 - 2;
    cube_pv.position.y = 0
    cube_pv.position.z = 0//fxrand() //* 10 - 2;
    cube_pv.position.normalize().multiplyScalar( fxrand() * 2.0 + 1.0 + offset );
    scene.add( cube_pv );
    
    cube_pv.add(pivotPoint)
    let radial_segments = parseInt(fxrand()*25)

    if(fxrand() > 0.25){
        sattelite = 1
        const material_cyl = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe: true} );
        let off_cyl_x = 3
        
        let depth_cyl = fxrand() - 0.005
        for(i=0;i<2;i++){
            geometry_cyl = new THREE.CylinderGeometry( 0.2, 0.5, depth_cyl, radial_segments );
            cylinder = new THREE.Mesh( geometry_cyl, material_cyl );
            cylinder.rotation.z = 1.5
            cylinder.position.x = off_cyl_x
            scene.add( cylinder );
            
            pivotPoint.add(cylinder);
            off_cyl_x = off_cyl_x * -1
            depth_cyl = depth_cyl * -1
        }
        SpaceDust()

    }else{
        // console.log("create another satellite")
        const geometry_tor = new THREE.TorusGeometry( 10, 4, 4, radial_segments );
        const material_tor = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe: true} );
        torus = new THREE.Mesh( geometry_tor, material_tor );
        scene.add( torus );

    }

    
    
    
    
}

pivotPoint.add(light)
pivotPoint.add(light2)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = -0.50
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 12
controls.minDistance = 5


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let obj_list = [3,4,5,6,7,8,9,10]
const index_obj = obj_list[Math.floor(fxrand()*obj_list.length)]

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // ico.rotation.x+=2/1000;
    // ico.rotation.y = - elapsedTime*0.05
    
    

    scene.children[index_obj].rotation.y = - elapsedTime * 0.5 * ( 1 % 2 ? 1 : - 1 );
   
    
    
    stars.rotation.y = - elapsedTime*0.05

    if(sattelite == 1){
        pivotPoint.rotation.y += 0.005;
        points.rotation.z += 0.0015
    }else{
        torus.rotation.x += 0.005 
    }
   

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

function vertexShader() {
    return `
      varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
    `
  }


function fragmentShader() {
    return `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {

            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

        }
    `
}
  

// call all function
PlanetIco()
StarsGenerator()
tick()

if(sattelite == 1){
    var is_sattelite = true
}else{
    var is_sattelite = true
    dust_color = "None"
}

window.$fxhashFeatures = {
    "Stars Count": stars_count,
    "Sattelite": is_sattelite,
    "Space Dust": is_sattelite,
    "Space Dust Color": dust_color
}