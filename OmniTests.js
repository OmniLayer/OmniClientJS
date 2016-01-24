var Omni = require('./lib/OmniRPC.js').Omni
var fs = require('fs')
var starWars = require('starwars')

var configurationFile = 'configuration.json';
var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

// Save client in a variable, even though all calss are made through the Omni object
var testClient = Omni.init(configuration.rpcuser, configuration.rpcpassword, null, true);

var account

var STP = {properties: [], books: [], pairs: [], trades: []}

var balances = []

var wallet = {}

var addresses = []

var suffixes = ['credits','peso','dollar','yuan','yen','pound','schilling','won']

var address = "n4Po8andi3akpQBxzBWXbQBttF9LueXqyo"

var address2 = ''

var trades = [{address: address, id1:0, amountforsale:'0', id2:0, amountdesired:'0', time: 0, result: 'err||txid'}]

var ids = []

var nthTrade = 0

var account = 0


Omni.listaccounts(function(accounts){
    console.log(accounts)
    account = accounts[0]
})

Omni.getnewaddress(account, function(newAddress){
    console.log(newAddress)
    address2 = newAddress
})

/*fs.readFile('testTrades.json', function(data){
    trades = JSON.parse(data)
})*/


Omni.getallbalancesforaddress(address,function(data){
    balances = data
    //console.log(balances)
    for(var i=2; i<data.length; i++){
    ids.push(balances[i]['propertyid'])
    }
    console.log(ids)
})

function nameGen(){
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var vowels = ['a','e','i','o','u']
    var max = Math.round(Math.random()*3)+2
    var newName = ""
    for(var letter = 0; letter<max; letter++){
        var rand = Math.round(Math.random()*25)
        var newLetter = ''
        if(letter == 1||letter ==3){
            rand = Math.round(Math.random()*4)
            newLetter = vowels[rand]
        }else{
            newLetter = alphabet[rand]
        }
        newName+=newLetter
    }
    rand = Math.round(Math.random()*7)
    newName = newName+suffixes[rand]
    //console.log(newName)
    return newName
}

function newProperty(cb){
    Omni.listproperties(function(data){
        var obj = JSON.stringify(data)
        STP.properties = data
        var array =[]
        for(var i=0; i<STP.properties.length;i++){
            array.push(STP.properties[i].propertyid)
        }
        array = array.sort(function(a,b){a-b})
         var value = data.length-1
             id = data[value].propertyid
             console.log('id:'+id)
        
    
    
        fs.writeFile('omnitestproperties.json', obj, function(err){
            if(err){throw err}
        })
        return cb(id)
    })
}

function issueManaged(){
    var newName = nameGen()
    var data = starWars()

    var params = {fromaddress: address, 
                    ecosystem: 2, 
                    type: 2, 
                    previousid: 0,
                    category: "Fictional Currency", 
                    subcategory: "Feeat", 
                    name: newName, 
                    url: "BancoFee.fu",
                    data: data
                }

    Omni.sendissuancemanaged(params, function(data){
        //console.log('issueance cb'+data)
         newProperty(function(id){
            console.log('id check'+id)
            Omni.sendgrant(address, address, id, '1000000', "blah!", function(data){
                //console.log('initial grant:'+data)
            })
        })
    })
}

function nextOrder(id1){
    var id2 = 2
    var rand = Math.random()*10000
    var pair = [id1,id2]
    var rand2 = Math.random()*5000
    //STP.pairs.push(pair)
    //console.log(address+' '+id1+' '+rand+' '+id2+' '+rand2)
    Omni.sendtrade(address,id1, rand, id2, rand2, function(data){
        var trade = {address:address,id1:id1,amountforsale:rand,id2:id2,amountdesired:rand2, time:Date.now(), result:data}
                   
                    if(nthTrade<ids.length){
                        console.log('recording'+JSON.stringify(trade))
                        trades.push(trade)
                    }else{return null}
                    //console.log('Trade'+data)
                    nthTrade += 1
                    nextOrder(ids[nthTrade])
    }) 
}

    
                /*Omni.sendgrant(address, address, id1, rand, "blah!", function(data){
                console.log('grant'+t+JSON.stringify(data))
                })*/

    
function orderBooks(){     
    for(var p = 2; p<length;p++){
        var id1 = array[p]['propertyid']
        var id2 = 2
        if(id1 == id2|| id1 == 1){
        //console.log('duplicate')
        }else{Omni.getorderbook(id1, id2, function(data){
        //console.log("Book"+JSON.stringify(data))
        if(data == undefined){}else{
        STP.books.push(makeBook(data))
        }})}
    //console.log(STP.books)
    }
}


