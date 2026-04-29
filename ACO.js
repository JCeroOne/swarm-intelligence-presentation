const MAX_PATH_LENGTH = 500;
const MAX_ITERATIONS = 500;
const ANTS = 30;

const Dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

class Grid {
    #cells;
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.#cells = {};
        this.#prepare();
    }
    #prepare(){
        const colony_pos = [Math.round(this.width * 0.15), Math.round(this.height / 2)];
        const food_pos = this.#foodPos(colony_pos);

        this.colony = new Colony(this, colony_pos[0], colony_pos[1], ANTS);

        console.log(colony_pos, food_pos);

        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                let type;
                if(x == colony_pos[0] && y == colony_pos[1]) type = "colony";
                else if(x == food_pos[0] && y == food_pos[1]) type = "food";
                else if(Dist(colony_pos[0], colony_pos[1], x, y) < 2 || Dist(food_pos[0], food_pos[1], x, y) < 2) type = "normal";
                else type = ["normal", "normal", "normal", "obstacle"][Math.floor(Math.random() * 4)]
                this.#cells[`${x} ${y}`] = new GridCell(this, x, y, food_pos, type);
            }
        }
    }
    #foodPos(colony_pos){
        let pos = [Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height)];
        while(Dist(colony_pos[0], colony_pos[1], pos[0], pos[1]) < Math.min(this.width, this.height) / 3){
            pos = [Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height)];
        }
        return pos;
    }
    getCell(x, y){
        return this.#cells[`${x} ${y}`] ? this.#cells[`${x} ${y}`] : null;
    }
    print(){
        let display = "";
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const cell = this.getCell(x, y);
                if(cell.type == "food") display += "F";
                else if(cell.type == "colony") display += "C";
                else if(cell.type == "obstacle") display += "X";
                else display += "O";
            }
            if(y < this.height - 1) display += "\n";
        }
        console.log(display);
    }
}

class GridCell {
    constructor(grid, x, y, food_pos, type="normal"){
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.type = type;
        this.pheromones = 0;
    }
    Step(){
        this.pheromones *= 0.9;
    }
}

class Colony {
    constructor(grid, x, y, size){
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.size = size;
        this.#populate(this.size);
    }
    #populate(){
        this.ants = [];
        for(let i = 0; i < this.size; i++) this.ants.push(new Ant(this.grid, this.x, this.y));
    }
}

class Ant {
    constructor(grid, x, y){
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.path = [];
    }
    calcProbs(){
        const cells = [];
        if(this.path.indexOf([this.x, this.y + 1]) == -1) cells.push({cell: this.grid.getCell(this.x, this.y + 1), prob: 0});
        if(this.path.indexOf([this.x + 1, this.y]) == -1) cells.push({cell: this.grid.getCell(this.x + 1, this.y), prob: 0});
        if(this.path.indexOf([this.x - 1, this.y]) == -1) cells.push({cell: this.grid.getCell(this.x - 1, this.y), prob: 0});
        if(this.path.indexOf([this.x, this.y - 1]) == -1) cells.push({cell: this.grid.getCell(this.x, this.y - 1), prob: 0});
        const total = cells.reduce((total, current) => total + Math.max(0.1, current.cell.pheromones), 0);
        cells.forEach(c => {
            c.prob = Math.max(0.1, c.cell.pheromones) / total;
        });
        return cells;
    }
    move(){
        this.path.push([this.x, this.y]);
        const cells = this.calcProbs();
        let next = Math.random();
        let nextCell = null;
        let cumulative = 0;
        for(let c = 0; c < cells.length; c++){
            if(cumulative + cells[c].prob >= next){
                nextCell = cells[c].cell;
                break;
            }
            cumulative += cells[c].prob;
        }
        this.x = nextCell.x;
        this.y = nextCell.y;
    }
    layPheromones(){

    }
}