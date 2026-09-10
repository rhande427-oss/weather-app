// --- Configuration & State ---
const songs = [
    { title: "Sukhakarta Dukhaharta Aarti", src: "assets/music/song1.mp3" },
    { title: "Ganpati Bappa Morya Dhun", src: "assets/music/song2.mp3" }
];

let currentSongIndex = 0;
const audio = document.getElementById('bg-music');
const bellSound = document.getElementById('bell-sound');
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// --- Initialization ---
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('splash-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        initMusic();
        animate();
    }, 1000);
});

// --- Particle System (Flower Petals & Gold Dust) ---
let particles = [];
class Particle {
    constructor(isCelebration = false) {
        this.x = Math.random() * canvas.width;
        this.y = isCelebration ? canvas.height : Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = isCelebration ? (Math.random() * -10 - 5) : (Math.random() * 1 + 0.5);
        this.color = Math.random() > 0.5 ? '#FFD700' : '#FF9933';
        this.opacity = Math.random();
        this.rotation = Math.random() * 360;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += 1;
        if (this.y > canvas.height) this.y = -10;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        // Draw petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initial Background Particles
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        // Remove celebration particles when off-screen
        if (p.y < -50 && p.speedY < 0) particles.splice(index, 1);
    });
    requestAnimationFrame(animate);
}

// --- Music Player Logic ---
function initMusic() {
    loadSong(currentSongIndex);
}

function loadSong(index) {
    const song = songs[index];
    if(song) {
        audio.src = song.src;
        document.getElementById('current-song-title').innerText = "Now Playing: " + song.title;
    }
}

function startMusic() {
    if (!audio.src || audio.src === window.location.href || audio.src.includes('/assets/music/')) {
        document.getElementById('embedded-player').classList.add('is-open');
        document.getElementById('youtube-player').src = 'https://www.youtube.com/embed/videoseries?list=PLNG5PC6r7KAaNGUES6NEgh9O2wJGi9w4F&autoplay=1';
        document.getElementById('current-song-title').innerText = 'आरती वेबसाइटमध्ये सुरू आहे';
        return;
    }

    audio.play().catch(() => {
        document.getElementById('current-song-title').innerText = 'गाणे चालू झाले नाही - दुसरे गाणे निवडा';
    });
}

function closeEmbeddedPlayer() {
    document.getElementById('embedded-player').classList.remove('is-open');
    document.getElementById('youtube-player').src = 'about:blank';
}

document.getElementById('play-pause').addEventListener('click', function() {
    if (audio.paused) {
        startMusic();
        this.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        this.innerHTML = '<i class="fas fa-play"></i>';
    }
});

document.getElementById('next-track').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    startMusic();
});

document.getElementById('prev-track').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    startMusic();
});

document.getElementById('add-song').addEventListener('click', () => {
    document.getElementById('song-file').click();
});

document.getElementById('song-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    songs.push({ title: file.name, src: URL.createObjectURL(file) });
    currentSongIndex = songs.length - 1;
    loadSong(currentSongIndex);
    audio.play().catch(() => {});
    event.target.value = '';
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress-bar').value = progress || 0;
});

document.getElementById('progress-bar').addEventListener('input', (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration;
});

document.getElementById('volume-slider').addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// --- Interaction Features ---

function ringBell() {
    const bell = document.getElementById('temple-bell');
    bell.style.transform = "rotate(20deg)";
    bellSound.currentTime = 0;
    bellSound.play().catch(() => {});
    
    setTimeout(() => bell.style.transform = "rotate(-20deg)", 100);
    setTimeout(() => bell.style.transform = "rotate(0deg)", 200);
}

function offerFlower() {
    createOffering("🌸");
}

function offerModak() {
    createOffering("🥟");
}

function createOffering(emoji) {
    const offering = document.createElement('div');
    offering.className = 'offering';
    offering.innerText = emoji;
    offering.style.left = (Math.random() * 60 + 20) + '%';
    offering.style.bottom = '20%';
    document.getElementById('darshan').appendChild(offering);

    setTimeout(() => {
        offering.style.transform = 'translateY(-150px) scale(1.5)';
        offering.style.opacity = '0';
    }, 50);

    setTimeout(() => offering.remove(), 2000);
}

document.getElementById('celebrate-btn').addEventListener('click', () => {
    // Add 100 particles for explosion
    for(let i=0; i<100; i++) {
        let p = new Particle(true);
        p.x = Math.random() * canvas.width;
        particles.push(p);
    }
    // Visual feedback on button
    const btn = document.getElementById('celebrate-btn');
    btn.innerText = "पुढच्या वर्षी लवकर या!";
    setTimeout(() => btn.innerText = "गणपती बाप्पा मोरया!", 3000);
});

// --- Countdown to next Ganesh Chaturthi ---
function updateCountdown() {
    const now = new Date().getTime();
    const currentYear = new Date().getFullYear();
    let nextGaneshChaturthi = new Date(`September 14, ${currentYear} 00:00:00`).getTime();
    if (nextGaneshChaturthi <= now) {
        nextGaneshChaturthi = new Date(`September 4, ${currentYear + 1} 00:00:00`).getTime();
    }
    const diff = nextGaneshChaturthi - now;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();