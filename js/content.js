// alert("hello noi tu")

const link_backend = 'https://server-noi-tu.onrender.com'
// const link_backend = 'http://localhost:4000'
let listWord = []
let typeWord = ''
let waiting = false

let spanRef = document.getElementById('currentWord')

let container = document.getElementsByClassName("container")[0]

let groupText = document.getElementById('group-text')
let inputText = document.getElementById('text')
let spanHead = document.getElementById('head')
let currentWord = document.getElementById('currentWord')

let btnIconThemTuDie = document.createElement('div')
btnIconThemTuDie.innerText = "+ thêm từ die"
btnIconThemTuDie.classList.add('btnIconThemTuDie')




let idTimeout

window.addEventListener('beforeunload', function (event) {
    // Thêm mã xử lý của bạn ở đây
    // Sự kiện này sẽ được kích hoạt trước khi người dùng rời khỏi trang web
    // Bạn có thể trả về một chuỗi để hiển thị một thông báo cảnh báo trước khi rời khỏi trang web
    var confirmationMessage = 'Bạn có chắc chắn muốn rời khỏi trang này?';
    (event || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
});

let countWaiting = 0
setInterval(() => {
    let wrapBtnChoiLai = document.querySelector('.swal-overlay.swal-overlay--show-modal')
    let btnChoiLai = document.querySelector('button.swal-button.swal-button--confirm')
    let nameBtnChoiLai = document.querySelector('.swal-text')
    if (!btnChoiLai || !wrapBtnChoiLai || !nameBtnChoiLai || waiting) {
        if (waiting) countWaiting++
        if (countWaiting === 2) {
            countWaiting = 0;
            waiting = false
        }
        return
    }
    btnChoiLai.addEventListener('click', () => {
        // console.log('Từ cuối: ', listWord[listWord.length - 1]);
        listWord = []
        typeWord = ''

        // location.reload()
    })
    btnChoiLai.click()

}, 1000);

let data_tl = null

inputText.onkeydown = (event) => {
    if (event.key === 'Enter' && inputText.innerText) {
        listWord.push({
            tuBatDau: currentWord.innerText.split(' ')[0],
            tuKetThuc: currentWord.innerText.split(' ')[1]
        })
        if (data_tl !== null) {
            handleNhapTraLoi(data_tl.tuBatDau, data_tl.tuKetThuc, 'TL die: ')
            data_tl = null
        }
        else {
            setTimeout(() => {
                let wrapKetThuc = document.querySelector('.swal-overlay.swal-overlay--show-modal')
                waiting = false
                if (wrapKetThuc)
                    handleXoaTu()

            }, 1200);
        }

        inputText.style.backgroundColor = '#fff'

    }
}



btnIconThemTuDie.onclick = async () => {
    let arrTextCurrent = currentWord.innerText.split(' ')
    handleThemTuDie(arrTextCurrent[0], arrTextCurrent[1])
    currentWord.style.color = 'red'

    setTimeout(() => {
        currentWord.style.color = '#fff'
    }, 1000);


}
document.getElementsByClassName("jtextfill")[0].appendChild(btnIconThemTuDie)

let btnIconThemTutraloi = document.createElement('div')
btnIconThemTutraloi.innerText = "+ thêm từ mới"
btnIconThemTutraloi.classList.add('btnIconThemTutraloi')
btnIconThemTutraloi.onclick = async () => {
    let arrvalue = currentWord.innerText.split(' ')

    let data = {
        tuBatDau: arrvalue[0],
        tuKetThuc: arrvalue[1]
    }

    handleNhapTraLoi(data.tuBatDau, data.tuKetThuc)
    currentWord.style.color = 'green'

    setTimeout(() => {
        currentWord.style.color = '#fff'
    }, 1000);
}

document.getElementsByClassName("jtextfill")[0].appendChild(btnIconThemTutraloi)



const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === spanHead) {
            if (groupText.style.display !== 'none') {
                //thêm từ thường
                let arrTextCurrent = currentWord.innerText.split(' ')

                let data = {
                    tuBatDau: arrTextCurrent[0],
                    tuKetThuc: arrTextCurrent[1]
                }

                fetch(link_backend + '/them-tu-thuong', {
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
                }).then(response => {
                    return response.json();
                })
                    .then(data => {
                        // console.log('KQ them: ', data.mess);
                    })

                // headTextOld = spanHead.innerText
                if (typeWord === 'die') {
                    console.log("TL die: ", currentWord.innerText.split(' ')[0],
                        currentWord.innerText.split(' ')[1]);
                    handleNhapTraLoi(currentWord.innerText.split(' ')[0],
                        currentWord.innerText.split(' ')[1]);
                }

                //tìm
                listWord.push({
                    tuBatDau: currentWord.innerText.split(' ')[0],
                    tuKetThuc: currentWord.innerText.split(' ')[1]
                })
                let newListWord = listWord.filter(item => item.tuBatDau === spanHead.innerText)
                    .map(item => item.tuKetThuc)
                fetch(link_backend + '/tim-tu-goi-y?tuBatDau=' + spanHead.innerText + '&listWord=' + newListWord)
                    .then(response => {
                        return response.json();
                    }).then(data => {
                        const eventKeyBoard = new KeyboardEvent('keydown', {
                            key: 'Enter', // Mã ASCII cho phím enter
                            keyCode: 13,
                            char: '\n' // Ký tự tương ứng với phím enter
                        });



                        if (data.errCode === 0) {
                            inputText.value = data.data
                            inputText.focus();
                            typeWord = data.type

                            if (data.type === 'normal') {
                                inputText.style.backgroundColor = "green"
                                inputText.dispatchEvent(eventKeyBoard);

                            }
                            else if (data.type === 'warning') {
                                inputText.style.backgroundColor = "yellow"
                                if (data.dataTuDien) {
                                    ipKetThuc_themTuTraLoi.focus()
                                    ipKetThuc_themTuTraLoi.value = data.dataTuDien
                                    ipKetThuc_themTuTraLoi.dispatchEvent(eventKeyBoard)
                                }
                                inputText.dispatchEvent(eventKeyBoard);
                            }
                            else {
                                inputText.style.backgroundColor = "red"

                                handleThemTuDie(spanHead.innerText, data.data, "Update die: ")
                                inputText.dispatchEvent(eventKeyBoard);
                            }


                        }
                        else if (data.errCode === 1 && data?.type === "tuDien") {
                            ipKetThuc_themTuTraLoi.focus()
                            ipKetThuc_themTuTraLoi.value = data.data
                            inputText.style.backgroundColor = "#fff"

                            ipKetThuc_themTuTraLoi.dispatchEvent(eventKeyBoard)
                            inputText.dispatchEvent(eventKeyBoard);
                        }
                        else {
                            ipKetThuc_themTuTraLoi.focus()
                            inputText.style.backgroundColor = "#fff"
                            handleThemTuDie(currentWord.innerText.split(' ')[0],
                                currentWord.innerText.split(' ')[1])

                        }
                    })
            }

        }
    });
});

