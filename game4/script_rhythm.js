// === KODE GAME RHYTHM FINAL (VERSI BERSIH) ===

// --- Mengambil Elemen dari HTML ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-button');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const gameOverTitle = gameOverScreen.querySelector('h2');
const restartButton = gameOverScreen.querySelector('#restartButton');

// --- PENGATURAN CANVAS & JALUR NADA ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const NUM_LANES = 4;
const LANE_WIDTH = canvas.width / NUM_LANES;
const HIT_ZONE_HEIGHT = 155;
const HIT_LINE_Y = canvas.height - HIT_ZONE_HEIGHT;

// --- MEMUAT ASET (DENGAN SISTEM PRELOADER) ---
let assetsLoaded = 0;
const totalAssets = 8; // 7 gambar + 1 audio
let allAssetsLoaded = false;

function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        allAssetsLoaded = true;
        startButton.disabled = false;
        startButton.textContent = "Mulai";
    }
}

// Inisialisasi dan muat semua gambar
const normalErineImg = new Image(); normalErineImg.onload = assetLoaded; normalErineImg.src = 'erine_rhythm_normal.png';
const perfectErineImg = new Image(); perfectErineImg.onload = assetLoaded; perfectErineImg.src = 'erine_perfect.png';
const missErineImg = new Image(); missErineImg.onload = assetLoaded; missErineImg.src = 'erine_miss.png';
const noteImg = new Image(); noteImg.onload = assetLoaded; noteImg.src = 'note.png';
const perfectFeedbackImg = new Image(); perfectFeedbackImg.onload = assetLoaded; perfectFeedbackImg.src = 'feedback_perfect.png';
const goodFeedbackImg = new Image(); goodFeedbackImg.onload = assetLoaded; goodFeedbackImg.src = 'feedback_good.png';
const missFeedbackImg = new Image(); missFeedbackImg.onload = assetLoaded; missFeedbackImg.src = 'feedback_miss.png';

// Muat audio
const music = new Audio();
music.addEventListener('canplaythrough', assetLoaded, { once: true });
music.src = 'song.mp3';
music.load();


