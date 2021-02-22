// sentido do movimento
var dcima = 1;
var ddireita = 2;
var dbaixo = 3;
var desquerda = 4;

function Nodo(px, py, dir){
    var x, y, direc;
    this.x = px;
    this.y = py;
    this.direc = dir;
    this.Mover = function(){
        switch(this.direc){
            case dcima:
                this.y -=1;
                break;
            case dbaixo:
                this.y += 1;
                break;
            case ddireita:
                this.x +=1;
                break;
            case desquerda:
                this.x -=1;
                break
        }
    };
}