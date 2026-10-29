import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0.35, 0.15, 5.4)

    const group = new THREE.Group()
    scene.add(group)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x141416,
        metalness: 0.92,
        roughness: 0.22,
        envMapIntensity: 1,
      })
    )
    group.add(sphere)

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2e,
      metalness: 0.95,
      roughness: 0.18,
      side: THREE.DoubleSide,
    })
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.018, 16, 120), ringMat)
    ringA.rotation.x = Math.PI / 2.4
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.012, 16, 140), ringMat.clone())
    ringB.rotation.x = Math.PI / 1.7
    ringB.rotation.y = 0.6
    group.add(ringA, ringB)

    const key = new THREE.SpotLight(0xffffff, 18, 18, 0.55, 0.4)
    key.position.set(3.2, 2.4, 3.6)
    scene.add(key)
    scene.add(new THREE.AmbientLight(0x6b6b72, 0.35))
    const rim = new THREE.PointLight(0xc8c8d0, 6, 12)
    rim.position.set(-3.2, -0.8, 2.2)
    scene.add(rim)

    const pointer = { x: 0, y: 0 }
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }
    window.addEventListener("pointermove", onPointer)

    const resize = () => {
      const parent = canvas.parentElement
      const width = parent?.clientWidth ?? 640
      const height = parent?.clientHeight ?? 640
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener("resize", resize)

    let frame = 0
    const tick = () => {
      frame = requestAnimationFrame(tick)
      const t = performance.now() / 1000
      if (!reduceMotion) {
        group.rotation.y = t * 0.18 + pointer.x * 0.18
        group.rotation.x = 0.18 + pointer.y * 0.12
        ringA.rotation.z = t * 0.12
        ringB.rotation.z = -t * 0.08
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("resize", resize)
      renderer.dispose()
      sphere.geometry.dispose()
      ringA.geometry.dispose()
      ringB.geometry.dispose()
      ;(sphere.material as THREE.Material).dispose()
      ringMat.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
}
