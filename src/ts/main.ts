//import Swal from 'sweetalert2'; I'm importing my dependencies into html
declare var Swal: any;

const Alert = Swal.mixin({
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

type Players = "X" | "O";
interface Player {
    name: string,
    symbol: Players
}

enum StatusGame {
    progress = "EM_ANDAMENTO",
    win = "VITORIA",
    draw = "EMPATE",
};

let currentPlayer:Players = "X";
let board:Array<Players | null> = Array(9).fill(null); //(string | null)[] works too
let endGame:boolean = false;

let statusGame:StatusGame = StatusGame.progress;
let scoreX:number = 0;
let scoreO:number = 0;

const playerX: Player = {
    name: 'X',
    symbol: "X"
};

const playerO: Player = {
    name: 'O',
    symbol: "O"
};


function updateScore(): void {
    let scoreboard:HTMLElement | null = document.getElementById("score");
    if (scoreboard) 
        scoreboard.textContent = `${playerX.name} - ${scoreX} | ${playerO.name} - ${scoreO}`;
}

function resetGame(): void {
    let game:HTMLElement | null = document.querySelector("#game"); 
    let selection:HTMLElement | null = document.querySelector("#selection-players");

    if (game && selection) {
        game.style.display = 'block';
        selection.style.display = 'none';
    } else {
        Alert.fire({
            icon: "error",
            title: "Houve um erro com o dom"
        });
        return;
    }

    board.fill(null);
    endGame = false;
    statusGame = StatusGame.progress;

    document.querySelectorAll('.cel').forEach(item => item.textContent = '');
    updateScore();
}

function checkWinner(): void {
    type tuplawin = [number, number, number];
    const winningCombinations:Array<tuplawin> = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const comb of winningCombinations) {
        const [a, b, c]:Array<number> = comb;
        let winner:string = '';

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            statusGame = StatusGame.win;
            endGame = true;

            switch(currentPlayer) {
                case "X":
                    winner = `${playerX.name}`;
                    scoreX++;
                    break;
                case "O":
                    winner = `${playerO.name}`;
                    scoreO++;
                    break;
                default:
                    Alert.fire({
                        icon: "error",
                        title: "Error, refreshing page ..."
                    });
                    location.reload();
            }

            setTimeout(() => {
                Alert.fire({
                    icon: "success",
                    title: `${winner} venceu!`
                });

                updateScore();
                resetGame();
            }, 200);

            return;
        }
    }

    if (!board.includes(null)) {
        statusGame = StatusGame.draw;
        endGame = true;
        setTimeout(() => {
            Alert.fire({
                icon: "warning",
                title: "Empate!"
            });
            resetGame();
        }, 200);
    }
}

document.querySelectorAll('.cel').forEach((cel, idx) => {
    cel.addEventListener("click", () => {
        if (!endGame && !board[idx]) {
            board[idx] = currentPlayer;
            cel.textContent = currentPlayer;
            checkWinner();
            currentPlayer = currentPlayer === "X"? "O" : "X";
        }
    })
});

document.querySelector("#start-game")?.addEventListener('click', (el) => {
    let nameX:HTMLInputElement | null = document.querySelector("input[name='nameX']");
    let nameO:HTMLInputElement | null = document.querySelector("input[name='nameO']");

    const requiredName = (input: HTMLInputElement | null, player: Players ): boolean => {
        if (input && input.value.trim() === "") {
            Alert.fire({
                icon: "error",
                title: `Informe o jogador ${player}`
            });
            
            input.focus();
            input.classList.add('border-danger');

            setTimeout(() => {
                input.classList.remove('border-danger');
            }, 3000);
            return false;
        }

        return true;
    }

    if (!requiredName(nameX, 'X') || !requiredName(nameO, 'O')) return;

    //uso do '!' para acessar os valures de nameX e nameO pois após a validação sabemos que não são nulos
    playerX.name = nameX!.value;
    playerO.name = nameO!.value;
    resetGame();
});
