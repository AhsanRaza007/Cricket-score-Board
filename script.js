var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.playerNum = 0;
        this.ballNum = 0;
        this.team1 = new Team("Team 1");
        this.team2 = new Team("Team 2");
        this.game = document.createElement('div');
        this.hit1 = document.createElement('button');
        this.hit1.className = "btn btn-primary btn-sm rounded-0";
        this.hit1.innerHTML = "HIT 1";
        this.hit1.setAttribute('id', 'hit1');
        this.hit2 = document.createElement('button');
        this.hit2.className = "btn btn-primary btn-sm rounded-0";
        this.hit2.innerHTML = "HIT 2";
        this.hit2.setAttribute('id', 'hit2');
        this.hit2.disabled = true;
        this.generateRsult = document.createElement('button');
        this.generateRsult.className = "btn btn-primary btn-sm rounded-0";
        this.generateRsult.innerHTML = "Generate Results";
        this.generateRsult.setAttribute('id', 'generateRsult');
        this.generateRsult.disabled = true;
        var body = document.querySelector('body');
        body.appendChild(this.game);
        this.renderGame();
        this.startTimer();
        document.getElementById('hit1').addEventListener('click', function (e) { _this.handleHit(_this.team1); });
        document.getElementById('hit2').addEventListener('click', function (e) { _this.handleHit(_this.team2); });
        document.getElementById('generateRsult').addEventListener('click', function (e) {
            var win = document.getElementById('win');
            var manofmatch = document.getElementById('manOfMatch');
            if (_this.team1.totalScore > _this.team2.totalScore) {
                win.innerHTML = _this.team1.name;
                var maxplayer = _this.team1.findManOfMatch().name;
                manofmatch.innerHTML = maxplayer;
            }
            else {
                win.innerHTML = _this.team2.name;
                var maxplayer = _this.team2.findManOfMatch().name;
                manofmatch.innerHTML = maxplayer;
            }
        });
    }
    Game.prototype.renderGame = function () {
        this.game.className = "container my-4 mx-auto";
        this.game.innerHTML = "<div class=\"text-center\"><h6>CRICKET 10</h6></div><hr>\n                               <div class=\"row mx-auto\">\n                                    <div class=\"col-4\">\n                                        <div class=\"row justify-content-center\"><h5>Team1</h5></div>\n                                        <div class=\"row justify-content-center\"><p class=\"lead\" id=\"team1Score\">" + this.team1.totalScore + "</p></div>\n                                        <div class=\"row justify-content-center\"}>" + this.hit1.outerHTML + "</div> \n                                    </div>\n                                    <div class=\"col-4\">\n                                        <div class=\"row justify-content-center\"><h5>Timer</h5></div>\n                                        <div class=\"row justify-content-center\"><h3 id=\"timer\">60</h3></div>\n                                    </div>\n                                    <div class=\"col-4\">\n                                        <div class=\"row justify-content-center\"><h5>Team1</h5></div>\n                                        <div class=\"row justify-content-center\"><p class=\"lead\" id=\"team2Score\">" + this.team2.totalScore + "</p></div>\n                                        <div class=\"row justify-content-center\">" + this.hit2.outerHTML + "</div> \n                                    </div>\n                               </div><hr>\n                               <div class=\"text-center\">" + this.generateRsult.outerHTML + "</div>\n                               \n                               <div class=\"row\">\n                                    <div class=\"col-lg-5\" id=\"table1\">" + this.team1.table.outerHTML + "</div>\n                                    <div class=\"col-lg-2 text-center\">\n                                        Match won by <br><span id=\"win\" class=\"badge badge-success\"></span><br>\n                                        Man of the Match <br><span id=\"manOfMatch\" class=\"badge badge-success\"></span>\n                                    </div>\n                                    <div class=\"col-lg-5\" id=\"table2\">" + this.team2.table.outerHTML + "</div>\n                               </div>";
        this.team1.renderTable();
        this.team2.renderTable();
    };
    Game.prototype.handleHit = function (currteam) {
        var runs = Math.floor(Math.random() * 7);
        var p = currteam.players[this.playerNum];
        p.balls[this.ballNum] = runs;
        p.total += runs;
        currteam.renderTable();
        document.getElementById("tbody" + currteam.name[currteam.name.length - 1]).innerHTML = currteam.tbody.innerHTML;
        currteam.findTotal();
        document.getElementById("team" + currteam.name[currteam.name.length - 1] + "Score").innerHTML = String(currteam.totalScore);
        var hit1 = document.getElementById('hit1');
        var hit2 = document.getElementById('hit2');
        var getResultsBtn = document.getElementById('generateRsult');
        this.team2.findTotal();
        if (this.team1.totalScore < this.team2.totalScore) {
            hit1.disabled = true;
            hit2.disabled = true;
            clearInterval(this.timerInterval);
            getResultsBtn.disabled = false;
        }
        if (runs === 0 || this.ballNum === 5) {
            this.ballNum = 0;
            this.playerNum++;
        }
        else {
            this.ballNum++;
        }
        if (this.playerNum === 10) {
            hit1.disabled = true;
            hit2.disabled = !hit2.disabled;
            clearInterval(this.timerInterval);
            this.playerNum = 0;
            this.ballNum = 0;
            if (currteam.name === 'Team 1')
                this.startTimer();
            else {
                getResultsBtn.disabled = false;
            }
        }
    };
    Game.prototype.startTimer = function () {
        var _this = this;
        var timer = document.getElementById('timer');
        timer.innerHTML = '60';
        this.timerInterval = setInterval(function () {
            timer.innerText = String(parseInt(timer.innerText) - 1);
            var hit1 = document.getElementById('hit1');
            var hit2 = document.getElementById('hit2');
            if (timer.innerText === '0') {
                clearInterval(_this.timerInterval);
                _this.playerNum = 0;
                _this.ballNum = 0;
                if (hit2.disabled === true) {
                    _this.startTimer();
                    hit2.disabled = false;
                    _this.team1.findTotal();
                    document.getElementById('team1Score').innerText = String(_this.team1.totalScore);
                }
                else {
                    _this.team2.findTotal();
                    document.getElementById('team2Score').innerText = String(_this.team2.totalScore);
                    hit2.disabled = true;
                    var getResultsBtn = document.getElementById('generateRsult');
                    getResultsBtn.disabled = false;
                }
                hit1.disabled = true;
            }
        }, 1000);
    };
    return Game;
}());
var Team = /** @class */ (function () {
    function Team(name) {
        this.name = name;
        this.players = [];
        var balls = [-1, -1, -1, -1, -1, -1];
        this.totalScore = 0;
        var i;
        for (i = 1; i <= 10; i++) {
            var newBalls = __spreadArrays(balls);
            var player = new Player(newBalls, "Player " + i);
            this.players.push(player);
        }
        this.table = document.createElement('table');
        this.table.className = 'table table-bordered table-sm';
        this.table.innerHTML = "<caption style=\"caption-side:top; text-align:center;\">" + this.name + " score board</caption>";
        //this.table.setAttribute('id', 'table');
        this.tbody = document.createElement('tbody');
        this.tbody.setAttribute('id', "tbody" + this.name[this.name.length - 1]);
        this.table.appendChild(this.tbody);
        this.renderTable();
    }
    Team.prototype.renderTable = function () {
        var _this = this;
        this.tbody.innerHTML = "<tr>\n                                <td>" + this.name + "</td>\n                                <td>B1</td>\n                                <td>B2</td>\n                                <td>B3</td>\n                                <td>B4</td>\n                                <td>B5</td>\n                                <td>B6</td>\n                                <td>Total</td>  \n                            </tr>";
        this.players.forEach(function (player) {
            _this.tbody.innerHTML += player.renderPlayer();
        });
    };
    Team.prototype.findTotal = function () {
        var _this = this;
        this.totalScore = 0;
        this.players.forEach(function (p) {
            _this.totalScore += p.total;
        });
    };
    Team.prototype.findManOfMatch = function () {
        var maxP = this.players[0];
        this.players.forEach(function (p) {
            if (p.total > maxP.total) {
                maxP = p;
            }
        });
        return maxP;
    };
    return Team;
}());
var Player = /** @class */ (function () {
    function Player(balls, name) {
        this.total = 0;
        this.balls = balls;
        this.name = name;
        this.tRow = document.createElement('tr');
    }
    Player.prototype.renderPlayer = function () {
        return "<td>" + this.name + "</td>\n                            " + this.balls.map(function (scoreOnBall) {
            if (scoreOnBall === -1)
                return "<td>&nbsp;</td>";
            else
                return "<td>" + scoreOnBall + "</td>";
        }).join('') + "\n                            " + (this.total === 0 ? "<td>&nbsp;</td>" : "<td>" + this.total + "</td>") + "  \n                            ";
    };
    return Player;
}());
new Game();
