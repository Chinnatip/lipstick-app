import { useRef, useState } from "react";
import "./App.css";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
import { draw } from "./mask";
import Webcam from "react-webcam";

const lipLists = [
  { name: 'Purple wink', color: "#A31DB9" },
  { name: 'Rose marie', color: "#C72020" },
  { name: 'Green apple', color: "#63AE3F" }
]

const useFaceDetect = async (webcam: any, setload : any, canvas: any , lipStick: { color: string, name:string }) => {
  const model = await faceLandmarksDetection.load( faceLandmarksDetection.SupportedPackages.mediapipeFacemesh );
  if (!webcam.current || !canvas.current) return;
  const webcamCurrent = webcam.current as any;
  const video = webcamCurrent.video;
  canvas.current.width = webcamCurrent.video.videoWidth;
  canvas.current.height = webcamCurrent.video.videoHeight;
  const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;
  detect(video, ctx, model,setload, lipStick);
};

const detect = async (video: any, ctx: any, model: MediaPipeFaceMesh, setload: any,  lipStick: { color: string,name:string }) => {
  // Predict face in every frame
  const predictions = await model.estimateFaces({ input: video });
  setload(true)

  // Draw lipstick
  requestAnimationFrame(() => { draw(predictions, ctx, `${lipStick.color}4D`) });

  // TODO: edible lipstick color
  // Loop draw faces
  detect(video, ctx, model,setload, lipStick);
};

function App() {
  const webcam = useRef<Webcam>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setload] = useState(false)
  const [lipStick, setLip] = useState(lipLists[1])

  useFaceDetect(webcam, setload, canvas, lipStick);

  return (
    <div className="App">
      { !loaded && <div style={{
        zIndex: 100,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        background: 'rgb(31 31 31 / 91%)',
      }}>Loading model ......</div>}
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcam}
        style={{
          position: "absolute",
          margin: "auto",
          textAlign: "center",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
        }}
        videoConstraints={{
          width: 480,
          height: 480,
          facingMode: "user"
        }}
      />
      <div style={{ position: "absolute" , top: '24px', left: 0 , width: '100%' , textAlign: "center", zIndex: 50 }}>
        <div style={{ borderRadius: '200px', background: 'whitesmoke', padding: '8px 12px', display: "inline-flex",justifyContent: "center",  alignItems: 'center'  }}>
          <span style={{background: lipStick.color, marginRight: '8px', display: 'inline-block', borderRadius: '200px', width: '20px' , height: '20px'}} />
          <span style={{color: lipStick.color, fontWeight: 500}}>{lipStick.name}</span>
        </div>
      </div>
      <div style={{ position:'absolute', width:'100%', textAlign:'center', top: '484px'}}>
        <div style={{ width: '480px', display: 'flex', margin: 'auto'}}>
          { lipLists.map( lip => <div onClick={() => setLip(lip)} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '33.33%',
              margin: '0px 3px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              background: `${lip.color}${lip.color != lipStick.color ? '4D' : '' }`
            }}>
            {lip.name}
          </div>) }
        </div>
      </div>
      <canvas
        ref={canvas}
        style={{
          position: "absolute",
          margin: "auto",
          textAlign: "center",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
        }}
      />
    </div>
  );
}

export default App;
