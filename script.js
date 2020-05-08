let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

scores = {
    X: -1,
    O: 1,
    tie: 0
}

players = ['X', 'O'];

let cross = `<i class="fa fa-times" aria-hidden="true"></i>`;
let circle = `<i class="fa fa-circle-o" aria-hidden="true"></i>`;
let currentChar = '';
let gameStateRunning = true;
let winselector = '';
let opponent = '';

$(document).ready(function () {
    $('table').fadeIn(2000);
    currentChar = 'X';
    $("#message-box").html("It's player " + currentChar + "'s turn");

    $("input[name='opponent']").change(function() {
        opponent = $(this).val();
        restartGame();
    });

    $(".box").click(function () {
        if (gameStateRunning && !$(this).html()) {
            $("#btn-restart").prop('disabled', false);
            renderBoard($(this).attr('id'), currentChar);
            let boardId = $(this).attr('id');
            board[boardId[0]][boardId[1]] = currentChar;
            let winner = checkGameStatus(board);
            showResult(winner);

            if (gameStateRunning && opponent == 'ai') {
                playAI();
            }
        }
    });

    $("#btn-restart").click(function() {
        restartGame();
    });
});

function restartGame() {
    currentChar = 'X';
    $("#message-box").html("It's player X's turn");
        $("#message-box").html("It's player " + currentChar + "'s turn");
        $("#btn-restart").prop('disabled', true);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
                $("#" + i + j).html('');    
            }
        }
        gameStateRunning = true;
}

function showResult(winner) {
    if (winner == null) {
        changeCurrentChar();
    } else {
        if (winner == 'tie') {
            $("#message-box").html('Its a tie');
        } else {
            $("#message-box").html(winner + " has won")
            $(winselector).animate({backgroundColor: "rgb(127, 255, 0)"}, 800).delay().animate({backgroundColor: "#fff"}, 800);
        }
        gameStateRunning = false;
    }
}

function renderBoard(pos, player) {
    player == players[0] ? $("#" + pos).html(cross) : $("#" + pos).html(circle);;
}

function checkGameStatus(board) {
    let winner = null;
    let isTie = true;
    for (let i = 0; i < 3; i++) {
        if (board[i][0] == board[i][1] && board[i][0] == board[i][2] && board[i][0] != '') {
            winner = board[i][0];
            winselector = '#' + i + "0, #" + i + "1, #" + i + "2";
        }
    }

    for (let i = 0; i < 3; i++) {
        if (board[0][i] == board[1][i] && board[0][i] == board[2][i] && board[0][i] != '') {
            winner = board[0][i];
            winselector = "#0" + i + ", #1" + i + ", #2" + i;
        }
    }

    if (board[0][0] == board[1][1] && board[0][0] == board[2][2] && board[0][0] != '') {
        winner = board[0][0];
        winselector = "#00, #11, #22";
    }

    if (board[0][2] == board[1][1] && board[0][2] == board[2][0] && board[0][2] != '') {
        winner = board[0][2];
        winselector = "#02, #11, #20";
    }

    if (winner == null) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    isTie = false;
                    break;
                }
            }
            if (!isTie) {
                break;
            }
        }
        if (isTie) {
            winner = 'tie';
        }
    }
    return winner;
}

function changeCurrentChar() {
    currentChar = currentChar == 'X' ? 'O' : 'X';
    console.log(currentChar);
    $("#message-box").html("It's player " + currentChar + "'s turn");
}

function playAI() {
    let movePos;
    let bestScore = -Infinity;
    let isMoveDone = false;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = currentChar;
                let score = miniMax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    movePos = [i, j];
                }
            }
        }
    }
    board[movePos[0]][movePos[1]] = currentChar;
    renderBoard(movePos[0] + '' + movePos[1]);
    let winner = checkGameStatus(board);
    showResult(winner);
}

function miniMax(board, depth, maximizingPlayer) {
    let result = checkGameStatus(board);
    if (result != null) {
        return scores[result];
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = 'O';
                    let score = miniMax(board, depth + 1, false);
                    board[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = 'X';
                    let score = miniMax(board, depth + 1, true);
                    board[i][j] = '';
                    if (score < bestScore) {
                        bestScore = score;
                    }
                }
            }
        }
        return bestScore;
    }
}


