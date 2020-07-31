const canvas = document.querySelector("canvas");
canvas.width = document.querySelector("#con").getBoundingClientRect().width;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var global_max = localStorage.getItem("gunship_battle_max");
var aircraft = {
  int: 5,
  temp: 0,
  temp2: 0,
  image: "aircraft.png",
  x: 30,
  y: canvas.height - 44,
  h: 44,
  w: 44,
  loR: null,
  shoot: false,
  speed: 4,
  lives: 3,
  marks: 0,
  bullet: {
    img: undefined,
    color: "white",
    list: [],
    image: "bullet.png",
    speed: 10,
  },
  hartImg: undefined,
  b_value: 100,
};
var enemy = {
  lineMax: Math.floor((canvas.width / 1366) * 12),
  gen: false,
  lineEach: null,
  list: [],
  image: [],
  crash_img: [],
};
var background = {
  x1: 0,
  y1: -(canvas.width * 5100) / 1650 + canvas.height,
  x2: 0,
  y2:
    -(canvas.width * 5100) / 1650 +
    canvas.height -
    (canvas.width * 5100) / 1650,
  speed: 3,
  img: undefined,
};
var button_temp = true;

var res = [
  "image.jpg",
  "aircraft.png",
  "bullet.png",
  "mig1.png",
  "mig2.png",
  "mig3.png",
  "mig4.png",
  "game-heart.png",
  "crash1.png",
  "crash2.png",
  "crash3.png",
  "crash4.png",
  "crash5.png",
  "crash6.png",
  "crash7.png",
  "crash8.png",
  "crash8.png",
  "crash10.png",
  "crash11.png",
];
var au = ["bullet.mp3", "plane_crash.mp3"];
var p = [];
var audio_ctx = new AudioContext();
async function L_sound(url) {
  return await new Promise((resolve) => {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "data/" + url);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      audio_ctx.decodeAudioData(
        xhr.response,
        function (buffer) {
          resolve(buffer);
        },
        function (e) {
          console.warn(e);
        }
      );
    };
    xhr.send();
  });
}
function play_sound(buffer, stop = undefined) {
  var s = audio_ctx.createBufferSource();
  s.buffer = buffer;
  s.connect(audio_ctx.destination);
  s.start(0);
  //s.stop(stop);
}
async function c() {
  for (let i = 0; i < res.length; i++) {
    const xhr = new XMLHttpRequest();
    xhr.open("get", "data/" + res[i]);
    xhr.responseType = "blob";
    xhr.send();

    xhr.onload = await function () {
      let img;
      img = document.createElement("img");
      img.src = URL.createObjectURL(xhr.response);

      switch (res[i]) {
        case "image.jpg":
          background.img = img;
          break;
        case "aircraft.png":
          aircraft.img = img;
          break;
        case "bullet.png":
          aircraft.bullet.img = img;
          break;
        case "mig1.png":
          enemy.image.push({ img: img, h: 55, w: 30 });
          break;
        case "mig2.png":
          enemy.image.push({ img: img, h: 55, w: 40 });
          break;
        case "mig3.png":
          enemy.image.push({ img: img, h: 55, w: 40 });
          break;
        case "mig4.png":
          enemy.image.push({ img: img, h: 55, w: 55 });
          break;
        case "game-heart.png":
          aircraft.hartImg = img;
          break;
        default:
          if (res[i].slice(0, 5) == "crash") {
            enemy.crash_img.push(img);
          }
          break;
      }
      p.push({
        name: res[i],
        image: img,
      });
    };
  }
  for (let i = 0; i < au.length; i++) {
    switch (au[i]) {
      case "bullet.mp3":
        (function () {
          Promise.resolve(L_sound(au[i])).then((r) => {
            aircraft.sound = r;
          });
        })();

        break;
      case "plane_crash.mp3":
        (function () {
          Promise.resolve(L_sound(au[i])).then((r) => {
            enemy.crash_sound = r;
          });
        })();

        break;
    }
  }
  function pl() {
    loop();
    document.getElementById("con").classList = "";
    document.getElementById("button").removeEventListener("click", pl);
    document.body.style.backgroundImage = "none";
  }
  document.getElementById("button").addEventListener("click", pl);
}
c();

