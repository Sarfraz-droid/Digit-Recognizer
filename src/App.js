import './App.css';
import CanvasDraw from "react-canvas-draw";
import * as tf from '@tensorflow/tfjs'
import React,{useState,useEffect,useRef} from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function App() {


  const ref = useRef(null);

  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState([
    {
      name: '0',
      value: 0
    },
    {
      name: '1',
      value: 0
    },
    {
      name: '2',
      value: 0
    },
    {
      name: '3',
      value: 0,
    },
    {
      name: '4',
      value: 0
    },
    {
      name: '5',
      value: 0
    },
    {
      name: '6',
      value: 0
    },
    {
      name: '7',
      value: 0
    },
    {
      name: '8',
      value: 0
    },
    {
      name: '9',
      value: 0
    }
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await loadModel();
  }, [])

  async function loadModel(){
    const layer = await tf.loadLayersModel('./model/model.json');

    setModel(layer);

    console.log(layer);
  }


  const handleSubmit = async () => {
    const ctx = ref.current.canvasContainer.childNodes[1].getContext('2d');

    let myImageData = ctx.getImageData(0,0,280,280).data;
    
    let myImageDataArray = [];

    for(let i = 0; i < myImageData.length; i+=4){
      myImageDataArray.push(myImageData[i]);
    }

    const myImageDataArray2D = tf.tensor2d(myImageDataArray, [280, 280]);

    const myImageDataArray3D = myImageDataArray2D.reshape([1, 280, 280, 1]);

    const finalImageArray = tf.image.resizeBilinear(myImageDataArray3D, [28, 28]);

    const finalImageArray2D = finalImageArray.reshape([1, 28, 28, 1]);
    
    console.log(Array.from(finalImageArray2D.shape));

    const predictions = await model.predict(finalImageArray2D);

    console.log(predictions);

    const arraypredictions = Array.from(predictions.dataSync());

    console.log(arraypredictions);

    const arraypredictions2 = arraypredictions.map((item, index) => {
      return {
        name: index,
        value: item
      }
    });

    setPrediction(arraypredictions2);
    
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center items-center">
          <h1 className="py-5 text-3xl">
            getDigit  
          </h1>        
      </div>
      <div className="border border-gray-100 rounded-md">
        <CanvasDraw ref={ref} canvasWidth={280} canvasHeight={280} brushRadius={6}/>
      </div>
      <div className="flex mt-5">
        <button className="px-8 py-2 text-xl mx-10 bg-blue-400 text-white rounded-md shadow-md shadow-blue-400/20 hover:-translate-y-1 transition-all hover:shadow-lg hover:shadow-blue-400/40" onClick={() => {
          ref.current.clear();
        }}>
          Clear
        </button>
        <button className="px-8 py-2 text-xl mx-10 bg-red-400 text-white rounded-md shadow-md shadow-red-400/20 hover:-translate-y-1 transition-all hover:shadow-lg hover:shadow-red-400/40"
          onClick={async() => {
            // await loadModel();
            await handleSubmit();
          }}
        >
          Submit
        </button>
      </div>
      <div className='mt-4'>
        <BarChart width={300} height={200} data={prediction}>
          <Bar dataKey="value" fill="#8884d8" />
          <XAxis dataKey="name" />
        </BarChart>
      </div>
      {/* <div className="mt-14 flex">
        <h2 className="text-xl self-center">
          Uhmm I guess its : 
        </h2>
          <p className="text-lg bg-blue-400 ml-6 px-3 py-2 rounded-full">
            1
          </p>
      </div> */}
    </div>
  );
}

export default App;
