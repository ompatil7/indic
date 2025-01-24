// Avatar.js
import React, { Suspense, useEffect, useState, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// Create context for managing speech and animation states
const SpeechContext = createContext({
  isTeaching: false,
  setIsTeaching: () => {},
  isClapping: false,
  setIsClapping: () => {},
  isBowing: false,
  setBowing: () => {},
});

// Loading spinner component
function LoadingSpinner() {
  return (
    <Html center>
      <div className="text-lg text-gray-600">Loading Avatar...</div>
    </Html>
  );
}

// Avatar model component
function AvatarModel({ scale = 4 }) {
  const { scene } = useGLTF('/models/megan.glb');
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  const [animations, setAnimations] = useState({
    idle: null,
    talking: null,
    clapping: null,
    bow: null
  });
  const { isTeaching, isClapping, isBowing } = useContext(SpeechContext);

  // Configure materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.roughness = 1;
        child.material.metalness = 0;
        child.material.envMapIntensity = 0.3;
      }
    });
  }, [scene]);

  // Load animations
  useEffect(() => {
    const loader = new FBXLoader();
    const animationFiles = {
      idle: 'animations/idle.fbx',
      talking: 'animations/talk1.fbx',
      clapping: 'animations/clap.fbx',
      bow: 'animations/bow.fbx'
    };

    Object.entries(animationFiles).forEach(([name, path]) => {
      loader.load(path, (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
          const animation = fbx.animations[0];
          const action = mixer.clipAction(animation, scene);
          action.setLoop(THREE.LoopRepeat);
          action.clampWhenFinished = true;
          setAnimations(prev => ({
            ...prev,
            [name]: action
          }));
        }
      });
    });

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, scene]);

  // Handle animation states
  useEffect(() => {
    if (!animations.idle || !animations.talking || !animations.clapping || !animations.bow) return;

    const stopAllAnimations = () => {
      Object.values(animations).forEach(action => {
        if (action.isRunning()) {
          action.fadeOut(0.2);
        }
      });
    };

    if (isBowing) {
      stopAllAnimations();
      animations.bow.reset().fadeIn(0.2).play();
      animations.bow.setLoop(THREE.LoopOnce);
      setTimeout(() => {
        animations.bow.fadeOut(0.2);
        animations.idle.reset().fadeIn(0.2).play();
      }, 2000);
    } else if (isClapping) {
      stopAllAnimations();
      animations.clapping.reset().fadeIn(0.2).play();
    } else if (isTeaching) {
      stopAllAnimations();
      animations.talking.reset().fadeIn(0.2).play();
    } else {
      stopAllAnimations();
      animations.idle.reset().fadeIn(0.2).play();
    }
  }, [isTeaching, isClapping, isBowing, animations]);

  // Update animation mixer
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <primitive 
      object={scene} 
      scale={scale} 
      position={[0, -6, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

// Scene component
function Scene({ 
  cameraPosition,
  targetPosition,
  fov,
  enableZoom,
  minZoom,
  maxZoom,
  initialScale
}) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={fov}
      />
      
      <OrbitControls 
        enableZoom={enableZoom}
        enablePan={false}
        minDistance={minZoom}
        maxDistance={maxZoom}
        target={new THREE.Vector3(...targetPosition)}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.3}
        castShadow
      />
      <Environment 
        preset="sunset" 
        intensity={0.2}
      />
      
      <Suspense fallback={<LoadingSpinner />}>
        <AvatarModel scale={initialScale} />
      </Suspense>
    </>
  );
}

// Context provider component
export function SpeechProvider({ children }) {
  const [isTeaching, setIsTeaching] = useState(false);
  const [isClapping, setIsClapping] = useState(false);
  const [isBowing, setBowing] = useState(false);
  
  const value = {
    isTeaching,
    setIsTeaching,
    isClapping,
    setIsClapping,
    isBowing,
    setBowing
  };
  
  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
}

// Custom hook for accessing speech state
export function useSpeechState() {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeechState must be used within a SpeechProvider');
  }
  return context;
}

// Main Avatar component
function Avatar({ 
  cameraPosition = [0, 0, 0],
  targetPosition = [0, -6, 0],
  fov = 50,
  enableZoom = true, 
  minZoom = 2, 
  maxZoom = 10,
  initialScale = 5
}) {
  return (
    <Canvas
      shadows
      fog={{
        near: 10,
        far: 20,
        color: '#f0f0f0'
      }}
    >
      <Scene 
        cameraPosition={cameraPosition}
        targetPosition={targetPosition}
        fov={fov}
        enableZoom={enableZoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialScale={initialScale}
      />
      <color attach="background" args={['#f0f0f0']} />
    </Canvas>
  );
}

export default Avatar;