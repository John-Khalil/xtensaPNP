import React from 'react'
import ObjectDetecion from './ai/ObjectDetection'

export default function HomePage() {
  return (
    <>
      <div>HomePage</div>
      <ObjectDetecion userModel={{
        modelName:'broken_traces',
        labels:['missing_hole', 'mouse_bite','open_circuit', 'short', 'spur', 'spurious_copper'],
        onDetect:(res)=>{
          const [boxes, scores, classes] = res.slice(0, 3);
          const boxes_data = boxes.dataSync();
          const scores_data = scores.dataSync();
          const classes_data = classes.dataSync();
          console.log(res);
        }
      }
      }/>
    
    </>
  )
}
