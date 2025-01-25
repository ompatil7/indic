import React, { Suspense, useEffect, useState, createContext, useContext, useRef } from 'react';
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

// Preload manager for animations
const PreloadManager = {
  animations: {},
  isLoading: true,
  loadPromise: null,

  async preloadAssets() {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise(async (resolve) => {
      // Preload GLTF model
      useGLTF.preload('/models/megan.glb');
      
      // Load animations
      const fbxLoader = new FBXLoader();
      const animationPaths = {
        idle: 'animations/idle.fbx',
        talking: 'animations/talk1.fbx',
        clapping: 'animations/clap.fbx',
        bow: 'animations/bow.fbx'
      };

      const animationPromises = Object.entries(animationPaths).map(([name, path]) => {
        return new Promise((resolve) => {
          fbxLoader.load(path, (fbx) => {
            if (fbx.animations && fbx.animations.length > 0) {
              this.animations[name] = fbx.animations[0];
            }
            resolve();
          });
        });
      });

      await Promise.all(animationPromises);
      this.isLoading = false;
      resolve();
    });

    return this.loadPromise;
  }
};

function LoadingSpinner() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Html center>
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading Avatar... {progress}%</div>
      </div>
    </Html>
  );
}

// Optimized Avatar model component
function AvatarModel({ scale = 4 }) {
  const { scene } = useGLTF('/models/megan.glb');
  const mixerRef = useRef(null);
  const [actions, setActions] = useState({});
  const { isTeaching, isClapping, isBowing } = useContext(SpeechContext);

  // Initialize animations once
  useEffect(() => {
    if (!PreloadManager.animations || Object.keys(PreloadManager.animations).length === 0) return;

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    const newActions = {};
    Object.entries(PreloadManager.animations).forEach(([name, animation]) => {
      const action = mixer.clipAction(animation, scene);
      action.setLoop(THREE.LoopRepeat);
      action.clampWhenFinished = true;
      newActions[name] = action;
    });
    setActions(newActions);

    // Configure materials
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.roughness = 1;
        child.material.metalness = 0;
        child.material.envMapIntensity = 0.3;
      }
    });

    return () => {
      const currentMixer = mixerRef.current;
      if (currentMixer) {
        currentMixer.stopAllAction();
        currentMixer.uncacheRoot(scene);
      }
    };
  }, [scene]);

  // Handle animation states
  useEffect(() => {
    if (Object.keys(actions).length === 0) return;

    const stopAllAnimations = () => {
      Object.values(actions).forEach(action => {
        if (action.isRunning()) {
          action.fadeOut(0.2);
        }
      });
    };

    if (isBowing) {
      stopAllAnimations();
      actions.bow.reset().fadeIn(0.2).play();
      actions.bow.setLoop(THREE.LoopOnce);
      setTimeout(() => {
        actions.bow.fadeOut(0.2);
        actions.idle.reset().fadeIn(0.2).play();
      }, 2000);
    } else if (isClapping) {
      stopAllAnimations();
      actions.clapping.reset().fadeIn(0.2).play();
    } else if (isTeaching) {
      stopAllAnimations();
      actions.talking.reset().fadeIn(0.2).play();
    } else {
      stopAllAnimations();
      actions.idle.reset().fadeIn(0.2).play();
    }
  }, [isTeaching, isClapping, isBowing, actions]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
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

// Context provider component
export function SpeechProvider({ children }) {
  const [isTeaching, setIsTeaching] = useState(false);
  const [isClapping, setIsClapping] = useState(false);
  const [isBowing, setBowing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    PreloadManager.preloadAssets().then(() => {
      setIsLoaded(true);
    });
  }, []);
  
  const value = {
    isTeaching,
    setIsTeaching,
    isClapping,
    setIsClapping,
    isBowing,
    setBowing
  };
  
  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading resources...</div>
      </div>
    );
  }
  
  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeechState() {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeechState must be used within a SpeechProvider');
  }
  return context;
}

// Scene component
function Scene({ cameraPosition, targetPosition, fov, enableZoom, minZoom, maxZoom, initialScale }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
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
      <directionalLight position={[5, 5, 5]} intensity={0.3} castShadow />
      <Environment preset="sunset" intensity={0.2} />
      
      <Suspense fallback={<LoadingSpinner />}>
        <AvatarModel scale={initialScale} />
      </Suspense>
    </>
  );
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