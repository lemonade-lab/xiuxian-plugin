import plugin from '../../../../lib/plugins/plugin.js'
import puppeteer from "../../../../lib/puppeteer/puppeteer.js"
import data from '../../model/XiuxianData.js'
import Show from "../../model/show.js"
import path from "path"
import fs from "fs"
import { segment } from "oicq"
import { __PATH } from "../Xiuxian/xiuxian.js"

let sudokukey = false;
let board; //全局棋局
let constboard;//棋局的初始值,这里面的数字不能改

/**
 * 棋局模块
 */
export class SudokuGame extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'SudokuGame',
            /** 功能描述 */
            dsc: '棋局模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#开启棋局$',
                    fnc: 'CreateSudoku'
                },
                {
                    reg: '^###.*.*.*$',
                    fnc: 'setnumber'
                },
                {
                    reg: '^#检查棋局$',
                    fnc: 'CheckSudoku'
                },
                {
                    reg: '^#关闭棋局$',
                    fnc: 'ifCloseSudoku'
                },
                {
                    reg: '^#当前棋局$',
                    fnc: 'nowSudoku'
                },
            ]
        })
    }


    async CreateSudoku(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
         //获取游戏状态
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
         //防止继续其他娱乐行为
        if (game_action == 0) {
             e.reply("修仙：游戏进行中...");
             return;
        }
        if (sudokukey) {
            await e.reply(`当前已经有棋局存在,先解决它吧`);
            return;
        }
        /** 设置上下文 */
        this.setContext('Getsudokuboard');
        /** 回复 */
        await e.reply('请发送【简单】【中等】【困难】选择生成棋局的难度', false, { at: true });
    }


    async Getsudokuboard(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        var reg = new RegExp(/简单|中等|困难/);
        let new_msg = this.e.msg;
        let difficulty = reg.exec(new_msg);
        if (difficulty == undefined || difficulty == null) {
            this.setContext('Getsudokuboard');
            await e.reply('请发送【简单】【中等】【困难】选择生成棋局的难度', false, { at: true });
            return;
        }
        /** 结束上下文 */
        this.finish('Getsudokuboard');
        let num = 30;
        switch (difficulty[0]) {
            case "简单":
                num = 30;
                break;
            case "中等":
                num = 40;
                break;
            case "困难":
                num = 50;
                break;
        }
        let start = Date.now();
        board = await new_sudoku();
        board = wadong(board, num);
        sudokukey = true;
        constboard = new Array();
        for (let i = 0; i < 9; i++) {
            constboard[i] = new Array()
            for (let j = 0; j < 9; j++) {
                constboard[i][j] = board[i][j]
            }
        }
        e.reply(
            `棋局玩法: 填数1~9,使每行每列及9个九宫格的数字不重复` + "\n" +
            `填入数字: ###234` + "\n" +
            `即第2行第3列要填4` + "\n" +
            `清除数字: ###230` + "\n" +
            `将第2行第3列清除`
        );
        show_sudoku(e);
        //获取时间
        let now = new Date();
        let nowTime = now.getTime(); //获取当前日期的时间戳
        let nowlog = {
            time: timestampToTime(nowTime),
            difficulty: difficulty[0],
            participants: []
        }
        let dir = path.join(`${__PATH.log_path}/sudoku.json`);
        let logARR = JSON.stringify(nowlog, "", "\t");
        fs.writeFileSync(dir, logARR, 'utf8');
        let end = Date.now();
        console.log('挖洞时间', end - start, 'ms');
        return;
    }


    async setnumber(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }

        if (board == undefined || board == null) {
            e.reply(`棋局尚未开启`);
            return;
        }
        var reg = new RegExp(/\d/g);
        let new_msg = e.msg;

        //创建一个数组用于保存获取的数字
        let num = [];
        let a = reg.exec(new_msg);
        while (a != null) {
            num.push(parseInt(a[0]))
            a = reg.exec(new_msg);
        };
        if (num.length != 3 || num[0] > 9 || num[0] < 0 || num[1] > 9 || num[1] < 0 || num[2] > 9 || num[2] < 0) {
            e.reply(`表达错误,正确例子:###526`);
            return;
        }
        if (num[0] > 9) {
            e.reply(`表达错误,正确例子:###526`);
            return;
        }
        e.reply("获取命令:" + `行${num[0]}列${num[1]}填${num[2]}`);

        let i = num[0] - 1;
        let j = num[1] - 1;
        if (constboard[i][j] != 0) {
            e.reply(`该位置是初始位置,无法更改: 行${num[0]}列${num[1]}`);
            return;
        }
        board[i][j] = num[2];
        show_sudoku(e);
        let dir = path.join(`${__PATH.log_path}/sudoku.json`);
        let logfile = fs.readFileSync(dir, 'utf8');
        logfile = JSON.parse(logfile);
        if (!logfile.participants.some(item => item == e.user_id)) {
            logfile.participants.push(e.user_id)
        }
        let logARR = JSON.stringify(logfile, "", "\t");
        fs.writeFileSync(dir, logARR, 'utf8');
        return;
    }


    async CheckSudoku(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        if (board == undefined || board == null) {
            e.reply(`棋局尚未开启`);
            return;
        }
        //检查是否完成
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    e.reply(`棋局尚未完成,请填写全部数字后再检查`);
                    return;
                }
            }
        }
        //检查有无冲突,错误
        let check = isValidSudoku(board);
        if (!check) {
            e.reply(`棋局存在错误`);
            return;
        }

        e.reply(`恭喜,棋局完成!`);
        board = null;
        sudokukey = false;
        reward(e)
        return;
    }


    async ifCloseSudoku(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        if (board == undefined || board == null) {
            e.reply(`棋局尚未开启`);
            return;
        }
        /** 设置上下文 */
        this.setContext('CloseSudoku');
        /** 回复 */
        await e.reply('关闭棋局后棋局数据将被清空,回复:【关闭】,将继续关闭,', false, { at: true });
        return;
    }


    async CloseSudoku(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        if (this.e.msg == "关闭") {
            e.reply(`棋局已经关闭`);
            board = null;
            sudokukey = false;
        }
        else {
            e.reply(`棋局关闭取消`);
        }
        /** 结束上下文 */
        this.finish('CloseSudoku');
        return;
    }


    async nowSudoku(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        if (board == undefined || board == null) {
            e.reply(`棋局尚未开启`);
            return;
        }
        show_sudoku(e);
        return;
    }
    ////
}