// --- DATA BEATMAP ---
const beatmap = [{"time":0.573,"lane":2},{"time":1.046,"lane":0},{"time":1.368,"lane":3},{"time":1.862,"lane":0},{"time":2.082,"lane":1},{"time":2.384,"lane":2},{"time":2.737,"lane":0},{"time":3.069,"lane":3},{"time":4.13,"lane":1},{"time":4.501,"lane":2},{"time":4.78,"lane":0},{"time":5.013,"lane":3},{"time":5.301,"lane":0},{"time":5.556,"lane":2},{"time":5.87,"lane":1},{"time":6.146,"lane":2},{"time":6.447,"lane":1},{"time":6.779,"lane":3},{"time":7.074,"lane":0},{"time":8.16,"lane":3},{"time":8.52,"lane":0},{"time":8.774,"lane":2},{"time":9.036,"lane":1},{"time":9.283,"lane":2},{"time":9.536,"lane":1},{"time":9.858,"lane":2},{"time":10.149,"lane":0},{"time":10.402,"lane":3},{"time":10.747,"lane":1},{"time":11.069,"lane":2},{"time":12.01,"lane":2},{"time":12.429,"lane":1},{"time":12.637,"lane":3},{"time":12.873,"lane":0},{"time":13.126,"lane":2},{"time":13.336,"lane":0},{"time":13.535,"lane":3},{"time":13.844,"lane":1},{"time":14.258,"lane":2},{"time":14.538,"lane":0},{"time":14.839,"lane":3},{"time":15.096,"lane":1},{"time":16,"lane":2},{"time":16.296,"lane":1},{"time":16.551,"lane":2},{"time":16.794,"lane":0},{"time":17.019,"lane":3},{"time":17.535,"lane":0},{"time":18.385,"lane":2},{"time":18.846,"lane":1},{"time":19.067,"lane":0},{"time":19.921,"lane":1},{"time":20.538,"lane":3},{"time":20.826,"lane":1},{"time":21.041,"lane":0},{"time":21.412,"lane":2},{"time":21.773,"lane":0},{"time":22.039,"lane":3},{"time":22.465,"lane":1},{"time":22.783,"lane":2},{"time":23.076,"lane":0},{"time":24.362,"lane":2},{"time":24.564,"lane":1},{"time":24.813,"lane":3},{"time":25.047,"lane":0},{"time":25.408,"lane":2},{"time":25.597,"lane":0},{"time":26.035,"lane":3},{"time":26.426,"lane":1},{"time":26.777,"lane":2},{"time":27.06,"lane":3},{"time":28.005,"lane":0},{"time":28.518,"lane":2},{"time":28.801,"lane":1},{"time":29.051,"lane":3},{"time":29.405,"lane":3},{"time":29.752,"lane":0},{"time":30.02,"lane":2},{"time":30.398,"lane":0},{"time":30.76,"lane":1},{"time":31.053,"lane":3},{"time":32.013,"lane":1},{"time":32.268,"lane":3},{"time":32.519,"lane":0},{"time":32.784,"lane":2},{"time":33.06,"lane":0},{"time":33.289,"lane":3},{"time":33.568,"lane":1},{"time":33.815,"lane":2},{"time":34.137,"lane":0},{"time":34.358,"lane":3},{"time":34.635,"lane":0},{"time":34.876,"lane":2},{"time":35.088,"lane":1},{"time":35.562,"lane":3},{"time":36.522,"lane":2},{"time":36.798,"lane":1},{"time":37.027,"lane":3},{"time":37.529,"lane":0},{"time":38.088,"lane":3},{"time":38.606,"lane":2},{"time":38.903,"lane":1},{"time":39.769,"lane":2},{"time":40.018,"lane":0},{"time":40.576,"lane":1},{"time":40.805,"lane":3},{"time":41.81,"lane":2},{"time":42.04,"lane":0},{"time":42.553,"lane":1},{"time":42.792,"lane":3},{"time":43.501,"lane":2},{"time":43.783,"lane":0},{"time":44.056,"lane":3},{"time":44.453,"lane":1},{"time":44.788,"lane":2},{"time":45.073,"lane":1},{"time":45.396,"lane":0},{"time":45.774,"lane":3},{"time":46.062,"lane":2},{"time":48.073,"lane":1},{"time":48.477,"lane":3},{"time":49.058,"lane":0},{"time":49.557,"lane":2},{"time":49.824,"lane":1},{"time":50.032,"lane":3},{"time":50.285,"lane":0},{"time":50.53,"lane":2},{"time":50.783,"lane":1},{"time":51.036,"lane":3},{"time":51.3,"lane":0},{"time":51.533,"lane":2},{"time":51.795,"lane":1},{"time":52.03,"lane":3},{"time":52.33,"lane":0},{"time":52.533,"lane":2},{"time":52.845,"lane":1},{"time":53.283,"lane":3},{"time":53.578,"lane":0},{"time":53.792,"lane":2},{"time":54.048,"lane":1},{"time":54.488,"lane":1},{"time":54.774,"lane":2},{"time":55.026,"lane":0},{"time":55.347,"lane":3},{"time":55.637,"lane":0},{"time":56.045,"lane":2},{"time":56.537,"lane":1},{"time":57.034,"lane":3},{"time":57.532,"lane":0},{"time":58.096,"lane":2},{"time":58.305,"lane":1},{"time":58.539,"lane":3},{"time":58.83,"lane":0},{"time":59.118,"lane":2},{"time":59.448,"lane":0},{"time":59.856,"lane":3},{"time":60.058,"lane":1},{"time":60.559,"lane":3},{"time":60.81,"lane":1},{"time":61.048,"lane":2},{"time":62.046,"lane":2},{"time":62.291,"lane":0},{"time":62.785,"lane":1},{"time":63.046,"lane":3},{"time":63.503,"lane":3},{"time":63.946,"lane":0},{"time":64.579,"lane":1},{"time":65.101,"lane":2},{"time":65.546,"lane":0},{"time":66.094,"lane":2},{"time":68.039,"lane":1},{"time":69.012,"lane":2},{"time":70.024,"lane":3},{"time":71.051,"lane":0},{"time":72.031,"lane":1},{"time":73.036,"lane":2},{"time":74.037,"lane":3},{"time":75.036,"lane":0},{"time":76.042,"lane":1},{"time":77.041,"lane":2},{"time":78.034,"lane":3},{"time":79,"lane":0},{"time":80.04,"lane":2},{"time":81.051,"lane":1},{"time":82,"lane":3},{"time":82.787,"lane":0},{"time":83.565,"lane":2},{"time":84.078,"lane":1},{"time":84.519,"lane":3},{"time":85.041,"lane":0},{"time":85.551,"lane":2},{"time":86.06,"lane":1},{"time":86.5,"lane":3},{"time":87.071,"lane":0},{"time":87.58,"lane":1},{"time":88.124,"lane":2},{"time":88.522,"lane":0},{"time":89.03,"lane":3},{"time":89.506,"lane":0},{"time":90.01,"lane":2},{"time":90.3,"lane":1},{"time":90.777,"lane":3},{"time":91.053,"lane":0},{"time":92.269,"lane":3},{"time":93.131,"lane":2},{"time":93.707,"lane":0},{"time":95.007,"lane":1},{"time":95.512,"lane":3},{"time":96.058,"lane":1},{"time":96.692,"lane":2},{"time":97.017,"lane":0},{"time":97.382,"lane":3},{"time":97.758,"lane":0},{"time":98.03,"lane":2},{"time":98.574,"lane":1},{"time":99.071,"lane":3},{"time":99.636,"lane":1},{"time":100.1,"lane":3},{"time":100.538,"lane":0},{"time":101.018,"lane":2},{"time":101.271,"lane":1},{"time":101.508,"lane":3},{"time":101.767,"lane":0},{"time":102.265,"lane":0},{"time":102.525,"lane":3},{"time":102.801,"lane":0},{"time":103.037,"lane":2},{"time":103.32,"lane":1},{"time":103.627,"lane":3},{"time":103.894,"lane":0},{"time":104.136,"lane":2},{"time":104.381,"lane":1},{"time":104.567,"lane":3},{"time":104.824,"lane":0},{"time":105.082,"lane":3},{"time":106.095,"lane":0},{"time":106.553,"lane":2},{"time":106.815,"lane":0},{"time":107.085,"lane":3},{"time":107.47,"lane":1},{"time":108.033,"lane":3},{"time":108.281,"lane":0},{"time":108.783,"lane":2},{"time":109.032,"lane":1},{"time":109.496,"lane":3},{"time":109.791,"lane":0},{"time":110.327,"lane":2},{"time":110.656,"lane":1},{"time":111.008,"lane":3},{"time":111.393,"lane":0},{"time":111.88,"lane":2},{"time":112.089,"lane":1},{"time":112.253,"lane":0},{"time":112.517,"lane":3},{"time":112.805,"lane":0},{"time":113.057,"lane":2},{"time":113.785,"lane":1},{"time":114.096,"lane":3},{"time":114.324,"lane":0},{"time":114.565,"lane":2},{"time":114.855,"lane":0},{"time":115.478,"lane":0},{"time":116.073,"lane":3},{"time":116.517,"lane":1},{"time":117.066,"lane":2},{"time":118.015,"lane":1},{"time":118.588,"lane":3},{"time":119.581,"lane":0},{"time":119.583,"lane":2},{"time":120.079,"lane":3},{"time":121.624,"lane":2},{"time":122.569,"lane":1},{"time":123.084,"lane":3},{"time":123.627,"lane":0},{"time":124.584,"lane":2},{"time":125.019,"lane":1},{"time":125.52,"lane":3},{"time":126.092,"lane":0},{"time":126.457,"lane":2},{"time":127.052,"lane":0},{"time":127.533,"lane":3},{"time":128.089,"lane":0},{"time":128.585,"lane":2},{"time":129.037,"lane":1},{"time":129.491,"lane":2},{"time":130.026,"lane":0},{"time":130.477,"lane":3},{"time":131.028,"lane":0},{"time":131.532,"lane":2},{"time":131.847,"lane":1},{"time":132.064,"lane":3},{"time":132.522,"lane":0},{"time":133.022,"lane":2},{"time":133.553,"lane":1},{"time":134.031,"lane":3},{"time":134.346,"lane":0},{"time":134.741,"lane":2},{"time":135.089,"lane":0},{"time":136.116,"lane":3},{"time":136.734,"lane":0},{"time":137.064,"lane":2},{"time":137.407,"lane":1},{"time":137.769,"lane":3},{"time":138.063,"lane":0},{"time":138.48,"lane":3},{"time":139.1,"lane":2},{"time":139.101,"lane":1},{"time":140.012,"lane":3},{"time":140.025,"lane":0},{"time":140.515,"lane":2},{"time":140.813,"lane":1},{"time":141.299,"lane":0},{"time":141.301,"lane":3},{"time":141.806,"lane":1},{"time":141.81,"lane":2},{"time":142.035,"lane":3},{"time":142.052,"lane":0},{"time":142.563,"lane":2},{"time":142.817,"lane":1},{"time":143.043,"lane":3},{"time":143.277,"lane":0},{"time":143.58,"lane":2},{"time":144.359,"lane":1},{"time":144.396,"lane":0},{"time":144.989,"lane":2},{"time":145.539,"lane":3},{"time":145.779,"lane":0},{"time":146.068,"lane":2},{"time":146.557,"lane":1},{"time":147.057,"lane":3},{"time":147.129,"lane":0},{"time":147.856,"lane":1},{"time":147.863,"lane":2},{"time":148.317,"lane":3},{"time":148.355,"lane":0},{"time":148.624,"lane":2},{"time":149.063,"lane":1},{"time":150.026,"lane":2},{"time":150.036,"lane":1},{"time":150.529,"lane":3},{"time":151.072,"lane":1},{"time":151.073,"lane":3},{"time":151.553,"lane":0},{"time":151.554,"lane":2},{"time":152.079,"lane":1},{"time":152.18,"lane":3},{"time":152.627,"lane":2},{"time":152.638,"lane":0},{"time":153.053,"lane":3},{"time":153.455,"lane":2},{"time":153.766,"lane":0},{"time":154.045,"lane":3},{"time":156.066,"lane":2},{"time":156.53,"lane":1},{"time":157.078,"lane":3},{"time":157.312,"lane":0},{"time":157.671,"lane":2},{"time":158.043,"lane":1},{"time":158.525,"lane":3},{"time":158.785,"lane":0},{"time":159.049,"lane":2},{"time":159.292,"lane":1},{"time":159.513,"lane":3},{"time":159.782,"lane":0},{"time":160.08,"lane":2},{"time":160.319,"lane":1},{"time":160.545,"lane":3},{"time":160.82,"lane":0},{"time":161.073,"lane":2},{"time":161.569,"lane":1},{"time":162.031,"lane":3},{"time":162.287,"lane":0},{"time":162.561,"lane":2},{"time":162.802,"lane":1},{"time":163.04,"lane":3},{"time":163.534,"lane":0},{"time":164.035,"lane":2},{"time":164.312,"lane":1},{"time":164.779,"lane":0},{"time":165.027,"lane":3},{"time":165.525,"lane":0},{"time":166.024,"lane":2},{"time":166.295,"lane":0},{"time":166.828,"lane":3},{"time":166.833,"lane":1},{"time":167.291,"lane":0},{"time":167.322,"lane":2},{"time":167.848,"lane":3},{"time":167.856,"lane":1},{"time":168.306,"lane":0},{"time":168.35,"lane":2},{"time":168.62,"lane":3},{"time":168.847,"lane":1},{"time":169.101,"lane":2},{"time":169.54,"lane":0},{"time":170.033,"lane":3},{"time":170.432,"lane":1},{"time":170.954,"lane":2},{"time":171.459,"lane":0},{"time":172.028,"lane":3},{"time":172.281,"lane":1},{"time":172.534,"lane":2},{"time":172.803,"lane":0},{"time":173.049,"lane":3},{"time":173.548,"lane":0},{"time":174.112,"lane":2},{"time":175.322,"lane":0},{"time":175.547,"lane":3},{"time":176.057,"lane":1},{"time":176.599,"lane":2},{"time":176.926,"lane":0},{"time":177.345,"lane":3},{"time":177.591,"lane":1},{"time":178.007,"lane":2},{"time":178.311,"lane":0},{"time":178.802,"lane":3},{"time":179.135,"lane":1},{"time":180.06,"lane":2},{"time":180.312,"lane":0},{"time":180.561,"lane":3},{"time":181.057,"lane":0},{"time":181.398,"lane":2},{"time":181.735,"lane":0},{"time":182.052,"lane":3},{"time":182.478,"lane":1},{"time":182.492,"lane":2},{"time":182.803,"lane":3},{"time":183.047,"lane":0},{"time":183.557,"lane":2},{"time":184.051,"lane":0},{"time":184.56,"lane":3},{"time":185.075,"lane":0},{"time":185.585,"lane":2},{"time":186.069,"lane":1},{"time":186.566,"lane":2},{"time":187.092,"lane":0},{"time":187.56,"lane":3},{"time":188.058,"lane":0},{"time":188.556,"lane":2},{"time":189.029,"lane":1},{"time":189.432,"lane":3},{"time":189.686,"lane":0},{"time":190.05,"lane":2},{"time":190.424,"lane":0},{"time":190.8,"lane":3},{"time":191.057,"lane":1},{"time":191.555,"lane":2},{"time":192.05,"lane":0},{"time":192.321,"lane":3},{"time":192.567,"lane":1},{"time":192.82,"lane":2},{"time":193.078,"lane":0},{"time":193.318,"lane":3},{"time":193.622,"lane":1},{"time":194.086,"lane":2},{"time":194.363,"lane":0},{"time":194.763,"lane":3},{"time":195.03,"lane":0},{"time":195.331,"lane":2},{"time":195.567,"lane":1},{"time":196.066,"lane":3},{"time":196.562,"lane":0},{"time":197.001,"lane":2},{"time":197.522,"lane":1},{"time":197.995,"lane":3},{"time":198.264,"lane":0},{"time":198.579,"lane":2},{"time":198.779,"lane":0},{"time":199.078,"lane":3},{"time":199.828,"lane":2},{"time":200.072,"lane":1},{"time":200.292,"lane":0},{"time":200.584,"lane":3},{"time":200.833,"lane":0},{"time":201.082,"lane":2},{"time":201.821,"lane":2},{"time":202.078,"lane":0},{"time":202.318,"lane":3},{"time":202.604,"lane":1},{"time":203.073,"lane":3},{"time":203.468,"lane":0},{"time":203.823,"lane":2},{"time":204.075,"lane":0},{"time":204.464,"lane":3},{"time":204.834,"lane":0},{"time":205.088,"lane":2},{"time":205.467,"lane":1},{"time":205.844,"lane":3},{"time":206.099,"lane":1},{"time":206.618,"lane":2},{"time":207.105,"lane":0},{"time":207.579,"lane":3},{"time":207.857,"lane":1},{"time":208.13,"lane":2},{"time":208.345,"lane":0},{"time":208.56,"lane":3},{"time":209.01,"lane":2},{"time":209.279,"lane":1},{"time":209.507,"lane":3},{"time":209.776,"lane":0},{"time":210.017,"lane":2},{"time":210.299,"lane":1},{"time":210.54,"lane":3},{"time":210.774,"lane":0},{"time":211.018,"lane":2},{"time":211.3,"lane":1},{"time":211.515,"lane":3},{"time":211.746,"lane":0},{"time":212.04,"lane":2},{"time":212.315,"lane":1},{"time":212.552,"lane":3},{"time":212.803,"lane":0},{"time":213.052,"lane":2},{"time":213.313,"lane":1},{"time":213.601,"lane":3},{"time":213.815,"lane":0},{"time":214.044,"lane":2},{"time":214.348,"lane":1},{"time":214.548,"lane":3},{"time":214.796,"lane":0},{"time":215.02,"lane":2},{"time":215.303,"lane":1},{"time":215.553,"lane":3},{"time":216.095,"lane":0},{"time":216.648,"lane":2},{"time":217.033,"lane":1},{"time":217.495,"lane":3},{"time":218.001,"lane":0},{"time":218.277,"lane":2},{"time":218.537,"lane":1},{"time":218.794,"lane":3},{"time":219.061,"lane":0},{"time":219.449,"lane":3},{"time":219.83,"lane":0},{"time":220.087,"lane":2},{"time":220.537,"lane":0},{"time":220.595,"lane":2},{"time":221.062,"lane":3},{"time":221.54,"lane":1},{"time":222.032,"lane":3},{"time":222.314,"lane":0},{"time":223.059,"lane":2},{"time":223.505,"lane":0},{"time":224.066,"lane":3},{"time":224.521,"lane":0},{"time":224.809,"lane":2},{"time":225.062,"lane":0},{"time":225.559,"lane":3},{"time":226.075,"lane":1},{"time":226.583,"lane":3},{"time":226.828,"lane":0},{"time":227.082,"lane":2},{"time":227.326,"lane":0},{"time":227.856,"lane":0},{"time":228.053,"lane":3},{"time":228.33,"lane":0},{"time":228.545,"lane":2},{"time":228.836,"lane":1},{"time":229.072,"lane":3},{"time":230.081,"lane":3},{"time":230.548,"lane":0},{"time":230.792,"lane":2},{"time":231.09,"lane":0},{"time":231.364,"lane":1},{"time":231.552,"lane":3},{"time":232.087,"lane":0},{"time":232.569,"lane":2},{"time":232.801,"lane":0},{"time":233.033,"lane":3},{"time":233.3,"lane":1},{"time":233.527,"lane":2},{"time":234.298,"lane":2},{"time":234.563,"lane":1},{"time":235.042,"lane":3},{"time":235.299,"lane":1},{"time":235.852,"lane":1},{"time":236.059,"lane":2},{"time":236.305,"lane":1},{"time":236.563,"lane":0},{"time":237.092,"lane":2},{"time":237.594,"lane":1},{"time":238.057,"lane":3},{"time":238.293,"lane":0},{"time":238.531,"lane":2},{"time":238.867,"lane":1},{"time":239.08,"lane":3},{"time":239.589,"lane":0},{"time":240.111,"lane":2},{"time":240.322,"lane":1},{"time":240.551,"lane":3},{"time":240.782,"lane":0},{"time":241.04,"lane":2},{"time":241.553,"lane":0},{"time":241.995,"lane":3},{"time":242.561,"lane":0},{"time":243.05,"lane":2},{"time":243.572,"lane":1},{"time":244.013,"lane":3},{"time":244.289,"lane":0},{"time":244.537,"lane":2},{"time":244.778,"lane":1},{"time":245.02,"lane":3},{"time":245.314,"lane":0},{"time":245.582,"lane":2},{"time":245.816,"lane":1},{"time":246.049,"lane":3},{"time":246.545,"lane":0},{"time":246.797,"lane":2},{"time":247.052,"lane":0},{"time":247.544,"lane":3},{"time":248.075,"lane":0},{"time":248.365,"lane":2},{"time":248.61,"lane":1},{"time":249.029,"lane":3},{"time":249.54,"lane":0},{"time":250.073,"lane":2},{"time":250.547,"lane":0},{"time":251.04,"lane":1},{"time":251.633,"lane":2},{"time":252.037,"lane":0},{"time":252.41,"lane":2},{"time":252.713,"lane":1},{"time":253.056,"lane":3},{"time":253.546,"lane":0},{"time":254.039,"lane":2},{"time":254.341,"lane":0},{"time":254.801,"lane":3},{"time":255.064,"lane":1},{"time":255.518,"lane":2},{"time":256.008,"lane":1},{"time":256.527,"lane":3},{"time":256.798,"lane":0},{"time":257.062,"lane":2},{"time":257.551,"lane":0},{"time":258.084,"lane":3},{"time":258.571,"lane":1},{"time":259.07,"lane":2},{"time":259.538,"lane":0},{"time":260.008,"lane":3},{"time":260.554,"lane":0},{"time":261.031,"lane":2},{"time":261.346,"lane":1},{"time":261.588,"lane":3},{"time":262.018,"lane":2},{"time":262.385,"lane":1},{"time":262.585,"lane":2},{"time":262.943,"lane":1},{"time":263.163,"lane":2},{"time":263.399,"lane":1},{"time":263.683,"lane":2},{"time":263.911,"lane":1},{"time":264.146,"lane":2},{"time":264.404,"lane":1},{"time":264.644,"lane":2},{"time":264.824,"lane":0},{"time":265.02,"lane":3},{"time":265.186,"lane":0},{"time":265.281,"lane":3},{"time":265.435,"lane":0},{"time":265.547,"lane":3},{"time":265.85,"lane":3},{"time":266.071,"lane":0},{"time":266.336,"lane":2},{"time":267.104,"lane":1},{"time":267.107,"lane":2},{"time":269.907,"lane":3}];

