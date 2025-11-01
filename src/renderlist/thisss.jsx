import PropTypes from 'prop-types';
function List (props){

  // fruits.sort((a,b) => a.name.localeCompare(b.name));
  const catgory = props.category;
  const itemlist = props.items;
  const listItems = itemlist.map(item => <li key = {item.id}>{item.name}:<b>{item.cal}</b></li>)
  return(<>
  <h2 className="list-cat">{catgory}</h2>
  <ol className="list-items">{listItems}</ol>
  </>);
}

List.PropTypes={
  category :PropTypes.string,
  Items:PropTypes.arrayOf(  PropTypes.shape({id: PropTypes.number,
    name: PropTypes.string,
    cal:PropTypes.number
  }))


}

List.defaultProps={
  category:"category",
  item:[],

}

export default List



//add this to app.jsx

//  const fruits =[{ id : 1, name :"gr", cal :"h"},
//     {id : 2 ,name :"red", cal :"g"},
//     {id :3 ,name :"f", cal :"to"},
//     {id : 4,name :"deep", cal :"yo"}
//   ]

//     const veg =[{ id : 5, name :"celery", cal :"h"},
//     {id : 6 ,name :"carrot", cal :"g"},
//     {id :7 ,name :"cabbage", cal :"to"},
//     {id : 8,name :"corn", cal :"yo"}
//   ]

  // {fruits.length >0 &&<List items ={fruits} category ="Fruits"/>}
  //  {veg.length > 0 &&  <List items ={veg} category ="veggies"/>}