function draw_aircraft() {
  ctx.drawImage(aircraft.img, aircraft.x, aircraft.y);
}
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 32:
      if (button_temp) {
        aircraft.shoot = true;
        button_temp = false;
      }
      break;
    case 39:
      aircraft.loR = true;
      break;
    case 37:
      aircraft.loR = false;
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 32:
      aircraft.shoot = false;
      button_temp = true;
      break;
    case 39:
      aircraft.loR = null;
      break;
    case 37:
      aircraft.loR = null;
      break;
  }
});
window.addEventListener("touchstart", () => {
  aircraft.shoot = true;
});
window.addEventListener("touchend", () => {
  aircraft.shoot = false;
});
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
window.addEventListener("blur", () => {
  aircraft.loR = null;
  aircraft.shoot = false;
});
window.addEventListener("deviceorientation", (e) => {
  console.log(e);
});
function move_aircraft() {
  if (aircraft.loR && aircraft.x < canvas.width - aircraft.w)
    aircraft.x += aircraft.speed;
  if (aircraft.loR == false && aircraft.x > 2) aircraft.x -= aircraft.speed;
}
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function gen_bullet() {
  if (aircraft.shoot) {
    aircraft.temp++;
    if (aircraft.temp % aircraft.int == 0) {
      if (aircraft.b_value > 2) {
        aircraft.bullet.list.push({
          x: aircraft.x,
          y: aircraft.y,
        });
        play_sound(aircraft.sound);
        aircraft.b_value -= 5;
      } else {
        aircraft.shoot = false;
        aircraft.b_value += 1;
      }
    }
  }
  if (aircraft.b_value < 100) {
    if (aircraft.temp2 % aircraft.int == 0) {
      if (!aircraft.shoot) {
        aircraft.b_value += 1;
      }
    }
  }
  ctx.beginPath();
  ctx.rect(25 - 4, 65 - 4, 100 * 2 + 8, 10 + 8);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(25, 65, aircraft.b_value * 2, 10);
  ctx.fillStyle = "#eae2e26e";
  ctx.fill();
  ctx.closePath();
}

