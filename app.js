let getInput = document.getElementById("inputText");
let btn = document.getElementById("btn")
let showCode = document.getElementById("showCode")
let arrayCode = []
btn.addEventListener('click', e => {
    const emails = getInput.value.split(/\r?\n/).filter(email => email.trim() !== '');


// Tạo đối tượng để chứa các key-value
const emailObject = {};

// Lặp qua từng email để tách key và value
emails.forEach(email => {
    const parts = email.split('@'); // Tách key và value
    if (parts.length === 2) { // Đảm bảo có cả key và value
        const key = parts[0].trim(); // Phần trước dấu @
        const value = parts[1].trim(); // Phần sau dấu @
        emailObject[key] = value; // Gán vào đối tượng
    }
});

async function fetchEmailMessages() {
    for (const [key, value] of Object.entries(emailObject)) {
        // Tạo URL API
        const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${key}&domain=${value}`;

        try {
            // Gọi API để lấy danh sách email
            const response = await fetch(url);
            // Kiểm tra kết quả
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // Chuyển đổi dữ liệu thành JSON

            // Kiểm tra xem mảng có dữ liệu không
            if (data.length >= 0) {
                // Lấy ID của email cuối cùng
                const lastEmailId = data[0].id; // Lấy ID của email cuối cùng
                console.log(`ID của email cuối cùng: ${lastEmailId}`);

                // Gọi API để đọc email
                console.log(data, "data")
                await readMessage(key, value, lastEmailId);
            } else {
                console.log(`Không có email nào cho ${key}@${value}`);
            }
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu cho ${key}@${value}:`, error);
        }
    }
}

// Hàm để read message
async function readMessage(key, value, id) {
    const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${key}&domain=${value}&id=${id}`;

    try {
        // Gọi API để đọc tin nhắn
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const email = await response.json(); // Chuyển đổi dữ liệu thành JSON

        // Hiển thị email đã đọc
        let test = new DOMParser().parseFromString(email.htmlBody, "text/html")
        console.log(test);
        
        let code = test.querySelector("body")

        let node = document.createElement("li");
        let textnode = document.createTextNode(test.getElementById("code").innerHTML)
        
        node.appendChild(textnode)
      
        document.getElementById("showCode").appendChild(node)
        
        console.log(`Nội dung email với ID ${id}:`, email);
    } catch (error) {
        console.error(`Lỗi khi đọc email ID ${id} của ${key}@${value}:`, error);
    }
}

// Gọi hàm fetchEmailMessages
fetchEmailMessages();
})

// Giả sử đây là dữ liệu bạn nhận được từ API
