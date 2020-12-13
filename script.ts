class Game {
    team1:Team;
    team2:Team;
    game:HTMLDivElement;
    hit1:HTMLButtonElement;
    hit2:HTMLButtonElement;
    generateRsult:HTMLButtonElement;
    playerNum:number;
    ballNum:number;
    timerInterval: number;
    constructor(){
        this.playerNum = 0;
        this.ballNum = 0;
        this.team1 = new Team("Team 1");
        this.team2 = new Team("Team 2");
        this.game = document.createElement('div');
        this.hit1 = document.createElement('button');
        this.hit1.className = "btn btn-primary btn-sm rounded-0";
        this.hit1.innerHTML = `HIT 1`;
        this.hit1.setAttribute('id', 'hit1');
        this.hit2 = document.createElement('button');
        this.hit2.className = "btn btn-primary btn-sm rounded-0";
        this.hit2.innerHTML = `HIT 2`;
        this.hit2.setAttribute('id', 'hit2');
        this.hit2.disabled = true;
        this.generateRsult = document.createElement('button');
        this.generateRsult.className = "btn btn-primary btn-sm rounded-0";
        this.generateRsult.innerHTML = `Generate Results`;
        this.generateRsult.setAttribute('id', 'generateRsult');
        this.generateRsult.disabled = true;


        let body:HTMLBodyElement = document.querySelector('body');
        body.appendChild(this.game); 

        this.renderGame();
        this.startTimer();
        document.getElementById('hit1').addEventListener('click', (e)=>{this.handleHit(this.team1)});
        document.getElementById('hit2').addEventListener('click', (e)=>{this.handleHit(this.team2)});
        document.getElementById('generateRsult').addEventListener('click', (e)=>{
            let win = document.getElementById('win');
            let manofmatch = document.getElementById('manOfMatch');
            if(this.team1.totalScore > this.team2.totalScore){
                win.innerHTML = this.team1.name;
                let maxplayer = this.team1.findManOfMatch().name;
                manofmatch.innerHTML = maxplayer;
            }else{
                win.innerHTML = this.team2.name;
                let maxplayer = this.team2.findManOfMatch().name;
                manofmatch.innerHTML = maxplayer;
            }
        }); 
    }
    renderGame(){
        this.game.className = "container my-4 mx-auto";
        this.game.innerHTML = `<div class="text-center"><h6>CRICKET 10</h6></div><hr>
                               <div class="row mx-auto">
                                    <div class="col-4">
                                        <div class="row justify-content-center"><h5>Team1</h5></div>
                                        <div class="row justify-content-center"><p class="lead" id="team1Score">${this.team1.totalScore}</p></div>
                                        <div class="row justify-content-center"}>${this.hit1.outerHTML}</div> 
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center"><h5>Timer</h5></div>
                                        <div class="row justify-content-center"><h3 id="timer">60</h3></div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center"><h5>Team1</h5></div>
                                        <div class="row justify-content-center"><p class="lead" id="team2Score">${this.team2.totalScore}</p></div>
                                        <div class="row justify-content-center">${this.hit2.outerHTML}</div> 
                                    </div>
                               </div><hr>
                               <div class="text-center">${this.generateRsult.outerHTML}</div>
                               
                               <div class="row">
                                    <div class="col-lg-5" id="table1">${this.team1.table.outerHTML}</div>
                                    <div class="col-lg-2 text-center">
                                        Match won by <br><span id="win" class="badge badge-success"></span><br>
                                        Man of the Match <br><span id="manOfMatch" class="badge badge-success"></span>
                                    </div>
                                    <div class="col-lg-5" id="table2">${this.team2.table.outerHTML}</div>
                               </div>`;

        this.team1.renderTable();
        this.team2.renderTable();
        
    }

    handleHit(currteam:Team){
        let runs:number = Math.floor(Math.random()*7);
        let p:Player = currteam.players[this.playerNum];

        p.balls[this.ballNum] = runs;
        p.total += runs;
        currteam.renderTable();
        document.getElementById(`tbody${currteam.name[currteam.name.length-1]}`).innerHTML = currteam.tbody.innerHTML;
        currteam.findTotal();
        document.getElementById(`team${currteam.name[currteam.name.length-1]}Score`).innerHTML = String(currteam.totalScore);
        
        let hit1 = <HTMLButtonElement>document.getElementById('hit1');
        let hit2 = <HTMLButtonElement>document.getElementById('hit2');
        let getResultsBtn:HTMLButtonElement = <HTMLButtonElement>document.getElementById('generateRsult');
        
        this.team2.findTotal();
        if(this.team1.totalScore < this.team2.totalScore){
            hit1.disabled = true;
            hit2.disabled = true;
            clearInterval(this.timerInterval);
            getResultsBtn.disabled = false;
        }
        if(runs === 0 || this.ballNum === 5){
            this.ballNum = 0;
            this.playerNum++;
        }else{
            this.ballNum++;
        }
        if(this.playerNum === 10 ){
            
            hit1.disabled = true;
            hit2.disabled = !hit2.disabled;
            clearInterval(this.timerInterval);
            this.playerNum = 0;
            this.ballNum = 0;
            if(currteam.name === 'Team 1')
                this.startTimer();
            else{
                getResultsBtn.disabled = false;
            }
            
        }

    }

    startTimer(){
        let timer = document.getElementById('timer');
        timer.innerHTML = '60';
        this.timerInterval = setInterval(()=>{
            timer.innerText = String(parseInt(timer.innerText) - 1);
            let hit1 = <HTMLButtonElement>document.getElementById('hit1');
            let hit2 = <HTMLButtonElement>document.getElementById('hit2');
            
            if(timer.innerText === '0'){
                clearInterval(this.timerInterval);
                this.playerNum = 0;
                this.ballNum = 0;
                if(hit2.disabled === true){
                    this.startTimer();
                    hit2.disabled = false;
                    this.team1.findTotal();
                    document.getElementById('team1Score').innerText = String(this.team1.totalScore);
                }else{
                    this.team2.findTotal();
                    document.getElementById('team2Score').innerText = String(this.team2.totalScore);
                    hit2.disabled = true;
                    let getResultsBtn:HTMLButtonElement = <HTMLButtonElement>document.getElementById('generateRsult');
                    getResultsBtn.disabled = false;
                }
                hit1.disabled = true;
            }
        }, 1000);
    }

   
    

}

