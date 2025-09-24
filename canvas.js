var canvas = document.querySelector('canvas');

canvas.width =  900;
canvas.height = 900;

var c = canvas.getContext('2d');

var mouse = {
    x:undefined,
    y:undefined
}

var colorArray= 
[
    '#ffaa33',
    '#99ffaa',
    '#00ffff',
    '#4411aa',
    '#ff7700'
];

function randomIntFromRange(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomColor(colors)
{
    return colors[Math.floor(Math.random()*colors.length)];
}
window.addEventListener('mousemove', function(event)
{
    mouse.x = event.x;
    mouse.y = event.y;
})

areaSizeX = 1000;
areaSizeY = 1000;
ihaSize = 50;

resX = ihaSize / areaSizeX *canvas.height
resY = ihaSize / areaSizeY *canvas.width
maxIX =  areaSizeX/ihaSize
maxIY =  areaSizeY/ihaSize

points = new Array(maxIX+1);
for (var i = 0; i < points.length; i++) {
    points[i] = new Array(maxIY+1);
}


for(var i=0;i<maxIX;i++)
{
    for(var j=0;j<maxIY;j++)
    {

        points[i][j] = ( new point('#ff0000') )
        paint(i,j,points[i][j].color)

    }
}


/*
obstacles = [[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],  [4,10],[5,10],[6,10],[7,10],[8,10],[9,10] ]

obstacles.forEach(loc => {
    paint(loc[0],loc[1],"#000000")
    points[loc[0]][loc[1]].isOccupied = true;
});
*/

function paint(i,j,color)
{
    c.fillStyle = color
    c.fillRect(i*resX, j*resY,resX, resY);
}

function point(color)
{
    this.color=color;
    this.isOccupied=false;
    return this;
}

function agent(id,x,y)
{
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = colorArray[id%colorArray.length]
    this.toplamYol = 0;
    this.draw = function()
    {
        paint(this.x,this.y,this.color) // Bulunduğu Bölgeyi Boyar
    }
    this.move = function()
    {
        try         { p0 = points[this.x+1][this.y] }
        catch (ex)  { p0 = {isOccupied:true} }

        try         { p1 = points[this.x][this.y+1] }
        catch (ex)  { p1 = {isOccupied:true} }

        try         { p2 = points[this.x-1][this.y] }
        catch (ex)  { p2 = {isOccupied:true} }

        try         { p3 = points[this.x][this.y-1] }
        catch (ex)  { p3 = {isOccupied:true} }

        if(p0 == undefined) p0 = {isOccupied:true}
        if(p1 == undefined) p1 = {isOccupied:true}
        if(p2 == undefined) p2 = {isOccupied:true}
        if(p3 == undefined) p3 = {isOccupied:true}


        if(!p0.isOccupied)
        {
            console.log("p0 Clear")
            this.x = this.x+1;
            this.toplamYol += 1;
            p0.isOccupied = true;
        }
        else if(!p3.isOccupied ) 
        {
            console.log("p3 Clear")
            this.y = this.y-1;
            this.toplamYol += 1;
            p3.isOccupied = true;
        }
        else if(!p2.isOccupied) 
        {
            console.log("p2 Clear")
            this.x = this.x-1;
            this.toplamYol += 1;
            p2.isOccupied = true;
        }
        else if(!p1.isOccupied ) 
        {
            console.log("p1 Clear")
            this.y = this.y+1;
            this.toplamYol += 1;
            p1.isOccupied = true;
        }
        else 
        {
            winner =
            {
                mesafe: Infinity,
                loc : [0,0]
            } 
            for(var i=0;i<maxIX;i++)
            {
                for(var j=0;j<maxIY;j++)
                {
                    grid = points[i][j]
                    if ( !grid.isOccupied )
                    {
                        mesafe = Math.sqrt((i-this.x)**2 + (j-this.y)**2)
                        if (mesafe < winner.mesafe) winner = {mesafe: mesafe, loc : [i,j]}
                    }
                }
            }
            if(winner.mesafe != Infinity)
            {

                this.toplamYol += winner.mesafe;
                wX = winner.loc[0] 
                wY = winner.loc[1]
                if((this.x - wX) > 0 )
                {
                    this.x = this.x-1;
                    this.toplamYol += 1;
                    points[this.x][this.y].isOccupied = true;
                }
                else if((this.x - wX) < 0 )
                {
                    this.x = this.x+1;
                    this.toplamYol += 1;
                    points[this.x][this.y].isOccupied = true;
                }
                if((this.y - wY) > 0 )
                {
                    this.y = this.y-1;
                    this.toplamYol += 1;
                    points[this.x][this.y].isOccupied = true;
                }
                else if((this.y - wY) < 0 )
                {
                    this.y = this.y+1;
                    this.toplamYol += 1;
                    points[this.x][this.y].isOccupied = true;
                }
            }
            else
            {
                console.log(this.id + " : " + this.toplamYol)
            }
        }
        this.draw();
    }
    return this;
}


var aaa = [new agent(0,0,0),new agent(1,1,0),new agent(2,2,0),new agent(3,3,0),new agent(4,4,0),new agent(5,5,0),new agent(6,6,0),new agent(7,7,0),new agent(8,8,0)];

aaa.forEach(a => {
    a.draw();
    points[a.x][a.y].isOccupied = true;
});

function main()
{
    aaa.forEach(a => {
        a.move();
    }); 
}


//main()
setInterval(main,1000/10)



/*
for(var i=1;i<=maxI;i++)
{
    c.beginPath();
    c.strokeStyle = "#000000";
    c.moveTo(0,resX*i);
    c.lineTo( canvas.width,resX*i);
    c.stroke();
    c.moveTo(resY*i,0);
    c.lineTo(resY*i,canvas.height);
    c.stroke();
}
*/