class Sudoku {

    constructor() {
        this.digits = this.blankMatrix(9);
    }

    blankMatrix(size) {
        let newMatrix = [];
        for (let i = 0; i < size; i++) {
            newMatrix.push([]);
        }
        return newMatrix;
    }

    makeDigits() {
        let colLists = this.blankMatrix(9);
        let areaLists = this.blankMatrix(3);
        let nine = this.randNine();
        let i = 0,
            j = 0,
            areaIndex = 0,
            count = 0,
            error = false,
            first = 0;
        for (i = 0; i < 9; i++) {
            colLists[i].push(nine[i]);
        }
        areaLists[0] = nine.slice(0, 3);
        areaLists[1] = nine.slice(3, 6);
        areaLists[2] = nine.slice(6);

        for (i = 0; i < 8; i++) {
            nine = this.randNine();
            if (i % 3 == 2) {
                areaLists = this.blankMatrix(3);
            }

            for (j = 0; j < 9; j++) {
                areaIndex = Math.floor(j / 3);
                count = 0;
                error = false;
                while (colLists[j].includes(nine[0]) || areaLists[areaIndex].includes(nine[0])) {
                    if (++count >= nine.length) {
                        error = true;
                        break;
                    }
                    nine.push(nine.shift());
                }
                if (error) return false;
                first = nine.shift();
                colLists[j].push(first);
                areaLists[areaIndex].push(first);
            }
        }
        this.digits = colLists;
        return true;
    }

    randNine() {
        let nine = this.nine();
        let index = 0;

        for (let i = 0; i < 5; i++) {
            index = this.randIndex();
            [nine[0], nine[index]] = [nine[index], nine[0]];
        }

        return nine;
    }

    nine() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    randIndex() {
        return Math.floor(Math.random() * 9);
    }
}


//建立新的棋局
async function new_sudoku() {
    let sudoku = new Sudoku();
    let start = Date.now();
    while (!sudoku.makeDigits());
    let end = Date.now();
    console.log('生成时间', end - start, 'ms');
    let ifvalid = isValidSudoku(sudoku.digits);
    console.log("If this sudoku is valid :", ifvalid);
    return sudoku.digits;
}