function draw_bullets() {
  var arr = 0;

  aircraft.bullet.list.forEach((i) => {
    i.y -= aircraft.bullet.speed;
    if (i.y < -10) {
      aircraft.bullet.list.splice(arr, 1);
    }
    arr++;
    ctx.drawImage(aircraft.bullet.img, i.x + 7, i.y);
    ctx.drawImage(aircraft.bullet.img, i.x + 20, i.y);
  });
}
function draw_back() {
  background.y1 += background.speed;
  background.y2 += background.speed;
  background.speed += 0.00001;

  ctx.drawImage(
    background.img,
    0,
    0,
    1650,
    5100,
    0,
    background.y1,
    canvas.width,
    (canvas.width * 5100) / 1650
  );
  ctx.drawImage(
    background.img,
    0,
    0,
    1650,
    5100,
    0,
    background.y2,
    canvas.width,
    (canvas.width * 5100) / 1650
  );

  if (background.y1 >= -20) {
    background.y2 = background.y1 - (canvas.width * 5100) / 1650;
  }
  if (background.y2 >= -20) {
    background.y1 = background.y2 - (canvas.width * 5100) / 1650;
  }
}
function gen_enemies() {
  if (Math.floor(Math.random() * 60) == 1) {
    enemy.list.push({
      x: Math.min(
        Math.floor(Math.random() * (canvas.width - 44) + 14),
        canvas.width - 33
      ),
      y: -30,
      speed: Math.min(
        Math.floor(Math.random() * 5) + background.speed + 1,
        background.speed + 5
      ),
      image: Math.floor(Math.random() * 4),
      status: true,
      cr: 0,
    });
  }
}
function draw_enemies() {
  for (let n = 0; n < enemy.list.length; n++) {
    let i = enemy.list[n];
    ctx.drawImage(enemy.image[i.image].img, i.x, i.y);
    i.y += i.speed;
    if (i.y > canvas.height + 30) {
      enemy.list.splice(n, 1);
      n--;
      //return;
    }
    if (
      aircraft.y >= i.y - aircraft.h &&
      aircraft.y <= i.y + enemy.image[i.image].h - 15 &&
      aircraft.x >= i.x - aircraft.w &&
      aircraft.x <= i.x + enemy.image[i.image].w
    ) {
      if (i.status) {
        i.status = false;
        aircraft.lives -= 1;
        play_sound(enemy.crash_sound);
        if (aircraft.lives <= 0) {
          enemy.list = [];
          aircraft.bullet.list = [];
          if (global_max == undefined || global_max < aircraft.marks) {
            global_max = aircraft.marks;
            localStorage.setItem("gunship_battle_max", aircraft.marks);
          }
          loop = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.font = "45px EvilEmpire-4BBVK";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText(
              "GAme OveR",
              canvas.width / 2,
              canvas.height / 2 - 100
            );
            ctx.fill();
            ctx.font = "30px Comic Sans MS";
            ctx.fillText(
              `HI  : ${global_max}`,
              canvas.width / 2,
              canvas.height / 2 - 20
            );
            ctx.fill();
            ctx.fillText(
              `score:  ${aircraft.marks}`,
              canvas.width / 2,
              canvas.height / 2 + 20
            );
            ctx.fill();
            ctx.closePath();
            document.getElementById("con").classList = "pause";
            document.getElementById("button").textContent = "retry";
          };
          function fff() {
            aircraft.lives = 3;
            aircraft.marks = 0;
            document.getElementById("con").classList = "";
            loop = function () {
              clear();
              draw_back();
              gen_enemies();
              draw_enemies();
              draw_aircraft();
              gen_bullet();
              draw_bullets();
              draw_marks();
              move_aircraft();
              /*   ctx.beginPath();
          ctx.rect(aircraft.x, aircraft.y, aircraft.w, aircraft.h);
          ctx.stroke();
          ctx.closePath(); */
              window.requestAnimationFrame(loop);
            };
            loop();
            document.getElementById("button").removeEventListener("click", fff);
          }
          document.getElementById("button").addEventListener("click", fff);
        }
      }
    }
    if (!i.status) {
      ctx.drawImage(
        enemy.crash_img[i.cr % enemy.crash_img.length],
        i.x + enemy.image[i.image].w / 4,
        i.y + enemy.image[i.image].h / 4
      );

      i.cr++;
      if (i.cr > enemy.crash_img.length) {
        enemy.list.splice(n, 1);
        n--;
      }
    }
    aircraft.bullet.list.forEach((e, nn) => {
      if (i.x <= e.x + 27 && i.x + enemy.image[i.image].w >= e.x + 14) {
        if (i.y <= e.y && i.y + enemy.image[i.image].h >= e.y + 20) {
          if (i.status) {
            i.status = false;

            aircraft.bullet.list.splice(nn, 3);
            aircraft.marks += 2;
            play_sound(enemy.crash_sound);
          }
        }
      }
    });
  }
}
function draw_marks() {
  aircraft.lives = Math.min(aircraft.lives, 4);
  for (let i = 0; i < aircraft.lives; i++) {
    ctx.drawImage(aircraft.hartImg, 20 + i * 30, 20);
  }
  ctx.beginPath();
  ctx.textAlign = "right";
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";
  ctx.fillText(aircraft.marks, canvas.width - 10, 44);
  ctx.fill();
  ctx.closePath();
}

function loop() {
  clear();
  draw_back();
  gen_enemies();
  draw_enemies();
  draw_aircraft();
  gen_bullet();
  draw_bullets();
  draw_marks();
  move_aircraft();

  window.requestAnimationFrame(loop);
}