// --- VARIABEL GAME & SISTEM ---
let score = 0;
let notes = [];
let noteSpeed = 7; // Kecepatan nada jatuh (bisa disesuaikan)
let currentErineImg = normalErineImg;
let erineReactionTimer = 0;
let currentFeedback = null;
let feedbackTimer = 0;
let gameOver = false;

// Variabel baru untuk beatmap
let beatmapIndex = 0; // Untuk melacak nada berikutnya di beatmap
const NOTE_SPAWN_OFFSET = 1.5; // Dalam detik. Nada akan muncul 1.5 detik SEBELUM waktunya di beatmap

// Variabel baru untuk timing window (dalam piksel)
const perfectWindow = 50;
const goodWindow = 90;


// --- FUNGSI-FUNGSI GAME ---
function drawStaticElements() {
    // Latar belakang gelap sederhana
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar garis pemisah antar jalur
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 1; i < NUM_LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(i * LANE_WIDTH, 0);
        ctx.lineTo(i * LANE_WIDTH, canvas.height);
        ctx.stroke();
    }

    // Gambar area "hit" di bagian bawah
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, HIT_LINE_Y, canvas.width, HIT_ZONE_HEIGHT);
    ctx.strokeStyle = '#e94560';
    ctx.strokeRect(0, HIT_LINE_Y, canvas.width, HIT_ZONE_HEIGHT);
}