//判断棋局是否正确
function isValidSudoku(board) {
    let flag = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            for (let z = j + 1; z < 9; z++) {
                if (board[i][j] != 0 && board[i][j] === board[i][z]) {     //判断行是否满足规则
                    flag = 1;
                    return false;
                }
                if (board[j][i] != 0 && board[j][i] === board[z][i]) {      //判断列是否满足规则
                    flag = 1;
                    return false;
                }

            }
        }
    }


    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let nums = [];
            for (let a = row; a < row + 3; a++) {
                for (let b = col; b < col + 3; b++) {
                    if (board[a][b] != 0) {
                        nums.push(board[a][b]);        //将小方格中有效数据放入一个数组
                    }
                }
            }
            for (let x = 0; x < nums.length; x++) {           //判断小方格是否满足规则
                for (let y = x + 1; y < nums.length; y++) {
                    if (nums[x] === nums[y]) {
                        flag = 1;
                        return false;
                    }
                }
            }
        }
    }

    if (flag === 0) {
        return true;    //全部符合规则，输出正确
    }
};


//解棋局方法(递归法)
function solveSudoku(board_solve) {
    //判断是否冲突
    let hasConflict = (r, c, val) => {
        for (let i = 0; i < 9; i++) {//判断行列是否有冲突
            if (board_solve[i][c] == val || board_solve[r][i] == val) {
                return true
            }
        }
        let subRowStart = Math.floor(r / 3) * 3 //该点对应小框中行的起始索引
        let subColStart = Math.floor(c / 3) * 3 //该点对应小框中列的起始索引
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board_solve[subRowStart + i][subColStart + j] == val) { //判断它所在小框是否重复
                    return true
                }
            }
        }
        return false
    }
    //递归函数
    let fill = (i, j) => {
        if (j == 9) { //换行
            i++
            j = 0;
            if (i == 9) {
                return true
            }
        }
        if (board_solve[i][j] != 0) { //如果不为空,执行下一个
            return fill(i, j + 1)
        }
        for (let num = 1; num <= 9; num++) { //开始填入数字
            if (hasConflict(i, j, num)) { //冲突
                continue
            }
            board_solve[i][j] = num;//如果不冲突,填入该数字
            if (fill(i, j + 1)) {
                return true
            }
            board_solve[i][j] = 0 //否则清空
        }
        return false
    }
    if (!fill(0, 0)) {//无解返回false
        return false;
    }
    return board_solve
}



//挖洞法
function wadong(board, num) {
    let cnt = 0;
    //递归函数
    let eliminate = (cnt) => {
        if (cnt == num) {
            return true
        }
        let i, j;
        i = Math.floor(Math.random() * 9);
        j = Math.floor(Math.random() * 9);
        if (board[i][j] == 0) { //如果为空,执行下一个
            return eliminate(cnt);
        }
        board[i][j] = 0; //清空
        return eliminate(cnt + 1);
    }
    eliminate(cnt);
    let temp = new Array()
    for (let i = 0; i < 9; i++) {
        temp[i] = new Array()
        for (let j = 0; j < 9; j++) {
            temp[i][j] = board[i][j]
        }
    }
    let solve = solveSudoku(temp);//直接操作二维数组board会污染变量,循环赋值之后操作temp
    if (solve == false) {
        this.wadong(board, num);
    }
    return board
}


async function show_sudoku(e) {
    let msg = await get_sudoku_img(e);
    e.reply(msg);
    return;
}


/**
 * 返回图片
 * @return image
 */
async function get_sudoku_img(e) {
    let temp = new Array()
    for (let i = 0; i < 9; i++) {
        temp[i] = new Array()
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                temp[i][j] = " ";
            }
            else {
                temp[i][j] = String(board[i][j]);
            }
        }
    }
    let sudokudata = {
        "temp": constboard,
        "board":board
    }
    const data1 = await new Show(e).get_sudokuData(sudokudata);
    let img = await puppeteer.screenshot("sudoku", {
        ...data1,
    });
    return img;

}



async function reward(e) {
    let dir = path.join(`${__PATH.log_path}/sudoku.json`);
    let logfile = fs.readFileSync(dir, 'utf8');
    logfile = JSON.parse(logfile);
    let lingshi = 0;
    switch (logfile.difficulty) {
        case "简单":
            lingshi = 1000;
            break;
        case "中等":
            lingshi = 2000;
            break;
        case "困难":
            lingshi = 3000;
            break;
    }
    let allqq = logfile.participants;
    for (let i in allqq) {
        let ifexistplay = await data.existData("player", allqq[i]);
        if (!ifexistplay) { continue; }
        let player_data = await data.getData("player", allqq[i]);
        player_data.灵石 += lingshi;
        await data.setData("player", allqq[i], player_data);
        e.reply([segment.at(allqq[i]), ` 你参与完成了${logfile.difficulty}级棋局,获得${lingshi}灵石`])
    }
    return;
}

// 时间转换
export function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}
