"use strict";
var _a;
var Alert = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast'
    },
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 3000
});
var StatusGame;
(function (StatusGame) {
    StatusGame["progress"] = "EM_ANDAMENTO";
    StatusGame["win"] = "VITORIA";
    StatusGame["draw"] = "EMPATE";
})(StatusGame || (StatusGame = {}));
;
var currentPlayer = "X";
var board = Array(9).fill(null); //(string | null)[] works too
var endGame = false;
var statusGame = StatusGame.progress;
var scoreX = 0;
var scoreO = 0;
var playerX = {
    name: 'X',
    symbol: "X"
};
var playerO = {
    name: 'O',
    symbol: "O"
};
function updateScore() {
    var scoreboard = document.getElementById("score");
    if (scoreboard)
        scoreboard.textContent = "".concat(playerX.name, " - ").concat(scoreX, " | ").concat(playerO.name, " - ").concat(scoreO);
}
function resetGame() {
    var game = document.querySelector("#game");
    var selection = document.querySelector("#selection-players");
    if (game && selection) {
        game.style.display = 'block';
        selection.style.display = 'none';
    }
    else {
        Alert.fire({
            icon: "error",
            title: "Houve um erro com o dom"
        });
        return;
    }
    board.fill(null);
    endGame = false;
    statusGame = StatusGame.progress;
    document.querySelectorAll('.cel').forEach(function (item) { return item.textContent = ''; });
    updateScore();
}
function checkWinner() {
    var winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    var _loop_1 = function (comb) {
        var a = comb[0], b = comb[1], c = comb[2];
        var winner = '';
        if (board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]) {
            statusGame = StatusGame.win;
            endGame = true;
            switch (currentPlayer) {
                case "X":
                    winner = "".concat(playerX.name);
                    scoreX++;
                    break;
                case "O":
                    winner = "".concat(playerO.name);
                    scoreO++;
                    break;
                default:
                    Alert.fire({
                        icon: "error",
                        title: "Error, refreshing page ..."
                    });
                    location.reload();
            }
            setTimeout(function () {
                Alert.fire({
                    icon: "success",
                    title: "".concat(winner, " venceu!")
                });
                updateScore();
                resetGame();
            }, 200);
            return { value: void 0 };
        }
    };
    for (var _i = 0, winningCombinations_1 = winningCombinations; _i < winningCombinations_1.length; _i++) {
        var comb = winningCombinations_1[_i];
        var state_1 = _loop_1(comb);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    if (!board.includes(null)) {
        statusGame = StatusGame.draw;
        endGame = true;
        setTimeout(function () {
            Alert.fire({
                icon: "warning",
                title: "Empate!"
            });
            resetGame();
        }, 200);
    }
}
document.querySelectorAll('.cel').forEach(function (cel, idx) {
    cel.addEventListener("click", function () {
        if (!endGame && !board[idx]) {
            board[idx] = currentPlayer;
            cel.textContent = currentPlayer;
            checkWinner();
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    });
});
(_a = document.querySelector("#start-game")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (el) {
    var nameX = document.querySelector("input[name='nameX']");
    var nameO = document.querySelector("input[name='nameO']");
    var requiredName = function (input, player) {
        if (input && input.value.trim() === "") {
            Alert.fire({
                icon: "error",
                title: "Informe o jogador ".concat(player)
            });
            input.focus();
            input.classList.add('border-danger');
            setTimeout(function () {
                input.classList.remove('border-danger');
            }, 3000);
            return false;
        }
        return true;
    };
    if (!requiredName(nameX, 'X') || !requiredName(nameO, 'O'))
        return;
    //uso do '!' para acessar os valures de nameX e nameO pois após a validação sabemos que não são nulos
    playerX.name = nameX.value;
    playerO.name = nameO.value;
    resetGame();
});