function makeBook(data){
    var book = {name: '', bids: [], asks: []}
    
    for(var i = 0; i<data.length; i++){
       
       var order = data[i]
       var id1 = order['propertyidforsale']
       var name1 = ''
       
       Omni.getproperty(id1, function(data1){
           name1 = data1['name']
           book.name = name1
       })
       
       var id2 = order['propertyiddesired']
       var name2 = ''
       
       Omni.getproperty(id2, function(data2){
           name2 = data2['name']
       })
       
       var amtSale = parseFloat(order['amountforsale'])
       var amtDesired = parseFloat(order['amountdesired'])
       var unitPrice = amtSale/amtDesired
       var bookEntry = [amtSale, unitPrice]
       book.asks.push(bookEntry)
    }
    var sortedAsk = book.asks.sort(function(a, b){return a-b})
    //console.log(sortedAsk)
    return sortedAsk
}
/*Omni.listproperties(function(data){
    var obj = JSON.stringify(data)
    STP.properties = data
    var array =[]
    for(var i=0; i<STP.properties.length;i++){
        array.push(STP.properties[i].propertyid)
    }
    array = array.sort(function(a,b){a-b})
    var value = array.length - 1
    
    
    fs.writeFile('omnitestproperties.json', obj, function(err){
        if(err){throw err}
    })
})*/    
function loop(cb){
    nthTrade = 0
    nextOrder(ids[nthTrade])
    setTimeout(function(){
    //issueManaged()
    Omni.getallbalancesforaddress(address,function(data){
    balances = data
    console.log(data)
    for(var i=2; i<data.length; i++){
        ids.push(balances[i]['propertyid'])
        }
    })
    fs.writeFile('testTrades.json',JSON.stringify(trades), function(err){if(err)throw err})

    loop()
    }, 60000)
    
}
setTimeout(function(){loop()}, 2000)

/*
Array.prototype.pairs = function (func) {
    var pairs = [];
    for (var i = 0; i < this.length - 1; i++) {
        for (var j = i; j < this.length - 1; j++) {
            pairs.push([this[i], this[j+1]]);
        }
    }
    return func(pairs)
}

function selectCat(sub, cb){
    var array = []
for(var i = 0; i< STP.properties.length; i++){
    var property = STP['properties'][i]
    var subcategory = property['subcategory']
        if(subcategory == sub){
            array.push(property)
        }
    }
    array.pairs(function(pairs){
        console.log(pairs)
        return cb(pairs)
    })
}*/


/*fs.readFile('omnitestproperties.json',function(data){
    STP = JSON.parse(data)
    console.log(STP)
})

    var params = {fromaddress: address, 
                    ecosystem: 2, 
                    type: 1, 
                    previousid: 0,
                    category: "Relic", 
                    subcategory: "Dense", 
                    name: "Unliftable Gem", 
                    url: "www.seektherelic.org",
                    data: "These materials are primal, forged from spacetime. May bestow powers, makes a great paperweight.",
                    amount: "7", 
                    tokensperunit: "1", 
                    deadline: 1454114063, 
                    earlybonus: 1,
                    issuerpercentage:42
                }
                
    var params2 = {fromaddress: address, 
                    ecosystem: 2, 
                    type: 1, 
                    previousid: 0,
                    category: "Relic", 
                    subcategory: "Dense", 
                    name: "Unliftable Gem", 
                    url: "www.seektherelic.org",
                    data: "These materials are primal, forged from spacetime. May bestow powers, makes a great paperweight.",
                    amount: "7", 
                    tokensperunit: "1", 
                    deadline: 1454114063, 
                    earlybonus: 1,
                    issuerpercentage:42
                }

//Omni.sendissuancefixed(params, function(data){
//    console.log("fixed issuance:"+ data)
//})
/*var balance

Omni.getbalance(address, 2, function(data){
    console.log(data)
    balance = parseFloat(data)
})

var book

Omni.getorderbook(2, 8, function(data){

    console.log(data)    
    book = data
})


Omni.sendtoaddress("n4Po8andi3akpQBxzBWXbQBttF9LueXqyo", .01, function(data){
    console.log(data)
})

Omni.getomnibalance(address, 1, function(data){
    console.log(data)
})*/
    
    /*Omni.getaccountaddress('',function(data){
    //console.log(data)
    account = data
     addresses.push(address)
     wallet =  {addresses: addresses,account:account}
     //console.log(wallet)
     Omni.validateaddress(addresses[0], function(data){
         //console.log(data)
     })
    })*/

//Omni.getactivecrowdsales_layer(function(data){
//    console.log(data)
//})

/*Omni.getactivedexsells_layer(function(data){
    //console.log(data)
})

Omni.getgrants_layer(23, function(data){
    console.log("grants"+data)
})
*/

