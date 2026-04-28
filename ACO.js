function Dist(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
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

        console.log(colony_pos, food_pos);

        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                let type;
                if(x == colony_pos[0] && y == colony_pos[1]) type = "colony";
                else if(x == food_pos[0] && y == food_pos[1]) type = "food";
                else if(Dist(colony_pos[0], colony_pos[1], x, y) < 2 || Dist(food_pos[0], food_pos[1], x, y) < 2) type = "normal";
                else type = ["normal", "normal", "normal", "obstacle"][Math.floor(Math.random() * 4)]
                this.#cells[`${x} ${y}`] = new GridCell(x, y, food_pos, type);
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
    constructor(x, y, food_pos, type="normal"){
        this.x = x;
        this.y = y;
        this.type = type;
        this.pheromones = 0;
        this.smell = this.#calcSmell(food_pos);
    }
    #calcSmell(food_pos){
        return 1 / Math.max(1, Dist(this.x, this.y, food_pos[0], food_pos[1]));
    }
    Step(){
        this.pheromones *= 0.9;
    }
}
class Colony {
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.#populate(this.size);
    }
    #populate(){
        this.ants = [];
        for(let i = 0; i < this.size; i++) this.ants.push(new Ant());
    }
}
class Ant {}