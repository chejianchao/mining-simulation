
let i = 0;
class Bot{

  constructor(data, Grid){
    this.id = data.Id;
    this.node = null;
    this.x = data.Location.X;
    this.y = data.Location.Y;
    this.claims = []
    this.visited = {}
    this.score = 0;
    this.grid = Grid.grid;
    this.Grid = Grid
    this.dir  = i++;
    this.target = null
  }

  isBot(){
    return true;
  }
  isNode(){
    return false;
  }

  visit(x, y){
    this.visited[x*GRID_ROWS + y] = (this.visited[x*GRID_ROWS + y] || 0) + 1;
    //this.Grid.visited[x][y] = 1
  }

  isVisited(x, y){
    return this. visited[x*GRID_ROWS + y] || 0
  }

  addClaim(node){
    this.claims = this.claims.filter(node=>node.value > 0 )
    if( this.claims.length < 3 && node && node.value > 0 ){
      this.claims.push(node);
      node.claimedBy = this;
    }
  }
  scan(){
    const grid = this.grid;
    //if( this.node || (grid[this.x][this.y] && grid[this.x][this.y].isNode() ) ){
    if( this.node && this.node.value > 0 ){
      this.mine(this.x, this.y);
      return this.addClaim();
    }
    const dx = [1,0,-1,0, 1,1,-1,-1, 2,0,-2,0 ];
    const dy = [0,1,0,-1, 1,-1,-1,1, 0,-2,0,2 ];
    let no_choice = null;
    let choice = [];
    for( let i = 0; i < dx.length; i++ ){
      const nx = this.x + dx[i];
      const ny = this.y + dy[i];
      if( nx >= 0 && ny >= 0 && nx < GRID_ROWS && ny < GRID_COLS ){
        const node = grid[nx][ny];
        if( node && node.isNode() && !node.claimedBy && node.value > 0 ){
          this.addClaim(node)
        }
        if( i < 4 && (!grid[nx][ny] || grid[nx][ny].isNode() ) ){
          choice.push([dx[ i], dy[i]]);
          if(!no_choice)
            no_choice = [dx[ i], dy[i]]
          else if( !this.isVisited(nx, ny) )
            no_choice = [dx[i], dy[i]]
        }
      }
    }
    //console.log(" nochoice move ", no_choice)
    for( let i = 0; i < this.claims.length; i++ ){
      const node = this.claims[i];
      if( this.move(node.x, node.y) )
        return true;
    }


  /*  const {x, y} = this.Grid.getNoViist();
    if( x >= 0 && !this.target ){
      this.target = {x,y}
    }
    if( this.target )
      return this.move(this.target.x, this.target.y);*/
    if( no_choice)
      this.move(this.x+no_choice[0],this.y+no_choice[1])
  }

  move(x, y){
    const grid = this.grid
    if( this.x == x && this.y == y ){

      this.visit(this.x, this.y);
      this.target = null;
      return true;
    }
    let dx = x - this.x;
    let dy = y - this.y;

    if( Math.abs(dx) > 0 ){
      dx = dx>0?1:-1
      x = this.x + dx;
      y = this.y;
    }else{
      dy = dy>0?1:-1
      x = this.x;
      y = this.y + dy;
    }
    if( grid[x][y] && grid[x][y].isBot() )
      return false;
    const prevNode = this.node;
    this.node = grid[x][y];
    grid[x][y] = this;
    grid[this.x][this.y] = prevNode;
    this.x = x;
    this.y = y;
    this.visit(this.x, this.y);
    //console.log(" Bot :", this.id, "move to ", this.x, this.y);
    return true;
  }

  mine(x, y){
    if( !this.node ){
      return;
    }
    const grid = this.grid
    //const node = grid[this.x][this.y];
    //if( !node || (node.isNode() == false && node.node == null) )
    //  return console.log("It is not node, you can't mine it.", node);
    const node = this.node;
    if( node.value > 0 ){
      node.value--;
      this.score += 1;
    }
    if( node.value == 0 ){
      this.addClaim();
    }

    //node.claimedBy = this.id;
    //grid[this.x][this.y] = null;
    //this.node = null;
  }

  render(){
    return `<div class="cell ${this.node ? (this.node.value?"purple":"blue" ):"red"}">${this.score}</div>`
  }
}