function spawnNoteFromBeatmap(noteData) {
    // Fungsi ini sekarang menerima data dari beatmap
    const lane = noteData.lane;
    notes.push({
        x: lane * LANE_WIDTH + (LANE_WIDTH - 50) / 2,
        y: -50,
        width: 50,
        height: 50,
        lane: lane,
        isHit: false // Tandai nada belum dipukul
    });
}

function updateAndDrawNotes() {
    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        note.y += noteSpeed;
        ctx.drawImage(noteImg, note.x, note.y, note.width, note.height);

        // Hapus nada jika terlewat (MISS)
        if (note.y > canvas.height && !note.isHit) {
            notes.splice(i, 1);
            triggerFeedback('miss');
        }
    }
}

function checkHit(laneIndex) {
    let hit = false;
    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        const distanceFromHitLine = Math.abs(note.y + (note.height / 2) - HIT_LINE_Y);

        if (note.lane === laneIndex && distanceFromHitLine < goodWindow + 20) {
            if (distanceFromHitLine <= perfectWindow) {
                // PERFECT HIT
                score += 20;
                triggerFeedback('perfect');
            } else if (distanceFromHitLine <= goodWindow) {
                // GOOD HIT
                score += 10;
                triggerFeedback('good');
            }
            notes.splice(i, 1);
            hit = true;
            break; // Hanya proses satu nada per ketukan
        }
    }
    if (!hit) {
        triggerFeedback('miss');
    }
    scoreDisplay.textContent = `SKOR: ${score}`;
}

