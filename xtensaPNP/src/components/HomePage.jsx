import React from 'react'
import ObjectDetecion from './ai/ObjectDetection'

export default function HomePage() {
  return (
    <>
      <div>HomePage</div>
      <ObjectDetecion modelName={"broken_traces"}/>
    
    </>
  )
}
