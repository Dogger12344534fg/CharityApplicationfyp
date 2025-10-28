function List (){
  const fruits =[{ id : 1, name :"gr", cal :"h"},
    {id : 2 ,name :"red", cal :"g"},
    {id :3 ,name :"f", cal :"to"},
    {id : 4,name :"deep", cal :"yo"}
  ]
  const listItems = fruits.map(fruit => <li key = {fruit.id}>{fruit.name}:<b>{fruit.cal}</b></li>)
  return(<ol>{listItems}</ol>);
}

export default List