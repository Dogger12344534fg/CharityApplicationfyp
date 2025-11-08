import React,{useState} from "react";

function Manu(){

  // const [food, setFood]= useState(["Mang0","Dill","Tomatoes"]);

  // function updateList(){
  //   const list = document.getElementById("Nametext").value;
  //   document.getElementById("Nametext").value="";
  //   setFood(f=>[...food,list]);
  // }

  // function removelist(index){
  //   setFood(food.filter((_,i)=> i!==index));

  const[car,setCar] = useState([]);
  const[carYear,setCaryear] = useState(new Date().getFullYear());
  const[model,setModel] = useState("");
  const[make,setMake] = useState("");

  function handleAddCar(){
    const newCar = { Year:carYear,
      who:make,
      mod:model,
    };

    setCar(c=>[...car,newCar]);
     setMake("");
    setModel("");
    setCaryear(new Date().getFullYear());

  }

  function Remove(index){
    setCar(c=>c.filter((_,i)=> i!==index));


  }

  function handleCarYear(event){
         setCaryear(event.target.value)

  }

    function handleModel(event){
           setModel(event.target.value)
    
  }

    function handleMake(event){
      setMake(event.target.value)
    
  }

  // }
  return (
    // <div>
    //   <h2>THis is new to me</h2>
    //   <ol>
    //     {food.map((food,index) => <li key={index} onClick={()=>removelist(index)}>{food}</li>)}
    //   </ol>
    //   <input type="text" id="Nametext" placeholder="this is new programming"/>
    //   <button onClick={updateList}>click to add</button>
    //   <button onClick={removelist}>click to delete</button>

    // </div>

    <div>
      <h2>List of Car</h2>
      <ol>
        {car.map((car,index) => <li key ={index} onClick={()=>Remove(index)}>{car.Year}{car.who}{car.mod}</li>)}
      </ol>

      <input type="number" value={carYear} onChange={handleCarYear} placeholder="year"/><br/>
      <input type="text" value ={make} onChange={handleMake} placeholder="maker"/><br/>
      <input type="text" value ={model} onChange={handleModel} placeholder="model"/><br/>
      <button onClick={handleAddCar}>this is new</button>
    </div>
  );
}

export default Manu