class Team {
    name:string;
    players: Array<Player>;
    totalScore: number;
    table:HTMLTableElement;
    tbody:HTMLElement;
    constructor(name:string){
        this.name = name;
        this.players = [];
        let balls:Array<number> = [-1, -1, -1, -1, -1, -1];
        this.totalScore = 0;
        let i:number;
        for(i=1; i<=10; i++){
            let newBalls = [...balls];
            let player:Player = new Player(newBalls, `Player ${i}`);
            this.players.push(player);
        }
        this.table = document.createElement('table');
        this.table.className = 'table table-bordered table-sm'
        this.table.innerHTML = `<caption style="caption-side:top; text-align:center;">${this.name} score board</caption>`;
        //this.table.setAttribute('id', 'table');
        this.tbody = document.createElement('tbody');
        this.tbody.setAttribute('id', `tbody${this.name[this.name.length-1]}`);
        this.table.appendChild(this.tbody);
        this.renderTable();
    }

    renderTable(){
        this.tbody.innerHTML = `<tr>
                                <td>${this.name}</td>
                                <td>B1</td>
                                <td>B2</td>
                                <td>B3</td>
                                <td>B4</td>
                                <td>B5</td>
                                <td>B6</td>
                                <td>Total</td>  
                            </tr>`

        this.players.forEach((player)=>{
            this.tbody.innerHTML += player.renderPlayer();
        });
        
    }

    findTotal(){
        this.totalScore = 0;
        this.players.forEach((p)=>{
            
            this.totalScore+=p.total;
            
        });

    }


    findManOfMatch(){
        let maxP:Player = this.players[0];

        this.players.forEach((p)=>{
            if(p.total > maxP.total){
                maxP = p;
            }
        });

        return maxP;
    }
}

class Player {
    balls:Array<number>;
    name: string;
    total:number;
    tRow:HTMLTableRowElement;
    constructor(balls:Array<number>, name:string) {
        this.total = 0;
        this.balls = balls;
        this.name = name;
        this.tRow = document.createElement('tr');
    }

    renderPlayer(){
        return `<td>${this.name}</td>
                            ${this.balls.map((scoreOnBall)=>{
                                if(scoreOnBall === -1)
                                    return `<td>&nbsp;</td>`
                                else
                                    return `<td>${scoreOnBall}</td>`
                            }).join('')}
                            ${this.total === 0 ? `<td>&nbsp;</td>` : `<td>${this.total}</td>`}  
                            `;

    }
}


new Game();