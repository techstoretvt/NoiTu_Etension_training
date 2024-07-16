const link_backend = 'https://server-noi-tu.onrender.com'

let ipBatDau_die = document.getElementById('ipBatDau_die');
let ipKetThuc_die = document.getElementById('ipKetThuc_die');

let ipBatDau_tl = document.getElementById('ipBatDau_tl');
let ipKetThuc_tl = document.getElementById('ipKetThuc_tl');

let ipBatDau_xoa = document.getElementById('ipBatDau_xoa');
let ipKetThuc_xoa = document.getElementById('ipKetThuc_xoa');


ipKetThuc_die.onkeydown = async (event) => {
    if (event.key === "Enter") {
        let data = {
            tuBatDau: ipBatDau_die.value,
            tuKetThuc: ipKetThuc_die.value
        }

        if (!data.tuBatDau || !data.tuKetThuc) return

        ipBatDau_die.value = ""
        ipKetThuc_die.value = ""
        ipBatDau_die.focus()

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
        console.log(response);

    }
}

ipKetThuc_tl.onkeydown = async (event) => {
    if (event.key === 'Enter') {
        let data = {
            tuBatDau: ipBatDau_tl.value,
            tuKetThuc: ipKetThuc_tl.value
        }

        if (!data.tuBatDau || !data.tuKetThuc) return
        ipBatDau_tl.value = ""
        ipKetThuc_tl.value = ""
        ipBatDau_tl.focus()

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
        console.log(response);
    }
}

ipKetThuc_xoa.onkeydown = async (event) => {
    if (event.key === 'Enter') {
        let data = {
            tuBatDau: ipBatDau_xoa.value,
            tuKetThuc: ipKetThuc_xoa.value
        }

        if (!data.tuBatDau || !data.tuKetThuc) return
        ipBatDau_xoa.value = ""
        ipKetThuc_xoa.value = ""
        ipBatDau_xoa.focus()

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
        console.log(response);
    }
}
