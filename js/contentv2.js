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
const link_backend = 'https://server-noi-tu.onrender.com'
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


//auto click replay
setTimeout(() => {
    location.reload();
}, 55000);

//add event
const addEvent = () => {

    //enter input text
    inputText.onkeydown = (e) => {
        if (e.key === 'Enter') {
            let arrCurrentWord = currentWord.innerText.split(' ')
            listWord.push({
                tuBatDau: arrCurrentWord[0],
                tuKetThuc: arrCurrentWord[1]
            })
            inputText.classList.remove('error')

            waitingTraLoi = true
            setTimeout(() => {
                if (!funcHandle.checkEndGame()) {
                    funcHandle.handleNhapTraLoi(arrCurrentWord[0], arrCurrentWord[1], 'addNew', 'Them 1: ')
                    waitingTraLoi = false
                    return
                }
                waitingTraLoi = false

                //xoa tu sai
                funcHandle.handleXoaTu(arrCurrentWord[0], arrCurrentWord[1])

                //xoa tu trich xuat
                funcHandle.handleNhapTraLoi(arrCurrentWord[0], arrCurrentWord[1], 'deleteTu', 'Xoa trich xuat: ')


            }, 1200);

        }
    }

    //auto trả lời
    setInterval(async () => {

        //reset game
        funcHandle.resetGame();

        let arrTextCurrent = currentWord.innerText.split(' ')
        // listWord.push({
        //     tuBatDau: arrTextCurrent[0],
        //     tuKetThuc: arrTextCurrent[1]
        // })

        //them tu
        funcHandle.handleNhapTraLoi(arrTextCurrent[0], arrTextCurrent[1], 'addNew', '')

        //get goi y
        // let newListWord = listWord.filter(item => item.tuBatDau === arrTextCurrent[1])
        //     .map(item => item.tuKetThuc)
        let data = await funcHandle.getGoiY(arrTextCurrent[1], [])

        //ko tim thay
        if (data.errCode === 1 && data?.mess === "not found" || data.errCode === -1) {
            console.log('không tim thay: ', data);
            funcHandle.handleThemTuDie(arrTextCurrent[0], arrTextCurrent[1])
            location.reload()
            inputText.classList.add('error')
            wordOld = ''
            return;
        }

        //tim thay
        inputText.value = data.dataTuDien && data.dataTuDien !== 'undefined' ? data.dataTuDien : data.data

        if (inputText.value === wordOld) {
            lapLai++
            if (lapLai >= 3) {
                lapLai = 0
                console.log('xoa tu: ', spanHead.innerText, wordOld);
                funcHandle.handleXoaTu(spanHead.innerText, wordOld)
                wordOld = ''
            }
        }
        else {
            lapLai = 0
        }

        wordOld = inputText.value
        inputText.focus();
        if (inputText.value === 'undefined') {
            console.log('data undefined ne', data);
            return
        }

        inputText.dispatchEvent(eventKeyBoard);

        if (data.type === 'die') {
            let check = false
            for (let i = 0; i < listWord.length - 1; i++) {
                let item = listWord[i]
                if (item.tuBatDau === spanHead.innerText && item.tuKetThuc === inputText.value) {
                    check = true
                }
            }

            if (check) return

            funcHandle.handleThemTuDie(arrTextCurrent[0], arrTextCurrent[1], "Update die: ")
        }

        if (data.type2 === 'tuDien') {
            console.log("Tu dien: ", data.data ?? data.dataTuDien);
        }


    }, 1000);


}
addEvent();

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

    static handleXoaTu = async (tuBatDau, tuKetThuc) => {
        let data = {
            tuBatDau,
            tuKetThuc
        }
        console.log('Xoa: ', data.tuBatDau, data.tuKetThuc);

        let response = await fetch(link_backend + '/xoa-tu', {
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

    static getGoiY = async (tuBatDau, listWord) => {
        let response = await fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + tuBatDau + '&listWord=' + listWord)
        let data = response.json();
        return data;
    }

    static handleThemTuDie = async (tuBatDau, tuKetThuc, mess) => {
        mess = mess ? mess : 'Them die: '
        if (mess === 'Them die: ')
            console.log(mess, tuBatDau, tuKetThuc);
        let data = {
            tuBatDau,
            tuKetThuc
        }

        let response = await fetch(link_backend + '/them-tu-die', {
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

    static resetGame = () => {
        if (idTimeoutReset)
            clearTimeout(idTimeoutReset)

        idTimeoutReset = setTimeout(() => {
            window.location.reload()
        }, 10000);
    }
}


/**
 * "label" = 'undefined'
 */
