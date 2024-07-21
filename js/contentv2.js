//redirect
let url = window.location.hostname;
console.log(url);
if (url === 'shopee.vn') {
    window.location.href = "https://noitu.pro/solo";
}


let container = document.getElementsByClassName("container")[0]
let inputText = document.getElementById('text')
let spanHead = document.getElementById('head')
let currentWord = document.getElementById('currentWord')
let groupText = document.getElementById('group-text')
let btnMode
let formReplay
const eventKeyBoard = new KeyboardEvent('keydown', {
    key: 'Enter',
    keyCode: 13,
    char: '\n'
});
let listWord = []
const link_backend = 'https://server-noi-tu-online.onrender.com'
let typeWord = ''
let waitingTraLoi = false
let soLanThua = 0
let soLanChơi = 0
let idTimeoutReset
let wordOld = ''
let lapLai = 0

// inputText.classList.add('error')

//get form replay
const getFormReplay = () => {
    // Kiểm tra mỗi giây một lần
    let intervalId = setInterval(function () {
        formReplay = document.querySelector('.swal-overlay');
        if (formReplay) {
            clearInterval(intervalId);
        }
    }, 1000); // Kiểm tra mỗi giây

}
getFormReplay();


let idStart = setInterval(() => {
    let arrTextCurrent = currentWord.innerText.split(' ')

    if (arrTextCurrent.length === 2) {
        clearInterval(idStart)

        //auto click replay
        setTimeout(() => {
            location.reload();
        }, 55000);

        FuncAuto()
    }

}, 1000)



const config = { childList: true, subtree: true, characterData: true };
const callback = async function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {

            //tra loi
            FuncAuto()
        }
    }
};


// Tạo một observer instance liên kết với callback function
const observer = new MutationObserver(callback);
observer.observe(currentWord, config);


const FuncAuto = async () => {
    funcHandle.resetGame()

    let arrTextCurrent = currentWord.innerText.split(' ')

    let checkTuExit = await funcHandle.kiemTraTuTonTai(arrTextCurrent[0], arrTextCurrent[1])
    if (!checkTuExit) {
        console.log('Thêm từ', arrTextCurrent[0], arrTextCurrent[1]);
        await funcHandle.handleNhapTraLoi(arrTextCurrent[0], arrTextCurrent[1])
    }

    //get goi y

    let data = await funcHandle.getGoiY(arrTextCurrent[1], [])

    //ko tim thay
    if (data.errCode === 1 && data?.mess === "not found" || data.errCode === -1) {

        const response = await fetch(`https://noitu.pro/answer?word==${arrTextCurrent[0]} ${arrTextCurrent[1]}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.nextWord.head === arrTextCurrent[1]) {
                inputText.value = data.nextWord.tail
                funcHandle.handleNhapTraLoi(data.nextWord.head, data.nextWord.tail)
                let mode = window.localStorage.getItem('thoaiMode')
                if (mode === 'on') {
                    let timeTl = window.localStorage.getItem('ThoaiTime') ?? 0;
                    setTimeout(() => {
                        inputText.dispatchEvent(eventKeyBoard);
                    }, timeTl);
                }
            }
            else {
                inputText.classList.add('error')
            }
        }
        else {
            inputText.classList.add('error')
        }
        return
    }

    //tim thay
    inputText.value = data.dataTuDien && data.dataTuDien !== 'undefined' ? data.dataTuDien : data.data

    inputText.dispatchEvent(eventKeyBoard);

}

//init function
class funcHandle {
    static handleNhapTraLoi = async (tuBatDau, tuKetThuc, type, mess) => {
        mess = mess ? mess : 'Them: '
        let data = {
            tuBatDau,
            tuKetThuc,
            typeAdd: type
        }
        // console.log(mess, tuBatDau, tuKetThuc);
        let response = await fetch(link_backend + '/them-tra-loi', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });
        response = await response.json()
    }

    static checkEndGame = () => {
        if (!formReplay || !formReplay.classList.contains('swal-overlay--show-modal'))
            return false
        return true
    }

    static getGoiY = async (tuBatDau, listWord) => {
        let response = await fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + tuBatDau + '&listWord=' + listWord)
        let data = await response.json();
        return data;
    }

    static kiemTraTuTonTai = async (tuBatDau, tuKetThuc) => {
        let response = await fetch(link_backend + `/kiem-tra-tu-ton-tai?tuBatDau=${tuBatDau}&tuKetThuc=${tuKetThuc}`)
        let data = await response.json();
        if (data.errCode === 0 && data.isExit) {
            return true
        }
        return false;
    }



    static resetGame = () => {
        if (idTimeoutReset)
            clearTimeout(idTimeoutReset)

        idTimeoutReset = setTimeout(() => {
            window.location.reload()
        }, 10000);
    }
}
