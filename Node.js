

/*
{
     "Id": "AlphaTango", // The node's unique identifier
     "Location": {
       "X": 53, // The node's X coordinate
       "Y": 54 // The node's Y coordinate
     },
     "Value": 20, // The node's remaining mineral value
     "ClaimedBy": "VictorEchoNovember" // Who has claimed the node, if anyone
   },
*/


class Node{

  constructor(data){
    this.id = data.Id;
    this.x = data.Location.X;
    this.y = data.Location.Y;
    this.value = data.Value;
    this.claimedBy = ""
  }

  isBot(){
    return false;
  }
  isNode(){
    return true;
  }
  render(){
    return `<div class="cell yellow">${this.value}</div>`
  }
}