function triggerFeedback(type) {
    if (type === 'perfect') {
        currentFeedback = perfectFeedbackImg;
        currentErineImg = perfectErineImg;
    } else if (type === 'good') {
        currentFeedback = goodFeedbackImg;
        currentErineImg = normalErineImg;
    } else if (type === 'miss') {
        currentFeedback = missFeedbackImg;
        currentErineImg = missErineImg;
    }
    feedbackTimer = 30; // Tampilkan feedback selama 30 frame
    erineReactionTimer = 60; // Reaksi Erine lebih lama
}

function updateAndDrawFeedback() {
    // Gambar reaksi Erine
    const erineWidth = 150;
    const erineHeight = (currentErineImg.height / currentErineImg.width) * erineWidth;
    ctx.drawImage(currentErineImg, canvas.width - erineWidth - 20, (canvas.height - erineHeight) / 2, erineWidth, erineHeight);

    // Hitung mundur timer reaksi Erine
    if (erineReactionTimer > 0) {
        erineReactionTimer--;
    } else {
        currentErineImg = normalErineImg; // Kembali ke ekspresi normal
    }

    // Gambar feedback text
    if (feedbackTimer > 0) {
        ctx.globalAlpha = feedbackTimer > 15 ? 1 : feedbackTimer / 15;
        const feedbackWidth = 200;
        const feedbackHeight = (currentFeedback.height / currentFeedback.width) * feedbackWidth;
        // Posisikan feedback di tengah area jalur nada
        ctx.drawImage(currentFeedback, (canvas.width / 2) - (feedbackWidth / 2) - (erineWidth / 2), (canvas.height - feedbackHeight) / 2, feedbackWidth, feedbackHeight);
        ctx.globalAlpha = 1.0; // Kembalikan alpha normal
        feedbackTimer--;
    }
}


