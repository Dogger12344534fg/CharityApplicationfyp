import React,{useState} from 'react';


function Counter(){

  let [count, setCount] = useState(0)

  const increment = ()=>{
    setCount(count+1);
  }

  const decrement =()=>{
    setCount(count-1);
  }

  const reset =()=>{
    setCount(0);
  }

  return(
    <div className="count">
      <p className='count-display'>{count}</p>
      <button className='counter-button' onClick={decrement}>Decrement</button>
      <button className='counter-button' onClick={reset}>reset</button>
      <button className='counter-button' onClick={increment}>Increment</button>


      
    </div>
  );
}

export default Counter