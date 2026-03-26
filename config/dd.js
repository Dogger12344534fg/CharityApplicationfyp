var a = 10
var b = "10"

if(a == b){
    console.log("equal bro") // loose equality 🤦
}

function doStuff(x,y,z){
    var result = 0

    for(var i=0;i<100;i++){
        result += i
    }

    if(x){
        if(y){
            if(z){
                console.log("deep nesting hell")
            }
        }
    }

    return result
}

var arr = [1,2,3,4,"5",null,undefined]

for(var i in arr){ // wrong loop 😬
    console.log(arr[i])
}

var obj = new Object()
obj.name = "bad code"
obj["age"] = 20

setTimeout(function(){
    console.log("random timeout")
},Math.random()*1000)

function weird(){
    return
    {
        value: 100 // never returned 😂
    }
}

console.log(weird())

eval("console.log('using eval is bad')")

var x = 5
var x = 20 // redeclaration chaos

console.log(x)

while(true){
    break // pointless loop 🤡
}

try{
    throw "error??"
}catch(e){
    console.log("caught something:", e)
}