observer.observe(spanHead, { childList: true });


let modeNoiTuContainer = document.createElement('div')
modeNoiTuContainer.classList.add("modeNoiTuContainer")


//title them tu tra loi
let titleThemTuTraLoi = document.createElement('div')
titleThemTuTraLoi.classList.add("titleThemTuTraLoi")
titleThemTuTraLoi.innerText = "Thêm từ trả lời"

//wrap them tu tra loi
let wrapThemTuTraLoi = document.createElement('div')
wrapThemTuTraLoi.classList.add("wrapThemTuTraLoi")

let ipKetThuc_themTuTraLoi = document.createElement('input')
ipKetThuc_themTuTraLoi.classList.add("ipKetThuc_themTuTraLoi")
ipKetThuc_themTuTraLoi.placeholder = "Từ kết thúc"

ipKetThuc_themTuTraLoi.onkeydown = (event) => {
    if (event.key === 'Enter' && ipKetThuc_themTuTraLoi.value) {
        waiting = true
        let tuBatDau = spanHead.innerText
        inputText.value = ipKetThuc_themTuTraLoi.value

        inputText.focus()

        data_tl = {
            tuBatDau,
            tuKetThuc: ipKetThuc_themTuTraLoi.value
        }

        ipKetThuc_themTuTraLoi.value = ''
        const eventKeyBoard = new KeyboardEvent('keydown', {
            key: 'Enter', // Mã ASCII cho phím enter
            keyCode: 13,
            char: '\n' // Ký tự tương ứng với phím enter
        });
        inputText.dispatchEvent(eventKeyBoard)

    }

}
wrapThemTuTraLoi.appendChild(ipKetThuc_themTuTraLoi);


//add to mode container
modeNoiTuContainer.appendChild(titleThemTuTraLoi);
modeNoiTuContainer.appendChild(wrapThemTuTraLoi);

//add to container
container.appendChild(modeNoiTuContainer);





const handleThemTuDie = async (tuBatDau, tuKetThuc, mess) => {
    mess = mess ? mess : 'Them die: '
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


const handleNhapTraLoi = async (tuBatDau, tuKetThuc, mess) => {
    mess = mess ? mess : 'Them: '
    let data = {
        tuBatDau,
        tuKetThuc,
        typeAdd: 'addNew'
    }
    if (idTimeout)
        clearTimeout(idTimeout)

    idTimeout = setTimeout(async () => {
        waiting = false
        let wrapKetThuc = document.querySelector('.swal-overlay.swal-overlay--show-modal')
        if (wrapKetThuc)
            data.typeAdd = 'deleteTu'

        console.log(mess, tuBatDau, tuKetThuc);

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

    }, 1200);



}

const handleXoaTu = async () => {
    let data = {
        tuBatDau: currentWord.innerText.split(' ')[0],
        tuKetThuc: currentWord.innerText.split(' ')[1]
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