
const GRID_ROWS = 20
const GRID_COLS = 20
const NODES_URL = 'http://headlight-tournament-1.herokuapp.com/nodes'
const BOTS_URL = 'http://headlight-tournament-1.herokuapp.com/bots'
const INTERVAL = 200
class Grid{

  constructor(){
    this.grid = Array(20).fill(1).map(r=>Array(20).fill(null));
    this.visited = Array(20).fill(1).map(r=>Array(20).fill(0));
    this.bots = []
    this.nodes = []
  }

  getNoViist(){
    const noVisit = []
    for( let i = 0; i<this.visited.length; i++){
      for( let j = 0; j< this.visited[i].length; j++){
        if( !this.visited[i][j] )
          noVisit.push( {x:i, y:j} )
      }
    }
    return noVisit[parseInt( Math.random() * noVisit.length ) ]
  }
  async init(){
    const nodesData = (await fetch(NODES_URL).then(resp=>resp.json())).Nodes
    //console.log(nodesData)
    nodesData.forEach(nodeData=>{
        const {X,Y} = nodeData.Location;
        const node = new Node(nodeData);
        this.grid[X][Y] = node;
        this.nodes.push(node);
    })

    const botsData = (await fetch(BOTS_URL).then(resp=>resp.json())).Bots
    //console.log(botsData)
    botsData.forEach(botData=>{
      const {X, Y} = botData.Location;
      const bot = new Bot(botData, this);
      bot.node = this.grid[X][Y];
      this.grid[X][Y] = bot;
      this.bots.push(bot);
    })
    this.render();
    this.interval = setInterval(this.scan.bind(this),  INTERVAL)
  }

  scan(){
    this.bots.forEach(bot=>{
      bot.scan(this);
    })
    this.render();
    let nodeCnt = 0;
    this.grid.forEach(row=>row.forEach(col=> col ? (nodeCnt+= (col.value||0) +  (col.node ? col.node.value: 0)) :"" ))
    if( nodeCnt == 0 ){
      setTimeout(()=>{
        clearInterval(this.interval)
        this.bots.forEach(bot=>console.log(bot, bot.x, bot.y))
        this.grid.forEach(row=>row.forEach(bot=> (bot && bot.isBot())?bot:""))
      }, INTERVAL+INTERVAL+20)
    }
  }
  render(){
    const grid = document.getElementById("grid");
    grid.innerHTML = this.grid.map(row=>row.map(col=>col ?col.render():'<div class="cell white"></div>' ).join("") ).join("")
    //console.log(grid.innerHTML);
  }
}

//new Grid()
//console.log
