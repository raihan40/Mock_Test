var Ques = [];
var correct = [];
var done = []
var count = -1;
var option_no = 0;
var question_no = 0;
var recent = -1;
var flag = 0;
var submit_flag = 0;
var option = [];
var select = []
const start = 15;
let time = start * 60 - 1;
let timer = 1000;

const myInterval = setInterval(updatecountdown, timer);


function updatecountdown() {
    let countdown = document.getElementById('countdown');
    let min_res = "",
        sec_res = "";
    document.getElementById('countdown').innerHTML = ""
        //console.log("time" + time)
    let min = Math.floor(time / 60);
    let sec = time % 60;
    // console.log("min =" + min.length)
    // console.log("sec =" + sec.length)
    min_res += min
    sec_res += sec
    if (min_res.length == 1) {
        min_res = "0" + min_res
    }
    if (sec_res.length == 1) {
        sec_res = "0" + sec_res
    }
    let x = min_res + ":" + sec_res
        // console.log(countdown)
    countdown.innerHTML = x;
    if (time > 0) {
        time--;
    } else {
        clearInterval(myInterval);
        submit();
    }
}

function loadxml() {
    let x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if (x.readyState == 4 && x.status == 200)
            process(x.responseXML);
    };

    x.open("GET", "data.xml", true);
    x.send();
}

function process(xdoc) {

    let total = xdoc.getElementsByTagName("items")[0].getElementsByTagName("item");
    for (let i = 0; i < total.length; i++) {

        Ques.push(total[i].querySelectorAll("question")[0].textContent);
        select[i] = [];
        select[i][0] = -1
        done[i] = 0
    }
    //console.log(Ques);
    question_no = xdoc.getElementsByTagName("question").length;
    option_no = xdoc.getElementsByTagName("answer").length / xdoc.getElementsByTagName("question").length;
    for (let i = 0; i < question_no; i++) {
        option[i] = []
        for (let j = 0; j < option_no; j++) {
            option[i][j] = total[i].querySelectorAll("answer")[j].textContent;
            if (total[i].querySelectorAll("answer")[j].getAttribute("correct") == "y") {
                correct.push(total[i].querySelectorAll("answer")[j].textContent);
            }
        }
    }

    document.getElementById("submit").disabled = true

    display();
}

function display() {
    count++;
    recent++;
    checker();
    document.getElementById("question").innerHTML = Ques[count]
    for (let i = 0; i < option_no; i++) {
        let s = "l" + (i + 1)
        document.getElementById(s).innerHTML = option[count][i]
    }
    radio_chcek();

}

function nextdisplay() {
    if (count < question_no - 1) {
        count++;
        radio_chcek()
        checker();
        recent++;
        fflush();
        reinitialize()
        document.getElementById("question").innerHTML = Ques[count]
        for (let i = 0; i < option_no; i++) {
            let s = "l" + (i + 1)
            document.getElementById(s).innerHTML = option[count][i]
        }
        if (submit_flag == 1) {
            document.getElementById("correct_ans").innerHTML = "Correct answer is " + correct[recent]
        }
    }

}


function prevdisplay() {


    if (count >= 1) {
        count--;
        radio_chcek();
        checker();
        recent--;
        fflush();
        reinitialize();

        document.getElementById("question").innerHTML = Ques[count]
        for (let i = 0; i < option_no; i++) {
            let s = "l" + (i + 1)
            document.getElementById(s).innerHTML = option[count][i]
        }
        if (submit_flag == 1) {
            document.getElementById("correct_ans").innerHTML = "Correct answer is " + correct[recent]
        }
    }

}

function checker() {
    if (flag == 1) {
        document.getElementById("submit").disabled = true;
    }
    if (count == 0) {
        document.getElementById("prev").disabled = true;
        document.getElementById("submit").disabled = true;
    } else {
        document.getElementById("prev").disabled = false;
        document.getElementById("submit").disabled = true;
    }
    if (count == question_no - 1) {
        document.getElementById("next").disabled = true
        if (flag == 0) {
            document.getElementById("submit").disabled = false
        }
    } else {
        document.getElementById("next").disabled = false
        document.getElementById("submit").disabled = true;
    }

}

function radio_chcek() {
    for (let i = 0; i < option_no; i++) {
        let s = "option" + (i + 1);
        if (document.getElementById(s).checked) {
            done[recent] = 1
            select[recent][0] = i;
        }
    }
}

function fflush() {
    if (done[recent] == 0) {
        for (let i = 0; i < option_no; i++) {
            let s = "option" + (i + 1);
            document.getElementById(s).checked = false;

        }

    }
}

function submit() {
    flag = 1;
    submit_flag = 1;
    clearInterval(myInterval);
    document.getElementById("correct_ans").innerHTML = "Correct answer is " + correct[recent]
    document.getElementById("submit").disabled = true;
    let score = 0,
        fm = 0;
    for (let i = 0; i < option_no; i++) {
        let s = "option" + (i + 1);
        if (document.getElementById(s).checked) {
            select[recent][0] = i;
        }
    }
    //console.log(select)
    for (let i = 0; i < correct.length; i++) {
        if (correct[i] == option[i][select[i][0]]) {
            score++;
        }
        fm++;
    }

    document.getElementById("result").innerHTML = "You Scored " + score + " out of " + fm;
    for (let i = 0; i < option_no; i++) {
        let s = "option" + (i + 1);
        document.getElementById(s).disabled = true

    }
}

function reinitialize() {

    if (select[recent][0] != -1) {
        let s = "option" + (select[recent][0] + 1);
        document.getElementById(s).checked = true;
    }
}