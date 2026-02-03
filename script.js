const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");
const titleInput = document.getElementById("title");
const subtitleInput = document.getElementById("subtitle");
const descriptionInput = document.getElementById("description");
const downloadBtn = document.getElementById("download");

let posterImage = null;

/* ---------- CREATE SAMPLE POSTER ---------- */
function createSamplePoster() {
    canvas.width = 1080;
    canvas.height = 1350;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#1e3c72");
    gradient.addColorStop(1, "#2a5298");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative shapes
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.arc(900, 200, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(200, 1100, 250, 0, Math.PI * 2);
    ctx.fill();

    drawText();
}

/* ---------- DRAW TEXT ---------- */
function drawText() {
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.font = "bold 64px Arial";
    ctx.fillText(titleInput.value, canvas.width / 2, 300);

    ctx.font = "36px Arial";
    ctx.fillText(subtitleInput.value, canvas.width / 2, 380);

    ctx.font = "28px Arial";
    wrapText(
        descriptionInput.value,
        canvas.width / 2,
        480,
        canvas.width - 200,
        40
    );
}

/* ---------- TEXT WRAPPING ---------- */
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

/* ---------- UPLOAD CUSTOM POSTER ---------- */
upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        posterImage = new Image();
        posterImage.onload = () => {
            canvas.width = posterImage.width;
            canvas.height = posterImage.height;
            ctx.drawImage(posterImage, 0, 0);
            drawText();
        };
        posterImage.src = reader.result;
    };
    reader.readAsDataURL(file);
});

/* ---------- LIVE UPDATE ---------- */
[titleInput, subtitleInput, descriptionInput].forEach(input =>
    input.addEventListener("input", () => {
        if (posterImage) {
            ctx.drawImage(posterImage, 0, 0);
            drawText();
        } else {
            createSamplePoster();
        }
    })
);

/* ---------- DOWNLOAD ---------- */
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "custom-poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

/* ---------- INIT ---------- */
createSamplePoster();
