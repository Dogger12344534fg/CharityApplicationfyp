import List from "./list";  
function App() {
    const fruits =[{ id : 1, name :"gr", cal :"h"},
    {id : 2 ,name :"red", cal :"g"},
    {id :3 ,name :"f", cal :"to"},
    {id : 4,name :"deep", cal :"yo"}
  ]

    const veg =[{ id : 5, name :"celery", cal :"h"},
    {id : 6 ,name :"carrot", cal :"g"},
    {id :7 ,name :"cabbage", cal :"to"},
    {id : 8,name :"corn", cal :"yo"}
  ]
 
return (<>
  {fruits.length >0 &&<List items ={fruits} category ="Fruits"/>}
   {veg.length > 0 &&  <List items ={veg} category ="veggies"/>}
  </>
);
}
export default App;