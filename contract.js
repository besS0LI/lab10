const contractAddress = "0xAC1F7A6F26dD934947Cc6d8a518d0bb688C22375";

// ABI контракта SimpleStorage
const contractAbi = [
    {
        "inputs": [
            { "internalType": "string", "name": "_message", "type": "string" }
        ],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMessage",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Проверяем, что MetaMask доступен
if (typeof window.ethereum === "undefined") {
    alert("MetaMask не найден. Установите MetaMask и откройте страницу в том же браузере.");
} else {

    console.log("contract.js загружен, MetaMask найден");

    // Ждём полной загрузки страницы, чтобы элементы точно существовали
    window.addEventListener("load", () => {
        console.log("Страница загружена, инициализация...");

        init().catch((err) => {
            console.error("Ошибка в init:", err);
            alert("Ошибка инициализации, подробности в консоли (F12 → Console).");
        });
    });

    async function init() {
        // Явный запрос аккаунтов у MetaMask
        console.log("Запрос аккаунтов у MetaMask...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Аккаунты получены");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const setBtn = document.getElementById("setMessageButton");
        const getBtn = document.getElementById("getMessageButton");
        const input = document.getElementById("messageInput");
        const output = document.getElementById("messageDisplay");

        if (!setBtn || !getBtn || !input || !output) {
            throw new Error("Не найдены элементы страницы (проверь id кнопок и полей в HTML).");
        }

        setBtn.onclick = async () => {
            try {
                const message = input.value;
                console.log("Вызов setMessage с текстом:", message);
                const tx = await contract.setMessage(message);
                console.log("Транзакция отправлена:", tx.hash);
                alert("Транзакция отправлена: " + tx.hash);
            } catch (e) {
                console.error("Ошибка при setMessage:", e);
                alert("Ошибка при setMessage, подробности в консоли.");
            }
        };

        getBtn.onclick = async () => {
            try {
                console.log("Вызов getMessage...");
                const message = await contract.getMessage();
                console.log("Получено сообщение:", message);
                output.innerText = message;
            } catch (e) {
                console.error("Ошибка при getMessage:", e);
                alert("Ошибка при getMessage, подробности в консоли.");
            }
        };

        console.log("Обработчики кнопок установлены");
    }
}
