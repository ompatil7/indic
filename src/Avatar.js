// Avatar.js
import React, { Suspense, useEffect, useState, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const SpeechContext = createContext({
  isTeaching: false,
  setIsTeaching: () => {},
});

function LoadingSpinner() {
  return (
    <Html center>
      <div className="text-lg text-gray-600">Loading Avatar...</div>
    </Html>
  );
}

function AvatarModel() {
  const { scene } = useGLTF('/models/man.glb');
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));
  const [talkingAction, setTalkingAction] = useState(null);
  const { isTeaching } = useContext(SpeechContext);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('animations/Angry Gesture.fbx', (fbx) => {
      if (fbx.animations && fbx.animations.length > 0) {
        const animation = fbx.animations[0];
        const action = mixer.clipAction(animation, scene);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = true;
        setTalkingAction(action);
        action.play().stop();
      }
    });

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, scene]);

  useEffect(() => {
    if (!talkingAction) return;

    if (isTeaching) {
      talkingAction.reset().fadeIn(0.2).play();
    } else {
      talkingAction.fadeOut(0.2);
    }
  }, [isTeaching, talkingAction]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return <primitive object={scene} scale={4} position={[0, -6, 0]} />;
}

export function SpeechProvider({ children }) {
  const [isTeaching, setIsTeaching] = useState(false);
  
  const value = {
    isTeaching,
    setIsTeaching
  };
  
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

function Avatar() {
  return (
    <Canvas >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Suspense fallback={<LoadingSpinner />}>
        <AvatarModel />
      </Suspense>
    </Canvas>
  );
}

export default Avatar;