// --- FUNGSI UTAMA & GAME LOOP ---
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Reset semua status game
    score = 0;
    scoreDisplay.textContent = `SKOR: ${score}`;
    beatmapIndex = 0;
    notes = [];
    gameOver = false;
    music.currentTime = 0;
    music.play();

    animate();
}

function animate() {
    if (gameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStaticElements();
    updateAndDrawFeedback();
    updateAndDrawNotes();
    
    // --- LOGIKA BARU: SPAWN NADA DARI BEATMAP ---
    while (beatmapIndex < beatmap.length && music.currentTime >= beatmap[beatmapIndex].time - NOTE_SPAWN_OFFSET) {
        spawnNoteFromBeatmap(beatmap[beatmapIndex]);
        beatmapIndex++;
    }
    
    // Hentikan game loop jika lagu sudah selesai dan semua nada sudah hilang
    if (music.ended && notes.length === 0) {
        showResultScreen();
        return; // Hentikan animasi
    }
    
    requestAnimationFrame(animate);
}

// --- FUNGSI BARU UNTUK MENAMPILKAN HASIL ---
function showResultScreen() {
    gameOver = true;
    gameOverTitle.textContent = "Lagu Selesai!";
    gameOverTitle.style.color = "#28a745"; // Hijau
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}


// --- INPUT HANDLER & INISIALISASI ---
// Nonaktifkan tombol mulai di awal sampai aset siap
startButton.disabled = true;
startButton.textContent = "Memuat Aset...";

// Fungsi yang dipanggil saat aset dimuat
function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        startButton.disabled = false;
        startButton.textContent = "Mulai";
        console.log("Semua aset berhasil dimuat. Siap untuk memulai.");
    }
}

// Event listener untuk tombol mulai
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => location.reload());

// Event listener untuk akhir lagu
music.onended = showResultScreen;

// Keyboard input
window.addEventListener('keydown', (e) => {
    if (gameScreen.classList.contains('hidden')) return;
    switch(e.key.toLowerCase()) {
        case 'd': checkHit(0); break;
        case 'f': checkHit(1); break;
        case 'j': checkHit(2); break;
        case 'k': checkHit(3); break;
    }
});

// Touch input
canvas.addEventListener('touchstart', (e) => {
    if (gameScreen.classList.contains('hidden')) return;
    e.preventDefault();
    const touch = e.touches[0];
    const tappedLane = Math.floor(touch.clientX / LANE_WIDTH);
    checkHit(tappedLane);
});

window.addEventListener('resize', () => location.reload());